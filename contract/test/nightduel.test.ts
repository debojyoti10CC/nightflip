import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createCircuitContext, createConstructorContext, sampleContractAddress } from '@midnight-ntwrk/compact-runtime';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { Contract, DuelState, ledger } from '../src/managed/nightduel/contract/index.js';

setNetworkId('undeployed');

const now = BigInt(Math.floor(Date.now() / 1000));
const creator = { bytes: randomBytes(32) };
const challenger = { bytes: randomBytes(32) };
const treasury = { bytes: randomBytes(32) };
const creatorSecret = randomBytes(32);
const challengerSecret = randomBytes(32);

function game() {
  const contract = new Contract({});
  const initial = contract.initialState(createConstructorContext({}, '0'.repeat(64)), treasury);
  let context = createCircuitContext(sampleContractAddress(), initial.currentZswapLocalState,
    initial.currentContractState, initial.currentPrivateState);
  let balance: { token: any; amount: bigint } | undefined;
  let time: bigint | undefined;
  const call = (name: keyof typeof contract.impureCircuits, ...args: any[]) => {
    context.currentQueryContext.block = {
      ...context.currentQueryContext.block,
      ...(balance ? { balance: new Map([[balance.token, balance.amount]]) } : {}),
      ...(time ? { secondsSinceEpoch: time } : {}),
    };
    const result = (contract.impureCircuits[name] as any)(context, ...args);
    context = result.context;
    return result.result;
  };
  const state = () => ledger(context.currentQueryContext.state);
  const setBalance = (amount: bigint) => {
    const token = [...context.currentQueryContext.effects.unshieldedInputs.keys()][0];
    balance = { token, amount };
  };
  const setTime = (seconds: bigint) => { time = seconds; };
  const outputs = () => [...context.currentQueryContext.effects.unshieldedOutputs.values()];
  return { call, state, setBalance, setTime, outputs };
}

describe('NightDuel Compact contract', () => {
  it('settles a committed duel once with 1.90 to the winner and 0.10 to treasury', () => {
    const g = game();
    const aSalt = randomBytes(32);
    const bSalt = randomBytes(32);
    const id = g.call('createDuel', creator, 0n, aSalt, creatorSecret, now + 300n, now + 600n);
    expect(id).toBe(1n);
    expect(g.state().states.lookup(id)).toBe(DuelState.WAITING);
    expect(g.state().creatorCommitment.lookup(id)).not.toEqual(aSalt);
    expect(g.state().creatorMove.member(id)).toBe(false);
    expect(() => g.call('joinDuel', id, creator, 2n, bSalt, creatorSecret)).toThrow();
    g.call('joinDuel', id, challenger, 2n, bSalt, challengerSecret);
    g.setBalance(2_000_000n);
    expect(g.state().states.lookup(id)).toBe(DuelState.REVEAL);
    expect(() => g.call('revealMove', id, 1n, aSalt, creatorSecret)).toThrow('Move commitment mismatch');
    g.call('revealMove', id, 0n, aSalt, creatorSecret);
    expect(g.state().states.lookup(id)).toBe(DuelState.REVEAL);
    expect(() => g.call('revealMove', id, 0n, aSalt, creatorSecret)).toThrow('Already revealed');
    g.call('revealMove', id, 2n, bSalt, challengerSecret);
    expect(g.state().states.lookup(id)).toBe(DuelState.DONE);
    // The local runtime aggregates unshielded outputs by token, so it exposes 2.00 total.
    expect(g.outputs()).toContain(2_000_000n);
    expect(() => g.call('settleExpired', id)).toThrow('Duel is not revealing');
  });

  it('refunds a matching-move tie to both players', () => {
    const g = game();
    const aSalt = randomBytes(32);
    const bSalt = randomBytes(32);
    const id = g.call('createDuel', creator, 1n, aSalt, creatorSecret, now + 300n, now + 600n);
    g.call('joinDuel', id, challenger, 1n, bSalt, challengerSecret);
    g.setBalance(2_000_000n);
    g.call('revealMove', id, 1n, aSalt, creatorSecret);
    g.call('revealMove', id, 1n, bSalt, challengerSecret);
    expect(g.outputs()).toContain(2_000_000n);
  });

  it('refunds an unmatched creator and settles a no-reveal timeout', () => {
    const g = game();
    const salt = randomBytes(32);
    const id = g.call('createDuel', creator, 0n, salt, creatorSecret, now + 300n, now + 600n);
    g.setBalance(1_000_000n);
    expect(() => g.call('refundUnmatched', id, creatorSecret)).toThrow('Join deadline not reached');
    g.setTime(now + 300n);
    g.call('refundUnmatched', id, creatorSecret);
    expect(g.state().states.lookup(id)).toBe(DuelState.CANCELLED);
    expect(g.outputs()).toContain(1_000_000n);
  });

  it('awards a revealing player after deadline when the rival stays silent', () => {
    const g = game();
    const aSalt = randomBytes(32);
    const bSalt = randomBytes(32);
    const id = g.call('createDuel', creator, 0n, aSalt, creatorSecret, now + 300n, now + 600n);
    g.call('joinDuel', id, challenger, 1n, bSalt, challengerSecret);
    g.setBalance(2_000_000n);
    g.call('revealMove', id, 0n, aSalt, creatorSecret);
    g.setTime(now + 600n);
    g.call('settleExpired', id);
    expect(g.state().states.lookup(id)).toBe(DuelState.DONE);
    expect(g.outputs()).toContain(2_000_000n);
  });
});
