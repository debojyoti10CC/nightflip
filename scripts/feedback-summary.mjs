import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = process.env.FEEDBACK_FILE || resolve(import.meta.dirname, '../data/feedback.jsonl');
let raw;
try { raw = await readFile(file, 'utf8'); }
catch (error) { if (error.code !== 'ENOENT') throw error; raw = ''; }

const entries = raw.split(/\r?\n/).filter(Boolean).map((line, index) => {
  try { return JSON.parse(line); }
  catch { throw new Error(`Malformed feedback JSON on line ${index + 1}.`); }
});
const groups = new Map();
for (const entry of entries) {
  const key = `${entry.mode} / ${entry.category}`;
  const group = groups.get(key) || { count: 0, ratingSum: 0 };
  group.count += 1;
  group.ratingSum += entry.rating;
  groups.set(key, group);
}
console.log(`Feedback responses: ${entries.length}`);
for (const [label, group] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${label}: ${group.count} response(s), mean rating ${(group.ratingSum / group.count).toFixed(2)}/5`);
}
console.log('Free-text messages are omitted from this summary; review them privately in the service data file.');
