type WalletConnection = {
  getConnectionStatus(): Promise<unknown>;
  getConfiguration(): Promise<{ indexerUri: string; proverServerUri?: string }>;
  getShieldedAddresses(): Promise<{ shieldedCoinPublicKey: string }>;
};
type WalletConnector = { apiVersion: string; connect(network: string): Promise<WalletConnection> };

declare global { interface Window { midnight?: Record<string, unknown> } }

export type WalletInfo = { coinPublicKey: string; indexerUri: string; proverServerUri: string | null };

export async function connectPreprodWallet(): Promise<WalletInfo> {
  const connector = Object.values(window.midnight || {}).find((candidate): candidate is WalletConnector => {
    if (!candidate || typeof candidate !== 'object') return false;
    const maybe = candidate as Partial<WalletConnector>;
    return typeof maybe.apiVersion === 'string' && /^4\./.test(maybe.apiVersion) && typeof maybe.connect === 'function';
  });
  if (!connector) throw new Error('No compatible Lace Midnight wallet found. Install or enable a connector with API version 4.x.');
  const wallet = await connector.connect('preprod');
  await wallet.getConnectionStatus();
  const [config, addresses] = await Promise.all([wallet.getConfiguration(), wallet.getShieldedAddresses()]);
  if (!addresses.shieldedCoinPublicKey || !config.indexerUri) throw new Error('Wallet connected but did not provide a Preprod public key or indexer.');
  return { coinPublicKey: addresses.shieldedCoinPublicKey, indexerUri: config.indexerUri, proverServerUri: config.proverServerUri || null };
}
