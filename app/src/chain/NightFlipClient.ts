import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { Transaction } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';
import type { WalletInfo } from '../wallet/lace';
import * as Generated from '../generated/nightflip/index.js';

type Side = 'MOON' | 'SHADOW';
type StoredPlayer = { secret: string; bets: Array<{ id: string; choice: Side; salt: string; roundId: string }> };

export type ChainRound = {
  id: string;
  state: 'OPEN' | 'CLOSED' | 'REVEALED';
  closeAt: number;
  revealBy: number;
  betCount: number;
  outcome?: Side;
};

function bytesToBase64(value: Uint8Array) {
  return btoa(String.fromCharCode(...value));
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function random32() {
  const value = new Uint8Array(32);
  crypto.getRandomValues(value);
  return value;
}

function playerStorageKey(contractAddress: string, address: string) {
  return `nightflip:player:v1:${contractAddress}:${address}`;
}

function makePrivateStateProvider(): PrivateStateProvider {
  const signingKeys = new Map<string, unknown>();
  return {
    setContractAddress: () => undefined,
    setSigningKey: async (address: string, key: unknown) => { signingKeys.set(address, key); },
    getSigningKey: async (address: string) => signingKeys.get(address) ?? null,
    removeSigningKey: async (address: string) => { signingKeys.delete(address); },
    clearSigningKeys: async () => { signingKeys.clear(); },
  } as unknown as PrivateStateProvider;
}

export class NightFlipClient {
  private constructor(
    private readonly wallet: WalletInfo,
    private readonly contractAddress: string,
    private readonly addressBytes: Uint8Array,
    private readonly found: Awaited<ReturnType<typeof findDeployedContract>>,
    private readonly publicDataProvider: ReturnType<typeof indexerPublicDataProvider>,
  ) {}

  static async connect(wallet: WalletInfo, contractAddress: string) {
    if (!wallet.proofServerUri) throw new Error('Lace did not provide a Preprod proof server URL. Update Lace and reconnect.');
    const compiled = CompiledContract.make('NightFlip', Generated.Contract).pipe(CompiledContract.withWitnesses({}));
    const zkConfigProvider = new FetchZkConfigProvider(`${window.location.origin}/zk`, fetch.bind(window));
    const decodedAddress = MidnightBech32m.parse(wallet.unshieldedAddress).decode(UnshieldedAddress, 'preprod');
    const publicDataProvider = indexerPublicDataProvider(wallet.indexerUri, wallet.indexerWsUri);
    const providers = {
      privateStateProvider: makePrivateStateProvider(),
      publicDataProvider,
      zkConfigProvider,
      proofProvider: httpClientProofProvider(wallet.proofServerUri!, zkConfigProvider),
      walletProvider: {
        getCoinPublicKey: () => wallet.shieldedCoinPublicKey,
        getEncryptionPublicKey: () => wallet.shieldedEncryptionPublicKey,
        balanceTx: async (unbound: { serialize: () => Uint8Array }) => {
          const response = await wallet.connected.balanceUnsealedTransaction(toHex(unbound.serialize()));
          return Transaction.deserialize('signature', 'proof', 'binding', fromHex(response.tx));
        },
      },
      midnightProvider: {
        submitTx: async (transaction: { serialize: () => Uint8Array; identifiers: () => readonly string[] }) => {
          await wallet.connected.submitTransaction(toHex(transaction.serialize()));
          return transaction.identifiers()[0];
        },
      },
    };
    const found = await findDeployedContract(providers as never, { contractAddress: contractAddress as never, compiledContract: compiled as never });
    return new NightFlipClient(wallet, contractAddress, new Uint8Array(decodedAddress.data), found, publicDataProvider);
  }

  private getStoredPlayer(): StoredPlayer {
    const key = playerStorageKey(this.contractAddress, this.wallet.unshieldedAddress);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as StoredPlayer;
    const player = { secret: bytesToBase64(random32()), bets: [] };
    localStorage.setItem(key, JSON.stringify(player));
    return player;
  }

  private savePlayer(player: StoredPlayer) {
    localStorage.setItem(playerStorageKey(this.contractAddress, this.wallet.unshieldedAddress), JSON.stringify(player));
  }

  async getRound(): Promise<ChainRound | null> {
    const state = await this.publicDataProvider.queryContractState(this.contractAddress as never);
    if (!state) return null;
    const ledger = Generated.ledger(state.data);
    if (ledger.latestRoundId === 0n) return null;
    const round = ledger.rounds.lookup(ledger.latestRoundId);
    const states = ['OPEN', 'CLOSED', 'REVEALED'] as const;
    return {
      id: ledger.latestRoundId.toString(), state: states[round.state], closeAt: Number(round.closeAt), revealBy: Number(round.revealBy),
      betCount: Number(round.betCount), outcome: round.state === Generated.RoundState.REVEALED ? (round.outcome ? 'MOON' : 'SHADOW') : undefined,
    };
  }

  async isRegistered() {
    const state = await this.publicDataProvider.queryContractState(this.contractAddress as never);
    return Boolean(state && Generated.ledger(state.data).players.member({ bytes: this.addressBytes }));
  }

  async registerPlayer() {
    const player = this.getStoredPlayer();
    const tx = await this.found.callTx.registerPlayer({ bytes: this.addressBytes }, base64ToBytes(player.secret));
    return tx.public.txHash;
  }

  async placeBet(choice: Side) {
    const round = await this.getRound();
    if (!round || round.state !== 'OPEN') throw new Error('There is no open NightFlip round. Wait for the operator to open the next table.');
    const player = this.getStoredPlayer();
    const salt = random32();
    const tx = await this.found.callTx.placeBet(
      { bytes: this.addressBytes }, BigInt(round.id), choice === 'MOON', salt, base64ToBytes(player.secret),
    );
    const betId = String(tx.private.result);
    player.bets = [...player.bets, { id: betId, choice, salt: bytesToBase64(salt), roundId: round.id }];
    this.savePlayer(player);
    return { txHash: tx.public.txHash, betId, round };
  }

  async claim(betId: string) {
    const bet = this.getStoredPlayer().bets.find((entry) => entry.id === betId);
    if (!bet) throw new Error('This browser does not hold the private receipt for that bet.');
    const tx = await this.found.callTx.claimWin(BigInt(bet.id), bet.choice === 'MOON', base64ToBytes(bet.salt), base64ToBytes(this.getStoredPlayer().secret));
    return tx.public.txHash;
  }

  async refund(betId: string) {
    const bet = this.getStoredPlayer().bets.find((entry) => entry.id === betId);
    if (!bet) throw new Error('This browser does not hold the private receipt for that bet.');
    const tx = await this.found.callTx.refundExpired(BigInt(bet.id), base64ToBytes(this.getStoredPlayer().secret));
    return tx.public.txHash;
  }
}
