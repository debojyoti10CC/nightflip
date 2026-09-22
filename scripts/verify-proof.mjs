import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const hash = (value) => createHash('sha256').update(value).digest('hex');
const moves = ['MOON', 'SHADOW', 'STAR'];
const wins = (a, b) => (a === 'MOON' && b === 'STAR') || (a === 'STAR' && b === 'SHADOW') || (a === 'SHADOW' && b === 'MOON');

export function verifyProof(proof) {
  if (!proof || typeof proof !== 'object') throw new Error('Invalid proof record.');
  if (proof.protocol === 'nightflip-solo-demo-v1' && proof.mode === 'browser-demo') {
    if (!Number.isSafeInteger(proof.id) || proof.id < 1 || !/^[a-f0-9]{64}$/.test(proof.seed) ||
        !['MOON', 'SHADOW'].includes(proof.choice)) throw new Error('Invalid solo proof fields.');
    const commitment = hash(`nightflip:demo:round:v1:${proof.id}:${proof.seed}`);
    const outcomeHash = hash(`nightflip:demo:outcome:v1:${proof.id}:${proof.seed}`);
    const outcome = Number.parseInt(outcomeHash.slice(0, 2), 16) >= 128 ? 'MOON' : 'SHADOW';
    if (proof.roundCommitment !== commitment || proof.outcomeHash !== outcomeHash ||
        proof.outcome !== outcome || proof.won !== (proof.choice === outcome)) throw new Error('Solo proof mismatch.');
    return `Verified solo demo round #${proof.id}: ${outcome}`;
  }
  if (proof.protocol === 'nightflip-duel-v1' && proof.mode === 'centralized-demo') {
    if (!/^[A-F0-9]{8}$/.test(proof.room) || !proof.you || !proof.rival ||
        !moves.includes(proof.you.move) || !moves.includes(proof.rival.move) ||
        !/^[a-f0-9]{64}$/.test(proof.you.salt) || !/^[a-f0-9]{64}$/.test(proof.rival.salt))
      throw new Error('Invalid duel proof fields.');
    for (const player of [proof.you, proof.rival]) {
      if (hash(`nightflip-duel-v1:${player.move}:${player.salt}`) !== player.commitment) throw new Error('Duel commitment mismatch.');
    }
    const tie = proof.you.move === proof.rival.move;
    const winner = tie ? null : wins(proof.you.move, proof.rival.move) ? 'YOU' : 'RIVAL';
    if (proof.winner !== winner || proof.result !== (tie ? 'TIE' : 'WIN') || proof.rule !== 'MOON>STAR>SHADOW>MOON')
      throw new Error('Duel result mismatch.');
    return `Verified duel demo room ${proof.room}: ${tie ? 'tie' : winner.toLowerCase() + ' wins'}`;
  }
  throw new Error('Unknown proof protocol.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) throw new Error('Usage: npm run proof:verify -- <proof.json>');
  const proof = JSON.parse(await readFile(process.argv[2], 'utf8'));
  console.log(verifyProof(proof));
  console.log('This verifies demo arithmetic and commitments, not a Midnight Preprod transaction.');
}
