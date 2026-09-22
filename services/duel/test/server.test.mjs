import { strict as assert } from 'node:assert';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { test } from 'node:test';

const unusedPort = () => new Promise((done) => {
  const probe = createServer();
  probe.listen(0, '127.0.0.1', () => {
    const port = probe.address().port;
    probe.close(() => done(port));
  });
});

test('one service serves the built UI and room API without exposing local files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'nightflip-static-'));
  const publicDir = join(directory, 'public');
  await mkdir(join(publicDir, 'assets'), { recursive: true });
  await writeFile(join(publicDir, 'index.html'), '<h1>NightFlip</h1>');
  await writeFile(join(publicDir, 'assets', 'app.js'), 'console.log("arcade")');
  const port = await unusedPort();
  const server = spawn(process.execPath, [resolve(import.meta.dirname, '../server.mjs')], {
    env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), STATIC_DIR: publicDir,
      DUEL_STATE_FILE: join(directory, 'state.json'), FEEDBACK_FILE: join(directory, 'feedback.jsonl') },
    stdio: 'ignore',
  });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      try { ready = (await fetch(`${base}/api/health`)).ok; if (ready) break; }
      catch { await new Promise((done) => setTimeout(done, 100)); }
    }
    assert.ok(ready, 'service starts');
    assert.match(await (await fetch(base)).text(), /NightFlip/);
    assert.match(await (await fetch(`${base}/join/ROOM123`)).text(), /NightFlip/);
    assert.match(await (await fetch(`${base}/assets/app.js`)).text(), /arcade/);
    assert.equal((await fetch(`${base}/assets/missing.js`)).status, 404);
    assert.equal((await fetch(`${base}/api/missing`)).status, 404);
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      server.kill();
      await new Promise((done) => server.once('exit', done));
    }
    assert.ok(resolve(directory).startsWith(`${resolve(tmpdir())}${sep}`));
    await rm(directory, { recursive: true, force: true });
  }
});
