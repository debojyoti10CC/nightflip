import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { verifyProof } from '../../../scripts/verify-proof.mjs';

const hash = (value) => createHash('sha256').update(value).digest('hex');

test('offline checker verifies and rejects modified solo demo proofs', () => {
  const seed = 'a'.repeat(64);
  const outcomeHash = hash(`nightflip:demo:outcome:v1:1:${seed}`);
  const outcome = Number.parseInt(outcomeHash.slice(0, 2), 16) >= 128 ? 'MOON' : 'SHADOW';
  const proof = { protocol: 'nightflip-solo-demo-v1', mode: 'browser-demo', id: 1, seed,
    choice: 'MOON', roundCommitment: hash(`nightflip:demo:round:v1:1:${seed}`),
    outcomeHash, outcome, won: outcome === 'MOON' };
  assert.match(verifyProof(proof), /Verified solo/);
  assert.throws(() => verifyProof({ ...proof, outcome: 'WRONG' }), /mismatch/);
});

test('offline checker verifies and rejects modified duel commitments', () => {
  const you = { move: 'MOON', salt: 'a'.repeat(64), commitment: hash(`nightflip-duel-v1:MOON:${'a'.repeat(64)}`) };
  const rival = { move: 'STAR', salt: 'b'.repeat(64), commitment: hash(`nightflip-duel-v1:STAR:${'b'.repeat(64)}`) };
  const proof = { protocol: 'nightflip-duel-v1', mode: 'centralized-demo', room: 'A1B2C3D4',
    result: 'WIN', winner: 'YOU', rule: 'MOON>STAR>SHADOW>MOON', you, rival };
  assert.match(verifyProof(proof), /Verified duel/);
  assert.throws(() => verifyProof({ ...proof, rival: { ...rival, move: 'SHADOW' } }), /commitment mismatch/);
});
