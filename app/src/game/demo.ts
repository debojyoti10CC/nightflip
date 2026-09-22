export type Side = 'MOON' | 'SHADOW';

export type DemoRound = {
  id: number;
  choice: Side;
  outcome: Side;
  won: boolean;
  claimed: boolean;
  roundCommitment: string;
  seed: string;
  outcomeHash: string;
  playedAt: string;
};

export type DemoSave = {
  balance: number;
  rounds: DemoRound[];
};

const SAVE_KEY = 'nightflip-demo-v1';
const encoder = new TextEncoder();

export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function freshSeed(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
}

export async function prepareDemoRound(id: number): Promise<{ seed: string; commitment: string }> {
  const seed = freshSeed();
  const commitment = bytesToHex(await sha256(`nightflip:demo:round:v1:${id}:${seed}`));
  return { seed, commitment };
}

export async function resolveDemoRound(
  id: number,
  choice: Side,
  seed: string,
  commitment: string,
): Promise<DemoRound> {
  const expectedCommitment = bytesToHex(await sha256(`nightflip:demo:round:v1:${id}:${seed}`));
  if (expectedCommitment !== commitment) throw new Error('Round commitment mismatch');
  const hash = await sha256(`nightflip:demo:outcome:v1:${id}:${seed}`);
  const outcome: Side = hash[0] >= 128 ? 'MOON' : 'SHADOW';
  return {
    id, choice, outcome, won: choice === outcome, claimed: false,
    roundCommitment: commitment, seed, outcomeHash: bytesToHex(hash),
    playedAt: new Date().toISOString(),
  };
}

export async function verifyDemoRound(round: DemoRound): Promise<boolean> {
  const expected = await resolveDemoRound(round.id, round.choice, round.seed, round.roundCommitment);
  return expected.outcome === round.outcome && expected.outcomeHash === round.outcomeHash;
}

export function loadDemo(): DemoSave {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') as DemoSave | null;
    if (saved && Number.isFinite(saved.balance) && Array.isArray(saved.rounds)) return saved;
  } catch { /* Broken demo storage starts a fresh test session. */ }
  return { balance: 5, rounds: [] };
}

export function saveDemo(save: DemoSave): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function resetDemo(): DemoSave {
  const fresh = { balance: 5, rounds: [] };
  saveDemo(fresh);
  return fresh;
}
