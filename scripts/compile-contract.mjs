import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const contractDirectory = resolve(import.meta.dirname, '../contract');
const command = process.platform === 'win32' ? 'wsl' : 'compact';
const args = process.platform === 'win32'
  ? ['--cd', contractDirectory, '-d', 'Ubuntu', '--', 'bash', '-lc',
      'source ~/.local/bin/env; compact compile src/nightflip.compact src/managed/nightflip']
  : ['compile', 'src/nightflip.compact', 'src/managed/nightflip'];
const result = spawnSync(command, args, { cwd: contractDirectory, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
