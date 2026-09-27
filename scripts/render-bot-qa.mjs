import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseUrl = (process.env.NIGHTFLIP_RENDER_URL ?? 'https://nightflip-arcade.onrender.com').replace(/\/$/, '');
const BOT_SESSIONS = 100;
const DUELS = BOT_SESSIONS / 2;
const concurrency = 5;
const root = resolve(import.meta.dirname, '..');
const reportPath = resolve(root, 'docs/proofs/render-bot-qa-100.json');
const patterns = [
  ['MOON', 'STAR'],
  ['STAR', 'SHADOW'],
  ['SHADOW', 'MOON'],
  ['MOON', 'MOON'],
];

function hash(move, salt) {
  return createHash('sha256').update(`nightflip-duel-v1:${move}:${salt}`).digest('hex');
}

function salt(run, bot) {
  return createHash('sha256').update(`nightflip-render-bot-qa:v1:${run}:${bot}`).digest('hex');
}

async function request(path, options = {}) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { 'content-type': 'application/json', ...(options.headers ?? {}) },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(`${options.method ?? 'GET'} ${path} returned ${response.status}: ${body.error ?? JSON.stringify(body)}`);
      return body;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((done) => setTimeout(done, 300 * (attempt + 1)));
    }
  }
  throw lastError;
}

const auth = (id) => ({ authorization: `Bearer ${id}` });
const post = (path, id, body) => request(path, { method: 'POST', headers: id ? auth(id) : {}, body: JSON.stringify(body ?? {}) });
const get = (path, id) => request(path, { headers: auth(id) });

async function playDuel(number) {
  const [first, second] = await Promise.all([post('/api/duel/session'), post('/api/duel/session')]);
  const [firstMove, secondMove] = patterns[number % patterns.length];
  const firstSalt = salt(number, 1);
  const secondSalt = salt(number, 2);
  const room = await post('/api/duel/rooms', first.id, { commitment: hash(firstMove, firstSalt) });
  await post(`/api/duel/rooms/${room.code}/join`, second.id, { commitment: hash(secondMove, secondSalt) });
  await post(`/api/duel/rooms/${room.code}/reveal`, first.id, { move: firstMove, salt: firstSalt });
  const final = await post(`/api/duel/rooms/${room.code}/reveal`, second.id, { move: secondMove, salt: secondSalt });
  const [firstView, secondView] = await Promise.all([
    get(`/api/duel/rooms/${room.code}`, first.id),
    get(`/api/duel/rooms/${room.code}`, second.id),
  ]);
  assert.equal(final.state, 'DONE', `Render duel ${number + 1} did not settle.`);
  assert.equal(firstView.state, 'DONE', `Render duel ${number + 1} creator cannot read final state.`);
  assert.equal(secondView.state, 'DONE', `Render duel ${number + 1} rival cannot read final state.`);
  assert.equal(firstView.played, 1, `Render duel ${number + 1} creator play count is wrong.`);
  assert.equal(secondView.played, 1, `Render duel ${number + 1} rival play count is wrong.`);
  return final.result;
}

const startedAt = new Date().toISOString();
const health = await request('/api/health');
assert.equal(health.mode, 'demo', 'Render endpoint did not identify the expected demo service.');
const results = { decisive: 0, ties: 0 };
for (let start = 0; start < DUELS; start += concurrency) {
  const batch = await Promise.all(Array.from({ length: Math.min(concurrency, DUELS - start) }, (_, index) => playDuel(start + index)));
  for (const result of batch) result === 'TIE' ? results.ties += 1 : results.decisive += 1;
}

const report = {
  schema: 'nightflip-render-bot-qa/v1',
  recordedAt: new Date().toISOString(),
  startedAt,
  mode: 'render-hosted-demo',
  endpoint: baseUrl,
  participantType: 'automated demo sessions',
  botSessions: BOT_SESSIONS,
  completedDuels: DUELS,
  results,
  checks: {
    healthEndpoint: true,
    everyDuelSettled: true,
    bothParticipantsReadFinalState: true,
  },
  evidenceBoundary: {
    walletAddresses: 0,
    preprodTransactions: 0,
    onChainInteractions: 0,
    countsTowardPreprodParticipants: false,
    countsTowardSubmissionEvidence: false,
  },
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Render bot QA completed: ${report.botSessions} automated demo sessions and ${report.completedDuels} settled duels.`);
console.log(`Report: ${reportPath}`);
