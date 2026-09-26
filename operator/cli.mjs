import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { firstValueFrom } from 'rxjs';
import pino from 'pino';
import { FluentWalletBuilder } from '@midnight-ntwrk/testkit-js';
import { DustSecretKey, LedgerParameters, ZswapSecretKeys, unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { createKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { ttlOneHour } from '@midnight-ntwrk/midnight-js-utils';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const storePath = resolve(root, 'data/operator-preprod.json');
const artifactsPath = resolve(root, 'contract/src/managed/nightflip');
const logger = pino({ level: process.env.NIGHTFLIP_OPERATOR_LOG_LEVEL ?? 'warn' });
const env = {
  walletNetworkId: 'preprod', networkId: 'preprod',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  nodeWS: 'wss://rpc.preprod.midnight.network',
  proofServer: process.env.NIGHTFLIP_PROOF_SERVER_URL ?? 'http://127.0.0.1:6300',
  faucet: 'https://midnight-tmnight-preprod.nethermind.dev/',
};

setNetworkId('preprod');

const command = process.argv[2] ?? 'help';
const argument = process.argv[3];

function hexBytes(value, name) {
  if (!/^[a-f0-9]{64}$/i.test(value ?? '')) throw new Error(`${name} must be a 32-byte hex value`);
  return Uint8Array.from(Buffer.from(value, 'hex'));
}

async function submitTransaction(wallet, transaction) {
  try {
    return await wallet.submitTransaction(transaction);
  } catch (error) {
    const effectCause = error?.[Symbol.for('effect/Runtime/FiberFailure/Cause')];
    const nodeFailure = effectCause?.error?.cause;
    const txData = nodeFailure?.txData;
    if (!(txData instanceof Uint8Array) || !String(nodeFailure?.cause?.message ?? '').includes('disconnected')) throw error;
    const { ApiPromise, WsProvider } = await import('@polkadot/api');
    const api = await ApiPromise.create({ provider: new WsProvider(env.nodeWS), noInitWarn: true });
    try {
      const hash = await new Promise((resolveHash, rejectHash) => {
        let unsubscribe;
        const onResult = (result) => {
          if (result.dispatchError) rejectHash(new Error(`Preprod transaction rejected: ${result.dispatchError.toString()}`));
          if (result.status.isInBlock || result.status.isFinalized) resolveHash(result.txHash.toString());
        };
        api.tx.midnight.sendMnTransaction(`0x${Buffer.from(txData).toString('hex')}`)
          .send(onResult).then((stop) => { unsubscribe = stop; }).catch(rejectHash);
      });
      console.log('Submitted through a persistent Preprod WebSocket connection.');
      return hash;
    } finally {
      await api.disconnect();
    }
  }
}

async function readStore() {
  const data = JSON.parse(await readFile(storePath, 'utf8'));
  hexBytes(data.walletSeed, 'walletSeed');
  hexBytes(data.operatorSecret, 'operatorSecret');
  return data;
}

async function saveStore(data, exclusive = false) {
  await mkdir(resolve(root, 'data'), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(data, null, 2)}\n`, { flag: exclusive ? 'wx' : 'w', mode: 0o600 });
}

async function buildWallet(seed, start = true) {
  const dustOptions = {
    ledgerParams: LedgerParameters.initialParameters(),
    additionalFeeOverhead: 1_000n,
    feeBlocksMargin: 5,
  };
  const { wallet, seeds, keystore } = await FluentWalletBuilder.forEnvironment(env)
    .withDustOptions(dustOptions).withSeed(seed).buildWithoutStarting();
  const zswapSecretKeys = ZswapSecretKeys.fromSeed(seeds.shielded);
  const dustSecretKey = DustSecretKey.fromSeed(seeds.dust);
  const provider = {
    getCoinPublicKey: () => zswapSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => zswapSecretKeys.encryptionPublicKey,
    async balanceTx(tx, ttl = ttlOneHour()) {
      const recipe = await wallet.balanceUnboundTransaction(tx, { shieldedSecretKeys: zswapSecretKeys, dustSecretKey }, { ttl });
      const signed = await wallet.signRecipe(recipe, (payload) => keystore.signData(payload));
      return wallet.finalizeRecipe(signed);
    },
    submitTx: (tx) => submitTransaction(wallet, tx),
  };
  if (start) await wallet.start(zswapSecretKeys, dustSecretKey);
  const state = await firstValueFrom(wallet.unshielded.state);
  const address = UnshieldedAddress.codec.encode('preprod', state.address).toString();
  return { wallet, provider, address, state };
}

async function waitForFunds(wallet) {
  const token = unshieldedToken().raw;
  const state = await wallet.unshielded.waitForSyncedState();
  const balance = state.balances[token] ?? 0n;
  if (balance === 0n) throw new Error('Operator wallet has no tNIGHT. Fund its address using the official Preprod faucet.');
  return balance;
}

async function registerDust(wallet, walletSeed) {
  console.log('Reading funded NIGHT outputs...');
  const state = await wallet.unshielded.waitForSyncedState();
  const utxos = state.availableCoins.filter((coin) => !coin.meta.registeredForDustGeneration);
  if (utxos.length === 0) return null;
  const hd = HDWallet.fromSeed(Buffer.from(walletSeed, 'hex'));
  if (hd.type !== 'seedOk') throw new Error('Operator seed could not derive an unshielded key');
  const derived = hd.hdWallet.selectAccount(0).selectRole(Roles.NightExternal).deriveKeyAt(0);
  if (derived.type === 'keyOutOfBounds') throw new Error('Unshielded key derivation failed');
  const keystore = createKeystore(derived.key, 'preprod');
  console.log(`Registering ${utxos.length} NIGHT output(s) for DUST...`);
  const dustAddress = await wallet.dust.getAddress();
  const recipe = await wallet.registerNightUtxosForDustGeneration(
    utxos, keystore.getPublicKey(), (payload) => keystore.signData(payload), dustAddress,
  );
  const transaction = await wallet.finalizeRecipe(recipe);
  return submitTransaction(wallet, transaction);
}

async function compiledContract() {
  const info = JSON.parse(await readFile(resolve(artifactsPath, 'compiler/contract-info.json'), 'utf8'));
  if (info['compiler-version'] !== '0.31.1') throw new Error('Refusing to deploy: compile NightFlip with vetted Compact 0.31.1 first');
  const generated = await import('../contract/src/managed/nightflip/contract/index.js');
  return {
    generated,
    compiled: CompiledContract.make('NightFlip', generated.Contract).pipe(
      CompiledContract.withWitnesses({}),
      CompiledContract.withCompiledFileAssets(artifactsPath),
    ),
  };
}

function makeProviders(store, account) {
  const zkConfigProvider = new NodeZkConfigProvider(artifactsPath);
  return {
    privateStateProvider: levelPrivateStateProvider({
      midnightDbName: resolve(root, 'data/operator-state'),
      privateStateStoreName: 'nightflip-private-state',
      signingKeyStoreName: 'nightflip-signing-keys',
      privateStoragePasswordProvider: () => `Nf!${store.operatorSecret}`,
      accountId: account,
    }),
    publicDataProvider: indexerPublicDataProvider(env.indexer, env.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(env.proofServer, zkConfigProvider),
  };
}

async function withWallet(action) {
  const store = await readStore();
  const account = await buildWallet(store.walletSeed);
  try {
    return await action(store, account);
  } finally {
    await account.wallet.stop();
  }
}

async function contractContext(store, account) {
  const { generated, compiled } = await compiledContract();
  const providers = { ...makeProviders(store, account.address), walletProvider: account.provider, midnightProvider: account.provider };
  if (!store.contractAddress) throw new Error('No deployed contract recorded. Run operator deploy first.');
  const found = await findDeployedContract(providers, { contractAddress: store.contractAddress, compiledContract: compiled });
  return { generated, providers, found };
}

function printReceipt(action, publicData) {
  console.log(JSON.stringify({ action, network: 'preprod', txHash: publicData.txHash, blockHeight: publicData.blockHeight, contractAddress: publicData.contractAddress }, null, 2));
}

switch (command) {
  case 'init': {
    const store = { walletSeed: randomBytes(32).toString('hex'), operatorSecret: randomBytes(32).toString('hex'), contractAddress: null, rounds: {} };
    await saveStore(store, true);
    console.log(`Operator wallet created in ignored local store: ${storePath}`);
    console.log('Back up this file securely. Run: npm run operator -- address');
    break;
  }
  case 'address': {
    await withWallet(async (_, { address, wallet }) => {
      const state = await wallet.unshielded.waitForSyncedState();
      const dustState = await firstValueFrom(wallet.dust.state);
      const balance = state.balances[unshieldedToken().raw] ?? 0n;
      console.log(JSON.stringify({
        network: 'preprod', address, nightStarBalance: balance.toString(),
        dustSpeckBalance: dustState.balance(new Date()).toString(), faucet: env.faucet,
      }, null, 2));
    });
    break;
  }
  case 'register-dust': {
    await withWallet(async (store, { wallet }) => {
      console.log('Syncing Preprod operator wallet...');
      await waitForFunds(wallet);
      const txHash = await registerDust(wallet, store.walletSeed);
      console.log(txHash ? `DUST registration submitted: ${txHash}` : 'All available NIGHT outputs are already registered for DUST generation.');
    });
    break;
  }
  case 'deploy': {
    await withWallet(async (store, account) => {
      if (store.contractAddress) throw new Error(`Already deployed at ${store.contractAddress}`);
      await waitForFunds(account.wallet);
      const { compiled } = await compiledContract();
      const providers = { ...makeProviders(store, account.address), walletProvider: account.provider, midnightProvider: account.provider };
      const deployed = await deployContract(providers, { compiledContract: compiled, args: [hexBytes(store.operatorSecret, 'operatorSecret')] });
      store.contractAddress = deployed.deployTxData.public.contractAddress;
      await saveStore(store);
      printReceipt('deploy', deployed.deployTxData.public);
    });
    break;
  }
  case 'fund': {
    const night = Number(argument);
    if (!Number.isSafeInteger(night) || night < 1 || night > 1_000) throw new Error('Usage: npm run operator -- fund <whole tNIGHT, 1-1000>');
    await withWallet(async (store, account) => {
      const { found } = await contractContext(store, account);
      const tx = await found.callTx.fundBankroll(BigInt(night) * 1_000_000n);
      printReceipt('fundBankroll', tx.public);
    });
    break;
  }
  case 'open': {
    const minutes = argument == null ? 5 : Number(argument);
    if (!Number.isSafeInteger(minutes) || minutes < 2 || minutes > 60) throw new Error('Usage: npm run operator -- open <minutes 2-60>');
    await withWallet(async (store, account) => {
      const { generated, providers, found } = await contractContext(store, account);
      const state = await providers.publicDataProvider.queryContractState(store.contractAddress);
      if (!state) throw new Error('Contract state not indexed yet');
      const ledger = generated.ledger(state.data);
      const roundId = ledger.latestRoundId + 1n;
      const seed = randomBytes(32);
      const commitment = generated.pureCircuits.roundCommit(roundId, seed);
      const closeAt = BigInt(Date.now() + minutes * 60_000);
      const revealBy = closeAt + 5n * 60_000n;
      store.rounds[roundId.toString()] = { seed: seed.toString('hex'), closeAt: closeAt.toString(), revealBy: revealBy.toString() };
      await saveStore(store);
      const tx = await found.callTx.openRound(commitment, closeAt, revealBy, hexBytes(store.operatorSecret, 'operatorSecret'));
      printReceipt('openRound', tx.public);
      console.log(`Round ${roundId} open until ${new Date(Number(closeAt)).toISOString()}`);
    });
    break;
  }
  case 'close':
  case 'reveal': {
    const id = BigInt(argument ?? '0');
    if (id < 1n) throw new Error(`Usage: npm run operator -- ${command} <round-id>`);
    await withWallet(async (store, account) => {
      const { found } = await contractContext(store, account);
      const secret = hexBytes(store.operatorSecret, 'operatorSecret');
      const tx = command === 'close'
        ? await found.callTx.closeRound(id, secret)
        : await found.callTx.revealRound(id, hexBytes(store.rounds[id]?.seed, 'round seed'), secret);
      printReceipt(command === 'close' ? 'closeRound' : 'revealRound', tx.public);
    });
    break;
  }
  case 'status': {
    await withWallet(async (store, account) => {
      const { generated, providers } = await contractContext(store, account);
      const state = await providers.publicDataProvider.queryContractState(store.contractAddress);
      if (!state) throw new Error('Contract not indexed yet');
      const ledger = generated.ledger(state.data);
      const round = ledger.latestRoundId > 0n ? ledger.rounds.lookup(ledger.latestRoundId) : null;
      console.log(JSON.stringify({ contractAddress: store.contractAddress, latestRoundId: ledger.latestRoundId.toString(), roundState: round?.state ?? null, betCount: round?.betCount?.toString() ?? '0', closeAt: round?.closeAt?.toString() ?? null, revealBy: round?.revealBy?.toString() ?? null, paused: ledger.paused, reservedPayout: ledger.reservedPayout.toString() }, null, 2));
    });
    break;
  }
  case 'help':
    console.log('NightFlip Preprod operator: init | address | register-dust | deploy | fund <NIGHT> | open [minutes] | close <round-id> | reveal <round-id> | status');
    break;
  default:
    throw new Error(`Unknown command: ${command}`);
}
