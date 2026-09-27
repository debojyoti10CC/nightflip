import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DuelGame, MOVES, STAKE, WIN_PAYOUT, commitment } from '../services/duel/game.mjs';

const BOT_COUNT = 100;
const DUEL_COUNT = BOT_COUNT / 2;
const root = resolve(import.meta.dirname, '..');
const reportPath = resolve(root, 'docs/proofs/bot-qa-100.json');
const patterns = [
  ['MOON', 'STAR'],
  ['STAR', 'SHADOW'],
  ['SHADOW', 'MOON'],
  ['MOON', 'MOON'],
];

function saltFor(botNumber) {
  return createHash('sha256').update(`nightflip-local-bot-qa:v1:bot-${botNumber}`).digest('hex');
}

function makeReport() {
  let now = 1_790_516_000_000;
  const game = new DuelGame(() => now);
  const botIds = Array.from({ length: BOT_COUNT }, () => game.newPlayer().id);
  const outcomes = { decisive: 0, ties: 0 };

  for (let duel = 0; duel < DUEL_COUNT; duel += 1) {
    const firstBot = duel * 2;
    const secondBot = firstBot + 1;
    const [firstMove, secondMove] = patterns[duel % patterns.length];
    const firstSalt = saltFor(firstBot + 1);
    const secondSalt = saltFor(secondBot + 1);

    const room = game.create(botIds[firstBot], commitment(firstMove, firstSalt));
    game.join(botIds[secondBot], room.code, commitment(secondMove, secondSalt));
    game.reveal(botIds[firstBot], room.code, firstMove, firstSalt);
    const result = game.reveal(botIds[secondBot], room.code, secondMove, secondSalt);

    assert.equal(result.state, 'DONE', `Bot duel ${duel + 1} did not settle.`);
    if (firstMove === secondMove) {
      assert.equal(result.result, 'TIE', `Bot duel ${duel + 1} should refund a tie.`);
      outcomes.ties += 1;
    } else {
      assert.equal(result.result, 'WIN', `Bot duel ${duel + 1} should pay a winner.`);
      outcomes.decisive += 1;
    }
    now += 1;
  }

  const players = [...game.players.values()];
  const rooms = [...game.rooms.values()];
  const totalBalance = players.reduce((sum, player) => sum + player.balance, 0);
  const expectedBalance = BOT_COUNT * 500 - outcomes.decisive * (2 * STAKE - WIN_PAYOUT);

  assert.equal(rooms.length, DUEL_COUNT, 'Unexpected number of completed bot duels.');
  assert.ok(rooms.every((room) => room.state === 'DONE'), 'Every bot duel must complete.');
  assert.equal(players.reduce((sum, player) => sum + player.played, 0), BOT_COUNT, 'Every bot must complete one duel.');
  assert.equal(players.reduce((sum, player) => sum + player.wins, 0), outcomes.decisive, 'Winner count must match decisive duels.');
  assert.equal(totalBalance, expectedBalance, 'Simulated-credit accounting did not reconcile.');

  return {
    schema: 'nightflip-bot-qa/v1',
    recordedAt: new Date().toISOString(),
    mode: 'local-simulation',
    participantType: 'automated QA bots',
    bots: BOT_COUNT,
    completedDuels: rooms.length,
    results: outcomes,
    checks: {
      allDuelsSettled: true,
      everyBotCompletedOneDuel: true,
      simulatedCreditAccountingReconciled: true,
    },
    evidenceBoundary: {
      walletAddresses: 0,
      preprodTransactions: 0,
      onChainInteractions: 0,
      countsTowardPreprodParticipants: false,
      countsTowardSubmissionEvidence: false,
    },
  };
}

const report = makeReport();
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Recorded ${report.bots} automated local QA bots across ${report.completedDuels} completed simulated duels.`);
console.log(`Report: ${reportPath}`);
