import { strict as assert } from 'node:assert';

const network = {
  id: 'preprod',
  chain: 'Midnight Preprod',
  node: 'https://rpc.preprod.midnight.network',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
};

const rpc = async (method) => {
  const response = await fetch(network.node, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: [] }),
  });
  if (!response.ok) throw new Error(`Preprod RPC returned HTTP ${response.status}`);
  return response.json();
};

const indexerBlock = async () => {
  const response = await fetch(network.indexer, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: '{ block { height } }' }),
  });
  if (!response.ok) throw new Error(`Preprod indexer returned HTTP ${response.status}`);
  return response.json();
};

const [chain, block] = await Promise.all([rpc('system_chain'), indexerBlock()]);
assert.equal(chain.result, network.chain, `Expected ${network.chain}; received ${chain.result ?? JSON.stringify(chain)}`);
assert.ok(Number(block.data?.block?.height) > 0, `Indexer has no usable block height: ${JSON.stringify(block)}`);
console.log(`Preprod healthy: ${chain.result}; indexer block ${block.data.block.height}.`);
