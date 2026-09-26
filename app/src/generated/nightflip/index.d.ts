import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum RoundState { OPEN = 0, CLOSED = 1, REVEALED = 2 }

export enum BetState { ACTIVE = 0, CLAIMED = 1, REFUNDED = 2 }

export type Round = { commitment: Uint8Array;
                      seed: Uint8Array;
                      outcome: boolean;
                      state: RoundState;
                      closeAt: bigint;
                      revealBy: bigint;
                      betCount: bigint
                    };

export type Bet = { roundId: bigint;
                    player: { bytes: Uint8Array };
                    ownerKey: Uint8Array;
                    choiceCommitment: Uint8Array;
                    state: BetState
                  };

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  registerPlayer(context: __compactRuntime.CircuitContext<PS>,
                 address_0: { bytes: Uint8Array },
                 playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  openRound(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: Uint8Array,
            closeAt_0: bigint,
            revealBy_0: bigint,
            operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeRound(context: __compactRuntime.CircuitContext<PS>,
             roundId_0: bigint,
             operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealRound(context: __compactRuntime.CircuitContext<PS>,
              roundId_0: bigint,
              seed_0: Uint8Array,
              operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  placeBet(context: __compactRuntime.CircuitContext<PS>,
           address_0: { bytes: Uint8Array },
           roundId_0: bigint,
           choice_0: boolean,
           salt_0: Uint8Array,
           playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  claimWin(context: __compactRuntime.CircuitContext<PS>,
           betId_0: bigint,
           choice_0: boolean,
           salt_0: Uint8Array,
           playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  refundExpired(context: __compactRuntime.CircuitContext<PS>,
                betId_0: bigint,
                playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>,
            value_0: boolean,
            operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  fundBankroll(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  registerPlayer(context: __compactRuntime.CircuitContext<PS>,
                 address_0: { bytes: Uint8Array },
                 playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  openRound(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: Uint8Array,
            closeAt_0: bigint,
            revealBy_0: bigint,
            operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeRound(context: __compactRuntime.CircuitContext<PS>,
             roundId_0: bigint,
             operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealRound(context: __compactRuntime.CircuitContext<PS>,
              roundId_0: bigint,
              seed_0: Uint8Array,
              operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  placeBet(context: __compactRuntime.CircuitContext<PS>,
           address_0: { bytes: Uint8Array },
           roundId_0: bigint,
           choice_0: boolean,
           salt_0: Uint8Array,
           playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  claimWin(context: __compactRuntime.CircuitContext<PS>,
           betId_0: bigint,
           choice_0: boolean,
           salt_0: Uint8Array,
           playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  refundExpired(context: __compactRuntime.CircuitContext<PS>,
                betId_0: bigint,
                playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>,
            value_0: boolean,
            operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  fundBankroll(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  keyOf(secret_0: Uint8Array): Uint8Array;
  roundCommit(roundId_0: bigint, seed_0: Uint8Array): Uint8Array;
  choiceCommit(choice_0: boolean,
               salt_0: Uint8Array,
               ownerKey_0: Uint8Array,
               roundId_0: bigint): Uint8Array;
  outcomeOf(roundId_0: bigint, seed_0: Uint8Array): boolean;
}

export type Circuits<PS> = {
  keyOf(context: __compactRuntime.CircuitContext<PS>, secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  roundCommit(context: __compactRuntime.CircuitContext<PS>,
              roundId_0: bigint,
              seed_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  choiceCommit(context: __compactRuntime.CircuitContext<PS>,
               choice_0: boolean,
               salt_0: Uint8Array,
               ownerKey_0: Uint8Array,
               roundId_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  outcomeOf(context: __compactRuntime.CircuitContext<PS>,
            roundId_0: bigint,
            seed_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  registerPlayer(context: __compactRuntime.CircuitContext<PS>,
                 address_0: { bytes: Uint8Array },
                 playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  openRound(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: Uint8Array,
            closeAt_0: bigint,
            revealBy_0: bigint,
            operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeRound(context: __compactRuntime.CircuitContext<PS>,
             roundId_0: bigint,
             operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealRound(context: __compactRuntime.CircuitContext<PS>,
              roundId_0: bigint,
              seed_0: Uint8Array,
              operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  placeBet(context: __compactRuntime.CircuitContext<PS>,
           address_0: { bytes: Uint8Array },
           roundId_0: bigint,
           choice_0: boolean,
           salt_0: Uint8Array,
           playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  claimWin(context: __compactRuntime.CircuitContext<PS>,
           betId_0: bigint,
           choice_0: boolean,
           salt_0: Uint8Array,
           playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  refundExpired(context: __compactRuntime.CircuitContext<PS>,
                betId_0: bigint,
                playerSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>,
            value_0: boolean,
            operatorSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  fundBankroll(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly operatorKey: Uint8Array;
  readonly paused: boolean;
  readonly latestRoundId: bigint;
  readonly nextBetId: bigint;
  rounds: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Round;
    [Symbol.iterator](): Iterator<[bigint, Round]>
  };
  bets: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Bet;
    [Symbol.iterator](): Iterator<[bigint, Bet]>
  };
  players: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: { bytes: Uint8Array }): boolean;
    lookup(key_0: { bytes: Uint8Array }): Uint8Array;
    [Symbol.iterator](): Iterator<[{ bytes: Uint8Array }, Uint8Array]>
  };
  readonly playerCount: bigint;
  readonly betCount: bigint;
  readonly reservedPayout: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               operatorSecret_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
