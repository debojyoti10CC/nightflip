import { existsSync, readFileSync } from 'node:fs';

const required = ['README.md', 'docs/BUILD_PLAN.md', 'docs/NETWORK.md', 'package.json', '.gitignore'];
for (const path of required) {
  if (!existsSync(path)) throw new Error(`Missing foundation file: ${path}`);
}
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.name !== 'nightflip' || !Array.isArray(pkg.workspaces)) {
  throw new Error('Invalid workspace configuration');
}
console.log('NightFlip foundation check passed.');
