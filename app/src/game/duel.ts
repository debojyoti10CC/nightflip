export type DuelMove = 'MOON' | 'SHADOW' | 'STAR';
export type DuelRoom = {
  code: string; state: 'WAITING' | 'REVEAL' | 'DONE' | 'CANCELLED';
  result: 'WIN' | 'TIE' | 'FORFEIT' | 'BOTH_REFUNDED' | 'NO_OPPONENT' | null;
  winner: 'YOU' | 'RIVAL' | null;
  joinBy: number; revealBy: number | null;
  myCommitment: string; myMove: DuelMove | null; mySalt: string | null;
  rivalJoined: boolean; rivalRevealed: boolean;
  rivalMove: DuelMove | null; rivalSalt: string | null; rivalCommitment: string | null;
  balance: number; wins: number; played: number;
};

const base = import.meta.env.VITE_DUEL_API_URL || '';

export async function duelRequest<T>(path: string, method = 'GET', token?: string, body?: unknown): Promise<T> {
  const response = await fetch(`${base}/api/duel${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `Duel service error (${response.status}).`);
  return result as T;
}

export function randomSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function moveCommitment(move: DuelMove, salt: string) {
  const bytes = new TextEncoder().encode(`nightflip-duel-v1:${move}:${salt}`);
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function verifyDuel(room: DuelRoom) {
  return room.state === 'DONE' && room.myMove && room.mySalt && room.rivalMove && room.rivalSalt && room.rivalCommitment;
}
