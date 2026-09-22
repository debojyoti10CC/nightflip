import { createServer } from 'node:http';
import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { DuelGame } from './game.mjs';
import { validateFeedback } from './feedback.mjs';

const game = new DuelGame();
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '127.0.0.1';
const appOrigin = process.env.APP_ORIGIN || '';
const feedbackFile = process.env.FEEDBACK_FILE || resolve(import.meta.dirname, '../../data/feedback.jsonl');
const stateFile = process.env.DUEL_STATE_FILE || resolve(import.meta.dirname, '../../data/duel-state.json');
const staticDir = process.env.STATIC_DIR ? resolve(process.env.STATIC_DIR) : '';
const mimeType = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const feedbackRate = new Map();
try { game.restore(JSON.parse(await readFile(stateFile, 'utf8'))); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
let pendingSave = Promise.resolve();
const saveGame = () => {
  const snapshot = JSON.stringify(game.snapshot());
  pendingSave = pendingSave.then(async () => {
    await mkdir(dirname(stateFile), { recursive: true });
    await writeFile(`${stateFile}.tmp`, snapshot, { mode: 0o600 });
    await rename(`${stateFile}.tmp`, stateFile);
  });
  return pendingSave;
};
const send = (res, status, body, origin = res.req?.headers.origin || '') => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff',
    ...(appOrigin && origin === appOrigin ? { 'access-control-allow-origin': appOrigin, 'vary': 'origin' } : {}) });
  res.end(JSON.stringify(body));
};
const bodyOf = async (req) => {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 4096) throw Object.assign(new Error('Request too large.'), { status: 413 });
  }
  try { return JSON.parse(raw || '{}'); } catch { throw Object.assign(new Error('Invalid JSON.'), { status: 400 }); }
};
const serveStatic = async (url, res) => {
  const assetPath = url.pathname.startsWith('/assets/') ? url.pathname.slice(1) : 'index.html';
  const path = resolve(staticDir, assetPath);
  if (!path.startsWith(`${staticDir}${sep}`)) return send(res, 404, { error: 'Not found.' });
  try {
    const file = await readFile(path);
    res.writeHead(200, { 'content-type': mimeType[extname(path)] || 'application/octet-stream',
      'x-content-type-options': 'nosniff', 'cache-control': assetPath === 'index.html' ? 'no-cache' : 'public, max-age=31536000, immutable' });
    return res.end(file);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') return send(res, 404, { error: 'Not found.' });
    throw error;
  }
};

createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS' && appOrigin && req.headers.origin === appOrigin) {
      res.writeHead(204, { 'access-control-allow-origin': appOrigin, 'access-control-allow-headers': 'authorization, content-type',
        'access-control-allow-methods': 'GET, POST, OPTIONS', 'vary': 'origin' });
      return res.end();
    }
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const parts = url.pathname.split('/').filter(Boolean);
    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, mode: 'demo' });
    if (req.method === 'POST' && url.pathname === '/api/feedback') {
      const key = req.socket.remoteAddress || 'local';
      const recent = (feedbackRate.get(key) || []).filter((time) => Date.now() - time < 60_000);
      if (recent.length >= 5) return send(res, 429, { error: 'Please wait before sending more feedback.' });
      const body = validateFeedback(await bodyOf(req));
      feedbackRate.set(key, [...recent, Date.now()]);
      await mkdir(dirname(feedbackFile), { recursive: true });
      await appendFile(feedbackFile, JSON.stringify({ at: new Date().toISOString(), ...body }) + '\n');
      return send(res, 200, { saved: true }, req.headers.origin);
    }
    if (parts[0] !== 'api' || parts[1] !== 'duel') {
      if (staticDir && req.method === 'GET' && parts[0] !== 'api') return await serveStatic(url, res);
      return send(res, 404, { error: 'Not found.' });
    }
    if (req.method === 'POST' && parts.length === 3 && parts[2] === 'session') { const result = game.newPlayer(); await saveGame(); return send(res, 200, result, req.headers.origin); }
    const bearer = req.headers.authorization?.match(/^Bearer ([a-f0-9]{48})$/)?.[1];
    if (!bearer) return send(res, 401, { error: 'Start a demo session first.' });
    if (req.method === 'GET' && parts.length === 3 && parts[2] === 'session') return send(res, 200, game.player(bearer), req.headers.origin);
    if (req.method === 'GET' && parts.length === 4 && parts[2] === 'rooms' && parts[3] === 'open') return send(res, 200, game.openRooms(bearer), req.headers.origin);
    if (req.method === 'POST' && parts.length === 3 && parts[2] === 'rooms') {
      const body = await bodyOf(req);
      const result = game.create(bearer, body.commitment); await saveGame(); return send(res, 200, result, req.headers.origin);
    }
    if (parts.length >= 4 && parts[2] === 'rooms') {
      const room = parts[3];
      if (req.method === 'GET' && parts.length === 4) return send(res, 200, game.view(room, bearer), req.headers.origin);
      if (req.method === 'POST' && parts.length === 5 && parts[4] === 'join') {
        const body = await bodyOf(req);
        const result = game.join(bearer, room, body.commitment); await saveGame(); return send(res, 200, result, req.headers.origin);
      }
      if (req.method === 'POST' && parts.length === 5 && parts[4] === 'reveal') {
        const body = await bodyOf(req);
        const result = game.reveal(bearer, room, body.move, body.salt); await saveGame(); return send(res, 200, result, req.headers.origin);
      }
    }
    send(res, 404, { error: 'Not found.' });
  } catch (error) { send(res, error.status || 500, { error: error.status ? error.message : 'Server error.' }, req.headers.origin); }
}).listen(port, host, () => console.log(`Night Duel demo service at http://${host}:${port}`));
