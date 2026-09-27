import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const endpoints = {
  chain: 'Midnight Preprod',
  network: 'preprod',
  rpc: 'https://rpc.preprod.midnight.network',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
};
const blockBatchSize = 20;
const concurrentBatches = 4;

function asContractAddress(value) {
  const normalized = String(value ?? '').toLowerCase();
  return /^[0-9a-f]{64}$/.test(normalized) ? normalized : null;
}

function asPreprodUnshieldedAddress(value) {
  const normalized = String(value ?? '').toLowerCase();
  return normalized.startsWith('mn_addr_preprod') ? normalized : null;
}

async function readProjectFile(relativePath) {
  return readFile(resolve(root, relativePath), 'utf8');
}

function addressesDocumentedAsContracts(text) {
  const addresses = new Set();
  for (const line of text.split(/\r?\n/)) {
    if (!/contract|vite_nightflip_contract_address/i.test(line)) continue;
    for (const match of line.matchAll(/(?<![0-9a-f])[0-9a-f]{64}(?![0-9a-f])/gi)) {
      const address = asContractAddress(match[0]);
      if (address) addresses.add(address);
    }
  }
  return addresses;
}

function receiptBlockHeights(text) {
  const heights = new Set();
  for (const line of text.split(/\r?\n/)) {
    // Receipt rows have action, canonical transaction hash, block height, and result.
    const match = line.match(/^\|\s*[^|]+\|\s*`?[0-9a-f]{64}`?\s*\|\s*(\d+)\s*\|/i);
    if (match) heights.add(Number(match[1]));
  }
  return [...heights];
}

async function graphql(query, variables = undefined) {
  const response = await fetch(endpoints.indexer, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Preprod indexer returned HTTP ${response.status}`);
  const body = await response.json();
  if (body.errors?.length) throw new Error(`Preprod indexer GraphQL error: ${body.errors.map((error) => error.message).join('; ')}`);
  return body.data;
}

async function graphqlWithRetry(query, variables) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await graphql(query, variables);
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolveDelay) => setTimeout(resolveDelay, 250 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function rpc(method) {
  const response = await fetch(endpoints.rpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: [] }),
  });
  if (!response.ok) throw new Error(`Preprod RPC returned HTTP ${response.status}`);
  const body = await response.json();
  if (body.error) throw new Error(`Preprod RPC ${method} failed: ${body.error.message ?? JSON.stringify(body.error)}`);
  return body.result;
}

function batchQuery(start, end) {
  const blocks = [];
  for (let height = start; height <= end; height += 1) {
    blocks.push(`b${height}: block(offset: { height: ${height} }) {
      height
      transactions {
        hash
        contractActions { address }
        unshieldedCreatedOutputs { owner }
        unshieldedSpentOutputs { owner }
      }
    }`);
  }
  return `query ScanBlocks { ${blocks.join('\n')} }`;
}

async function main() {
  const [receiptText, envText] = await Promise.all([
    readProjectFile('docs/PREPROD_RECEIPTS.md'),
    readProjectFile('app/.env.production'),
  ]);
  const configuredContracts = new Set([
    ...addressesDocumentedAsContracts(receiptText),
    ...addressesDocumentedAsContracts(envText),
  ]);
  const receiptHeights = receiptBlockHeights(receiptText);
  if (configuredContracts.size === 0) throw new Error('No project contract addresses were found in the committed Preprod configuration or receipt record.');
  if (receiptHeights.length === 0) throw new Error('No verified deployment receipt blocks were found in docs/PREPROD_RECEIPTS.md.');

  const [chainName, indexerData] = await Promise.all([
    rpc('system_chain'),
    graphql('{ block { height } }'),
  ]);
  if (chainName !== endpoints.chain) throw new Error(`Refusing to scan: expected ${endpoints.chain}, received ${JSON.stringify(chainName)}.`);
  const tip = Number(indexerData.block?.height);
  if (!Number.isSafeInteger(tip) || tip <= 0) throw new Error(`Preprod indexer did not return a usable block height: ${JSON.stringify(indexerData)}.`);

  const firstBlock = Math.min(...receiptHeights);
  if (firstBlock > tip) throw new Error(`Receipt block ${firstBlock} is ahead of Preprod indexer tip ${tip}.`);

  const observableWallets = new Set();
  const observedContracts = new Set();
  const transactionHashes = new Set();
  let blocksScanned = 0;

  for (let cursor = firstBlock; cursor <= tip; cursor += blockBatchSize * concurrentBatches) {
    const requests = [];
    for (let group = 0; group < concurrentBatches; group += 1) {
      const start = cursor + group * blockBatchSize;
      if (start > tip) break;
      requests.push(graphqlWithRetry(batchQuery(start, Math.min(start + blockBatchSize - 1, tip))));
    }
    const results = await Promise.all(requests);
    for (const result of results) {
      for (const block of Object.values(result)) {
        if (!block) throw new Error('Preprod indexer returned a missing block during the requested scan range.');
        blocksScanned += 1;
        for (const transaction of block.transactions) {
          const matchingActions = transaction.contractActions.filter(({ address }) => configuredContracts.has(asContractAddress(address)));
          if (matchingActions.length === 0) continue;
          transactionHashes.add(transaction.hash.toLowerCase());
          for (const { address } of matchingActions) observedContracts.add(asContractAddress(address));
          for (const output of [...transaction.unshieldedCreatedOutputs, ...transaction.unshieldedSpentOutputs]) {
            const owner = asPreprodUnshieldedAddress(output.owner);
            if (owner) observableWallets.add(owner);
          }
        }
      }
    }
  }

  if (blocksScanned !== tip - firstBlock + 1) {
    throw new Error(`Incomplete scan: requested ${tip - firstBlock + 1} blocks but received ${blocksScanned}.`);
  }
  if (observedContracts.size === 0) throw new Error('No configured project contract was found in actual Preprod transaction data.');

  // Contract identifiers are tracked separately and never enter the wallet set.
  console.log(`Network: ${endpoints.network[0].toUpperCase()}${endpoints.network.slice(1)}`);
  console.log(`Distinct observable wallet addresses: ${observableWallets.size}`);
  console.log(`Transactions scanned: ${transactionHashes.size}`);
  console.log(`Blocks scanned: ${blocksScanned}`);
  console.log(`Contract addresses excluded: ${observedContracts.size}`);
}

await main();
