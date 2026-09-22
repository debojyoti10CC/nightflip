import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const MOVES = ['MOON', 'SHADOW', 'STAR'];
export const STAKE = 100;
export const WIN_PAYOUT = 190;
export const JOIN_WINDOW_MS = 5 * 60_000;
export const REVEAL_WINDOW_MS = 3 * 60_000;

export function commitment(move, salt) {
  return createHash('sha256').update(`nightflip-duel-v1:${move}:${salt}`).digest('hex');
}

export function compareMoves(first, second) {
  if (first === second) return 0;
  return (first === 'MOON' && second === 'STAR') ||
    (first === 'STAR' && second === 'SHADOW') ||
    (first === 'SHADOW' && second === 'MOON') ? 1 : -1;
}

const token = () => randomBytes(24).toString('hex');
const code = () => randomBytes(4).toString('hex').toUpperCase();
const validHash = (hash) => typeof hash === 'string' && /^[a-f0-9]{64}$/.test(hash);
const fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };

export class DuelGame {
  constructor(now = () => Date.now()) {
    this.now = now;
    this.players = new Map();
    this.rooms = new Map();
  }

  snapshot() {
    return { players: [...this.players.entries()], rooms: [...this.rooms.entries()] };
  }

  restore(snapshot) {
    if (!Array.isArray(snapshot?.players) || !Array.isArray(snapshot?.rooms)) throw new Error('Invalid duel state file.');
    this.players = new Map(snapshot.players);
    this.rooms = new Map(snapshot.rooms);
  }

  newPlayer() {
    const id = token();
    this.players.set(id, { balance: 500, wins: 0, played: 0 });
    return { id, ...this.players.get(id) };
  }

  player(id) {
    const player = this.players.get(id);
    if (!player) fail(401, 'Unknown demo session. Refresh the page to start again.');
    return player;
  }

  settleExpired(room) {
    if (room.state === 'WAITING' && this.now() >= room.joinBy) {
      room.state = 'CANCELLED';
      room.result = 'NO_OPPONENT';
      this.players.get(room.first.id).balance += STAKE;
    } else if (room.state === 'REVEAL' && this.now() >= room.revealBy) {
      const a = room.first.move !== null;
      const b = room.second.move !== null;
      if (a !== b) {
        room.winner = a ? room.first.id : room.second.id;
        this.players.get(room.winner).balance += WIN_PAYOUT;
        this.players.get(room.winner).wins += 1;
        room.result = 'FORFEIT';
      } else {
        this.players.get(room.first.id).balance += STAKE;
        this.players.get(room.second.id).balance += STAKE;
        room.result = 'BOTH_REFUNDED';
      }
      room.state = 'DONE';
      this.players.get(room.first.id).played += 1;
      this.players.get(room.second.id).played += 1;
    }
  }

  view(roomCode, playerId) {
    const room = this.rooms.get(roomCode?.toUpperCase());
    if (!room) fail(404, 'Room not found. Check the invite code.');
    this.player(playerId);
    if (room.first.id !== playerId && room.second?.id !== playerId) fail(403, 'This room belongs to the two players who joined it.');
    this.settleExpired(room);
    const mine = room.first.id === playerId ? room.first : room.second;
    const rival = room.first.id === playerId ? room.second : room.first;
    return {
      code: room.code, state: room.state, result: room.result, winner: room.winner === playerId ? 'YOU' : room.winner ? 'RIVAL' : null,
      joinBy: room.joinBy, revealBy: room.revealBy, myCommitment: mine.commitment,
      myMove: mine.move, mySalt: mine.salt, rivalJoined: Boolean(rival), rivalRevealed: Boolean(rival?.move),
      rivalMove: room.state === 'DONE' ? rival?.move : null,
      rivalSalt: room.state === 'DONE' ? rival?.salt : null,
      rivalCommitment: rival?.commitment ?? null,
      balance: this.players.get(playerId).balance,
      wins: this.players.get(playerId).wins,
      played: this.players.get(playerId).played,
    };
  }

  openRooms(playerId) {
    this.player(playerId);
    return [...this.rooms.values()].filter((room) => {
      this.settleExpired(room);
      return room.state === 'WAITING' && room.first.id !== playerId;
    }).sort((a, b) => a.joinBy - b.joinBy).slice(0, 8).map((room) => ({ code: room.code, joinBy: room.joinBy }));
  }

  create(playerId, hash) {
    const player = this.player(playerId);
    if (!validHash(hash)) fail(400, 'Invalid move commitment.');
    if (player.balance < STAKE) fail(409, 'Not enough demo credits.');
    player.balance -= STAKE;
    let roomCode;
    do { roomCode = code(); } while (this.rooms.has(roomCode));
    const room = { code: roomCode, state: 'WAITING', first: { id: playerId, commitment: hash, move: null, salt: null }, second: null,
      joinBy: this.now() + JOIN_WINDOW_MS, revealBy: null, winner: null, result: null };
    this.rooms.set(roomCode, room);
    return this.view(roomCode, playerId);
  }

  join(playerId, roomCode, hash) {
    const player = this.player(playerId);
    const room = this.rooms.get(roomCode?.toUpperCase());
    if (!room) fail(404, 'Room not found. Check the invite code.');
    this.settleExpired(room);
    if (!validHash(hash)) fail(400, 'Invalid move commitment.');
    if (room.state !== 'WAITING') fail(409, 'This room is no longer open.');
    if (room.first.id === playerId) fail(409, 'Open this invite in another browser to join as the rival.');
    if (player.balance < STAKE) fail(409, 'Not enough demo credits.');
    player.balance -= STAKE;
    room.second = { id: playerId, commitment: hash, move: null, salt: null };
    room.state = 'REVEAL';
    room.revealBy = this.now() + REVEAL_WINDOW_MS;
    return this.view(room.code, playerId);
  }

  reveal(playerId, roomCode, move, salt) {
    const room = this.rooms.get(roomCode?.toUpperCase());
    if (!room) fail(404, 'Room not found.');
    this.view(room.code, playerId);
    if (room.state !== 'REVEAL') fail(409, 'This duel is not accepting reveals.');
    if (!MOVES.includes(move) || typeof salt !== 'string' || !/^[a-f0-9]{64}$/.test(salt)) fail(400, 'Invalid move or salt.');
    const mine = room.first.id === playerId ? room.first : room.second;
    if (mine.move !== null) fail(409, 'You already revealed.');
    if (!timingSafeEqual(Buffer.from(commitment(move, salt), 'hex'), Buffer.from(mine.commitment, 'hex'))) fail(400, 'Reveal does not match your locked move.');
    mine.move = move;
    mine.salt = salt;
    if (room.first.move !== null && room.second.move !== null) {
      const result = compareMoves(room.first.move, room.second.move);
      room.state = 'DONE';
      room.result = result === 0 ? 'TIE' : 'WIN';
      if (result === 0) {
        this.players.get(room.first.id).balance += STAKE;
        this.players.get(room.second.id).balance += STAKE;
      } else {
        room.winner = result === 1 ? room.first.id : room.second.id;
        this.players.get(room.winner).balance += WIN_PAYOUT;
        this.players.get(room.winner).wins += 1;
      }
      this.players.get(room.first.id).played += 1;
      this.players.get(room.second.id).played += 1;
    }
    return this.view(room.code, playerId);
  }
}
