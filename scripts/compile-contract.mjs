import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const contractDirectory = resolve(import.meta.dirname, '../contract');
for (const name of process.argv[2] ? [process.argv[2]] : ['nightflip', 'nightduel']) {
  if (!['nightflip', 'nightduel'].includes(name)) throw new Error('Unknown contract name');
  const command = process.platform === 'win32' ? 'wsl' : 'compact';
  const args = process.platform === 'win32'
    ? ['--cd', contractDirectory, '-d', 'Ubuntu', '--', 'bash', '-lc',
        `source ~/.local/bin/env; compact compile src/${name}.compact src/managed/${name}`]
    : ['compile', `src/${name}.compact`, `src/managed/${name}`];
  const result = spawnSync(command, args, { cwd: contractDirectory, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
