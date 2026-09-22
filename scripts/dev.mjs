import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const processes = [
  spawn(process.execPath, ['services/duel/server.mjs'], { cwd: root, stdio: 'inherit' }),
  spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1'], { cwd: resolve(root, 'app'), stdio: 'inherit' }),
];
const stop = () => processes.forEach((child) => { if (!child.killed) child.kill(); });
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
for (const child of processes) child.on('exit', (code) => { if (code && code !== 0) { stop(); process.exitCode = code; } });
