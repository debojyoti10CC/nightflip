import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';

export type WalletInfo = {
  walletName: string;
  unshieldedAddress: string;
  shieldedCoinPublicKey: string;
  shieldedEncryptionPublicKey: string;
  indexerUri: string;
  indexerWsUri: string;
  nodeUri: string;
  proofServerUri: string | null;
  dustBalance: bigint;
  dustCap: bigint;
  connected: ConnectedAPI;
};

const compatibleWallets = (): InitialAPI[] => Object.values(window.midnight ?? {})
  .filter((wallet) => /^4\./.test(wallet.apiVersion));

export function hasPreprodWallet(): boolean {
  return compatibleWallets().length > 0;
}

export async function connectPreprodWallet(): Promise<WalletInfo> {
  const wallets = compatibleWallets();
  if (!wallets.length) {
    throw new Error('No Midnight wallet with DApp Connector API 4.x was found. Install or enable Lace Midnight, then reload this page.');
  }

  const selected = wallets[0];
  const connected = await selected.connect('preprod');
  await connected.hintUsage(['getUnshieldedAddress', 'getShieldedAddresses', 'getConfiguration', 'getDustBalance']);
  const [status, address, shielded, config, dust] = await Promise.all([
    connected.getConnectionStatus(),
    connected.getUnshieldedAddress(),
    connected.getShieldedAddresses(),
    connected.getConfiguration(),
    connected.getDustBalance(),
  ]);

  if (status.status !== 'connected' || status.networkId !== 'preprod' || config.networkId !== 'preprod') {
    throw new Error('Your wallet is not connected to Midnight Preprod. Switch Lace to Preprod and try again.');
  }
  if (!address.unshieldedAddress.startsWith('mn_addr_preprod')) {
    throw new Error('Lace returned an address for a different network. Select Preprod in the wallet and reconnect.');
  }

  return {
    walletName: selected.name,
    unshieldedAddress: address.unshieldedAddress,
    shieldedCoinPublicKey: shielded.shieldedCoinPublicKey,
    shieldedEncryptionPublicKey: shielded.shieldedEncryptionPublicKey,
    indexerUri: config.indexerUri,
    indexerWsUri: config.indexerWsUri,
    nodeUri: config.substrateNodeUri,
    proofServerUri: config.proverServerUri ?? null,
    dustBalance: dust.balance,
    dustCap: dust.cap,
    connected,
  };
}
