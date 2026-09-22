import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { DuelGame, commitment, compareMoves } from '../game.mjs';

test('the three-move cycle is complete and antisymmetric', () => {
  const moves = ['MOON', 'SHADOW', 'STAR'];
  for (const move of moves) assert.equal(compareMoves(move, move), 0);
  for (const first of moves) for (const second of moves) {
    if (first !== second) assert.equal(compareMoves(first, second), -compareMoves(second, first));
  }
  assert.equal(compareMoves('MOON', 'STAR'), 1);
  assert.equal(compareMoves('STAR', 'SHADOW'), 1);
  assert.equal(compareMoves('SHADOW', 'MOON'), 1);
});

test('two browsers lock hidden moves, reveal, and settle one payout', () => {
  const game = new DuelGame();
  const a = game.newPlayer().id;
  const b = game.newPlayer().id;
  const room = game.create(a, commitment('MOON', 'a'.repeat(64)));
  assert.equal(room.state, 'WAITING');
  game.join(b, room.code, commitment('STAR', 'b'.repeat(64)));
  assert.equal(game.view(room.code, a).rivalMove, null);
  game.reveal(a, room.code, 'MOON', 'a'.repeat(64));
  assert.equal(game.view(room.code, a).rivalMove, null);
  const done = game.reveal(b, room.code, 'STAR', 'b'.repeat(64));
  assert.equal(done.state, 'DONE');
  assert.equal(done.winner, 'RIVAL');
  assert.equal(game.view(room.code, a).balance, 590);
  assert.equal(game.view(room.code, b).balance, 400);
  assert.throws(() => game.reveal(b, room.code, 'STAR', 'b'.repeat(64)), /not accepting/);
});

test('ties refund both; a mismatched reveal is rejected', () => {
  const game = new DuelGame();
  const a = game.newPlayer().id;
  const b = game.newPlayer().id;
  const room = game.create(a, commitment('SHADOW', 'a'.repeat(64)));
  game.join(b, room.code, commitment('SHADOW', 'b'.repeat(64)));
  assert.throws(() => game.reveal(a, room.code, 'MOON', 'a'.repeat(64)), /does not match/);
  game.reveal(a, room.code, 'SHADOW', 'a'.repeat(64));
  game.reveal(b, room.code, 'SHADOW', 'b'.repeat(64));
  assert.equal(game.view(room.code, a).result, 'TIE');
  assert.equal(game.view(room.code, a).balance, 500);
  assert.equal(game.view(room.code, b).balance, 500);
});

test('expired unmatched room refunds; a non-revealing rival forfeits', () => {
  let now = 1000;
  const game = new DuelGame(() => now);
  const a = game.newPlayer().id;
  const b = game.newPlayer().id;
  const room = game.create(a, commitment('MOON', 'a'.repeat(64)));
  now += 5 * 60_000;
  assert.equal(game.view(room.code, a).result, 'NO_OPPONENT');
  assert.equal(game.player(a).balance, 500);
  const next = game.create(a, commitment('MOON', 'a'.repeat(64)));
  game.join(b, next.code, commitment('STAR', 'b'.repeat(64)));
  game.reveal(a, next.code, 'MOON', 'a'.repeat(64));
  now += 3 * 60_000;
  assert.equal(game.view(next.code, a).result, 'FORFEIT');
  assert.equal(game.player(a).balance, 590);
});

test('room and session state survives a service restart', () => {
  const game = new DuelGame();
  const a = game.newPlayer().id;
  const room = game.create(a, commitment('MOON', 'a'.repeat(64)));
  const restored = new DuelGame();
  restored.restore(JSON.parse(JSON.stringify(game.snapshot())));
  assert.equal(restored.view(room.code, a).state, 'WAITING');
  assert.equal(restored.player(a).balance, 400);
});

test('open-room board shows rival rooms but excludes your own and expired rooms', () => {
  let now = 1000;
  const game = new DuelGame(() => now);
  const a = game.newPlayer().id;
  const b = game.newPlayer().id;
  const room = game.create(a, commitment('MOON', 'a'.repeat(64)));
  assert.deepEqual(game.openRooms(a), []);
  assert.deepEqual(game.openRooms(b).map((item) => item.code), [room.code]);
  now += 5 * 60_000;
  assert.deepEqual(game.openRooms(b), []);
  assert.equal(game.player(a).balance, 500);
});

test('a demo session cannot lock credits in several simultaneous rooms', () => {
  const game = new DuelGame();
  const a = game.newPlayer().id;
  const b = game.newPlayer().id;
  const room = game.create(a, commitment('MOON', 'a'.repeat(64)));
  assert.throws(() => game.create(a, commitment('STAR', 'b'.repeat(64))), /Finish your active duel/);
  const rivalRoom = game.create(b, commitment('STAR', 'c'.repeat(64)));
  assert.throws(() => game.join(a, rivalRoom.code, commitment('SHADOW', 'd'.repeat(64))), /Finish your active duel/);
  assert.equal(game.view(room.code, a).balance, 400);
});
