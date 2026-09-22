import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createCircuitContext, createConstructorContext, sampleContractAddress } from '@midnight-ntwrk/compact-runtime';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { BetState, Contract, RoundState, ledger } from '../src/managed/nightflip/contract/index.js';

setNetworkId('undeployed');

const operator = randomBytes(32);
const player = randomBytes(32);
const address = { bytes: randomBytes(32) };
const now = BigInt(Math.floor(Date.now() / 1000));

function game() {
  const contract = new Contract({});
  const initial = contract.initialState(createConstructorContext({}, '0'.repeat(64)), operator);
  let context = createCircuitContext(
    sampleContractAddress(),
    initial.currentZswapLocalState,
    initial.currentContractState,
    initial.currentPrivateState,
  );
  let simulatedBalance: { token: any; amount: bigint } | undefined;
  let simulatedTime: bigint | undefined;
  const call = (name: keyof typeof contract.impureCircuits, ...args: any[]) => {
    context.currentQueryContext.block = {
      ...context.currentQueryContext.block,
      ...(simulatedBalance ? { balance: new Map([[simulatedBalance.token, simulatedBalance.amount]]) } : {}),
      ...(simulatedTime ? { secondsSinceEpoch: simulatedTime } : {}),
    };
    const result = (contract.impureCircuits[name] as any)(context, ...args);
    context = result.context;
    return result.result;
  };
  const state = () => ledger(context.currentQueryContext.state);
  const pure = (name: keyof typeof contract.circuits, ...args: any[]) =>
    (contract.circuits[name] as any)(context, ...args).result;
  const setBalance = (amount: bigint) => {
    const token = [...context.currentQueryContext.effects.unshieldedInputs.keys()][0];
    simulatedBalance = { token, amount };
  };
  const setTime = (seconds: bigint) => { simulatedTime = seconds; };
  const outputs = () => [...context.currentQueryContext.effects.unshieldedOutputs.values()];
  return { call, state, pure, setBalance, setTime, outputs };
}

describe('NightFlip Compact contract', () => {
  it('initializes, registers, and opens a committed round', () => {
    const g = game();
    const seed = randomBytes(32);
    const commitment = g.pure('roundCommit', 1n, seed);
    g.call('registerPlayer', address, player);
    g.call('openRound', commitment, now + 3600n, now + 7200n, operator);
    expect(g.state().playerCount).toBe(1n);
    expect(g.state().rounds.lookup(1n).state).toBe(RoundState.OPEN);
    expect(() => g.call('registerPlayer', address, player)).toThrow('Player already registered');
  });

  it('keeps the choice private, reveals the result, pays once, and rejects a losing claim', () => {
    const g = game();
    const seed = randomBytes(32);
    const salt = randomBytes(32);
    const winningChoice = g.pure('outcomeOf', 1n, seed);
    g.call('registerPlayer', address, player);
    g.call('fundBankroll', 5_000_000n);
    g.setBalance(5_000_000n);
    g.call('openRound', g.pure('roundCommit', 1n, seed), now + 3600n, now + 7200n, operator);
    const winner = g.call('placeBet', address, 1n, winningChoice, salt, player);
    const losingSalt = randomBytes(32);
    const loser = g.call('placeBet', address, 1n, !winningChoice, losingSalt, player);
    const publicBet = g.state().bets.lookup(winner);
    expect(publicBet).not.toHaveProperty('choice');
    expect(publicBet.choiceCommitment).not.toEqual(salt);
    g.call('closeRound', 1n, operator);
    expect(() => g.call('revealRound', 1n, randomBytes(32), operator)).toThrow('Seed does not match commitment');
    g.call('revealRound', 1n, seed, operator);
    expect(g.state().rounds.lookup(1n).state).toBe(RoundState.REVEALED);
    expect(() => g.call('claimWin', loser, !winningChoice, losingSalt, player)).toThrow('Losing bet');
    expect(() => g.call('claimWin', winner, winningChoice, randomBytes(32), player)).toThrow('Wrong choice or salt');
    g.call('claimWin', winner, winningChoice, salt, player);
    expect(g.state().bets.lookup(winner).state).toBe(BetState.CLAIMED);
    expect(g.outputs()).toContain(1_900_000n);
    expect(() => g.call('claimWin', winner, winningChoice, salt, player)).toThrow('Bet already settled');
  });

  it('refunds an unrevealed round after the deadline even while paused', () => {
    const g = game();
    const seed = randomBytes(32);
    const salt = randomBytes(32);
    g.call('registerPlayer', address, player);
    g.call('fundBankroll', 4_000_000n);
    g.setBalance(4_000_000n);
    g.call('openRound', g.pure('roundCommit', 1n, seed), now + 3600n, now + 7200n, operator);
    const betId = g.call('placeBet', address, 1n, true, salt, player);
    expect(() => g.call('refundExpired', betId, player)).toThrow('Reveal deadline not reached');
    expect(() => g.call('setPaused', true, player)).toThrow('Operator only');
    g.call('setPaused', true, operator);
    expect(() => g.call('placeBet', address, 1n, false, randomBytes(32), player)).toThrow('Game is paused');
    g.setTime(now + 7201n);
    g.call('refundExpired', betId, player);
    expect(g.state().bets.lookup(betId).state).toBe(BetState.REFUNDED);
    expect(g.outputs()).toContain(1_000_000n);
    expect(g.state().reservedPayout).toBe(0n);
    expect(() => g.call('refundExpired', betId, player)).toThrow('Bet already settled');
    g.call('closeRound', 1n, operator);
    expect(() => g.call('revealRound', 1n, seed, operator)).toThrow('Reveal deadline passed');
  });

  it('rejects unregistered players, wrong secrets, and insufficient bankroll', () => {
    const g = game();
    const seed = randomBytes(32);
    g.call('openRound', g.pure('roundCommit', 1n, seed), now + 3600n, now + 7200n, operator);
    expect(() => g.call('placeBet', address, 1n, true, randomBytes(32), player)).toThrow('Player is not registered');
    g.call('registerPlayer', address, player);
    expect(() => g.call('placeBet', address, 1n, true, randomBytes(32), operator)).toThrow('Wrong player secret');
    expect(() => g.call('placeBet', address, 1n, true, randomBytes(32), player)).toThrow('Bankroll too low');
    expect(g.state().betCount).toBe(0n);
  });
});
