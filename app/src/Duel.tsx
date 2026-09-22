import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check, Clipboard, Download, LockKeyhole, MoonStar, RotateCcw, ShieldCheck, Star, Users, Zap } from 'lucide-react';
import { duelRequest, moveCommitment, randomSalt, type DuelMove, type DuelRoom } from './game/duel';

type Session = { id: string; balance: number; wins: number; played: number };
const moves: DuelMove[] = ['MOON', 'SHADOW', 'STAR'];
const rules: Record<DuelMove, string> = { MOON: 'BEATS STAR', SHADOW: 'BEATS MOON', STAR: 'BEATS SHADOW' };
const icons = { MOON: '☾', SHADOW: '◆', STAR: '★' };

export default function Duel() {
  const [session, setSession] = useState<Session | null>(null);
  const [room, setRoom] = useState<DuelRoom | null>(null);
  const [pick, setPick] = useState<DuelMove | null>(null);
  const [invite, setInvite] = useState(new URLSearchParams(window.location.search).get('duel') || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [openRooms, setOpenRooms] = useState<{ code: string; joinBy: number }[]>([]);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    let live = true;
    const start = async () => {
      try {
        let id = sessionStorage.getItem('nightflip-duel-session');
        let data: Session;
        if (id) {
          try { data = { id, ...(await duelRequest<Omit<Session, 'id'>>('/session', 'GET', id)) }; }
          catch { id = null; data = await duelRequest<Session>('/session', 'POST'); }
        } else data = await duelRequest<Session>('/session', 'POST');
        if (!live) return;
        sessionStorage.setItem('nightflip-duel-session', data.id);
        setSession(data);
        const activeCode = sessionStorage.getItem('nightflip-duel-room');
        if (activeCode) {
          try { setRoom(await duelRequest<DuelRoom>(`/rooms/${activeCode}`, 'GET', data.id)); setClock(Date.now()); }
          catch { sessionStorage.removeItem('nightflip-duel-room'); }
        }
      } catch (cause) { if (live) setError(cause instanceof Error ? cause.message : 'Duel service unavailable.'); }
    };
    start();
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!session || room) return;
    const load = () => { void duelRequest<{ code: string; joinBy: number }[]>('/rooms/open', 'GET', session.id).then(setOpenRooms).catch(() => setOpenRooms([])); };
    load();
    const timer = window.setInterval(load, 4000);
    return () => window.clearInterval(timer);
  }, [session, room]);

  useEffect(() => {
    if (room) return;
    const choose = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < moves.length && event.key.length === 1) setPick(moves[index]);
    };
    window.addEventListener('keydown', choose);
    return () => window.removeEventListener('keydown', choose);
  }, [room]);

  const refresh = useCallback(async () => {
    if (!session || !room) return;
    try {
      const next = await duelRequest<DuelRoom>(`/rooms/${room.code}`, 'GET', session.id);
      setRoom(next);
      setClock(Date.now());
      setSession((old) => old ? { ...old, balance: next.balance, wins: next.wins, played: next.played } : old);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not refresh duel.'); }
  }, [session, room]);
  useEffect(() => {
    if (!room || room.state === 'DONE' || room.state === 'CANCELLED') return;
    const timer = window.setInterval(() => { setClock(Date.now()); void refresh(); }, 1500);
    return () => window.clearInterval(timer);
  }, [room, refresh]);

  const lock = async (join: boolean, chosenCode?: string) => {
    if (!session || !pick || busy) return;
    setBusy(true); setError('');
    try {
      const salt = randomSalt();
      const commitment = await moveCommitment(pick, salt);
      const code = (chosenCode || invite).trim().toUpperCase();
      const next = join
        ? await duelRequest<DuelRoom>(`/rooms/${code}/join`, 'POST', session.id, { commitment })
        : await duelRequest<DuelRoom>('/rooms', 'POST', session.id, { commitment });
      sessionStorage.setItem(`nightflip-duel-secret-${next.code}`, JSON.stringify({ move: pick, salt }));
      sessionStorage.setItem('nightflip-duel-room', next.code);
      setRoom(next);
      setClock(Date.now());
      setSession({ ...session, balance: next.balance });
      setPick(null);
      if (join) window.history.replaceState({}, '', window.location.pathname);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not lock move.'); }
    finally { setBusy(false); }
  };

  const reveal = async () => {
    if (!session || !room || busy) return;
    setBusy(true); setError('');
    try {
      const secret = JSON.parse(sessionStorage.getItem(`nightflip-duel-secret-${room.code}`) || 'null') as { move: DuelMove; salt: string } | null;
      if (!secret) throw new Error('Your local reveal key is missing. Keep this browser tab open until the deadline; after it, the room settles by timeout.');
      const next = await duelRequest<DuelRoom>(`/rooms/${room.code}/reveal`, 'POST', session.id, secret);
      setRoom(next);
      setSession({ ...session, balance: next.balance, wins: next.wins, played: next.played });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Reveal failed.'); }
    finally { setBusy(false); }
  };

  const copyInvite = async () => {
    if (!room) return;
    await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?duel=${room.code}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  const newDuel = () => { setRoom(null); setPick(null); setError(''); sessionStorage.removeItem('nightflip-duel-room'); };
  const verify = async () => {
    if (!room?.myMove || !room.mySalt || !room.rivalMove || !room.rivalSalt || !room.rivalCommitment) return;
    const [mine, theirs] = await Promise.all([moveCommitment(room.myMove, room.mySalt), moveCommitment(room.rivalMove, room.rivalSalt)]);
    setVerified(mine === room.myCommitment && theirs === room.rivalCommitment);
  };
  const downloadProof = () => {
    if (!room || room.state !== 'DONE' || !room.myMove || !room.rivalMove || !room.mySalt || !room.rivalSalt) return;
    const proof = { protocol: 'nightflip-duel-v1', mode: 'centralized-demo', room: room.code,
      result: room.result, winner: room.winner, rule: 'MOON>STAR>SHADOW>MOON',
      you: { move: room.myMove, salt: room.mySalt, commitment: room.myCommitment },
      rival: { move: room.rivalMove, salt: room.rivalSalt, commitment: room.rivalCommitment } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(proof, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = `nightduel-proof-${room.code}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const secondsLeft = room ? Math.max(0, Math.ceil(((room.state === 'WAITING' ? room.joinBy : room.revealBy || 0) - clock) / 1000)) : 0;
  const resultTitle = room?.result === 'TIE' ? 'DRAW GAME' : room?.result === 'NO_OPPONENT' ? 'NO RIVAL ARRIVED' : room?.result === 'BOTH_REFUNDED' ? 'BOTH REFUNDED' : room?.winner === 'YOU' ? 'YOU OWN THE NIGHT' : 'RIVAL TAKES THE ROUND';

  return <div className="duel-layout">
    <section className="duel-arena">
      <div className="duel-bar"><span>✦ NIGHT DUEL <small>// HEAD TO HEAD</small></span><span><span className="live-dot" /> {room ? `ROOM ${room.code}` : 'FIND YOUR RIVAL'}</span></div>
      <div className="duel-sky"><div className="duel-sun">✳</div><div className="duel-battle"><div><span>PLAYER 01</span><b>{room ? 'LOCKED IN' : 'YOU'}</b><i>◆ ◆ ◆</i></div><strong>VS</strong><div><span>PLAYER 02</span><b>{room?.rivalJoined ? 'LOCKED IN' : 'UNKNOWN'}</b><i>{room?.rivalJoined ? '◆ ◆ ◆' : '? ? ?'}</i></div></div><div className="duel-skyline" /></div>
      <div className="duel-body">
        {!room ? <>
          <div className="duel-heading"><div><span className="eyebrow">01 / PICK YOUR POWER</span><h2>THREE MOVES. <em>ONE RIVAL.</em></h2><small className="duel-shortcut">TIP: PRESS 1 / 2 / 3 TO CHOOSE</small></div><span className="duel-private"><LockKeyhole size={15} /> HIDDEN UNTIL REVEAL</span></div>
          <div className="duel-moves">{moves.map((move) => <button key={move} className={`duel-move ${pick === move ? 'chosen' : ''}`} onClick={() => setPick(move)} aria-pressed={pick === move}><span className="duel-move-icon">{icons[move]}</span><strong>{move}</strong><small>{rules[move]}</small>{pick === move && <span className="duel-check"><Check size={17} /></span>}</button>)}</div>
          <div className="duel-route"><div><span className="eyebrow">02 / CHOOSE YOUR ROUTE</span><p>Create a room and send the link, or enter a rival's code. Each player locks 1 demo credit.</p></div><div className="duel-route-buttons"><button className="button button-lime" onClick={() => void lock(false)} disabled={!pick || !session || busy}><Users size={17} /> CREATE DUEL</button><div className="duel-join"><input aria-label="Invite code" placeholder="INVITE CODE" value={invite} maxLength={8} onChange={(e) => setInvite(e.target.value.toUpperCase().replace(/[^A-F0-9]/g, ''))} /><button onClick={() => void lock(true)} disabled={!pick || invite.length !== 8 || !session || busy}>JOIN <ArrowRight size={15} /></button></div></div></div>
          <div className="duel-open"><div><span className="eyebrow">LIVE BOARD / OPEN ROOMS</span><small>{openRooms.length ? `${openRooms.length} RIVAL${openRooms.length === 1 ? '' : 'S'} WAITING` : 'NO ROOMS YET — CREATE THE FIRST'}</small></div>{openRooms.length > 0 && <div className="duel-open-list">{openRooms.slice(0, 4).map((item) => <button key={item.code} onClick={() => void lock(true, item.code)} disabled={!pick || busy}><span>ROOM {item.code}</span><strong>JOIN RIVAL →</strong></button>)}</div>}</div>
        </> : <div className="duel-progress" role="status" aria-live="polite">
          {room.state === 'WAITING' ? <><span className="eyebrow">02 / INVITE A RIVAL</span><h2>YOUR MOVE IS <em>LOCKED.</em></h2><p>Share this link with a friend. Their pick stays hidden too. Your 1.00 demo credit is held until they join or the timer ends.</p><div className="invite-box"><strong>{room.code}</strong><button className="button button-lime" onClick={() => void copyInvite()}>{copied ? <Check size={18} /> : <Clipboard size={18} />}{copied ? 'COPIED' : 'COPY INVITE LINK'}</button></div><small>WAITING FOR PLAYER 02 • {secondsLeft}s LEFT</small></> : null}
          {room.state === 'REVEAL' ? <><span className="eyebrow">03 / COMMITMENTS ARE SEALED</span><h2>{room.myMove ? 'MOVE REVEALED.' : 'SHOW YOUR HAND.'}</h2><p>{room.myMove ? 'Your move is verified. Waiting for your rival to reveal.' : 'Both players locked a move. Reveal yours now; the winner is decided only after both reveals.'}</p><div className="duel-status-grid"><div><span>YOU</span><b>{room.myMove || 'HIDDEN'}</b></div><div><span>RIVAL</span><b>{room.rivalRevealed ? 'REVEALED' : 'HIDDEN'}</b></div></div>{!room.myMove && <button className="button button-lime" onClick={() => void reveal()} disabled={busy}><Zap size={19} /> REVEAL MY MOVE</button>}<small>REVEAL WINDOW • {secondsLeft}s LEFT</small></> : null}
          {(room.state === 'DONE' || room.state === 'CANCELLED') && <><span className="eyebrow">04 / THE NIGHT HAS SPOKEN</span><h2>{resultTitle}</h2><p>{room.result === 'TIE' || room.result === 'BOTH_REFUNDED' || room.result === 'NO_OPPONENT' ? 'Stake refunded to your demo balance.' : room.winner === 'YOU' ? '+1.90 demo credits added to your balance.' : 'Your rival won this round. Try a new move.'}</p><div className="duel-status-grid"><div><span>YOU PLAYED</span><b>{room.myMove || 'UNREVEALED'}</b></div><div><span>RIVAL PLAYED</span><b>{room.rivalMove || 'UNREVEALED'}</b></div></div><button className="button button-lime" onClick={newDuel}>PLAY AGAIN <RotateCcw size={17} /></button></>}
          <div className="duel-proof"><ShieldCheck size={16} /> YOUR COMMITMENT: <code>{room.myCommitment.slice(0, 24)}…</code></div>
          {room.state === 'DONE' && room.myMove && room.rivalMove && <div className="duel-audit"><div><span>YOUR SEALED HASH</span><code>{room.myCommitment}</code></div><div><span>RIVAL SEALED HASH</span><code>{room.rivalCommitment}</code></div><div><span>YOUR REVEAL SALT</span><code>{room.mySalt}</code></div><div><span>RIVAL REVEAL SALT</span><code>{room.rivalSalt}</code></div><button onClick={() => void verify()}><ShieldCheck size={15} /> VERIFY BOTH MOVES</button><button onClick={downloadProof}><Download size={15} /> SAVE PROOF JSON</button>{verified !== null && <strong className={verified ? 'verify-good' : 'verify-bad'}>{verified ? 'BOTH COMMITMENTS MATCH' : 'PROOF CHECK FAILED'}</strong>}</div>}
        </div>}
        {error && <p className="inline-error" role="alert">{error}</p>}
      </div>
      <div className="frame-footer"><span><LockKeyhole size={15} /> SEALED MOVES</span><span><ShieldCheck size={15} /> VERIFIED REVEALS</span><span><Star size={15} /> TEST CREDITS ONLY</span></div>
    </section>
    <aside className="duel-sidebar"><section className="panel"><div className="panel-head"><span>DUEL TERMINAL</span><span className="panel-dot">● ● ●</span></div><div className="duel-score"><span>YOUR DEMO BALANCE</span><strong>{session ? (session.balance / 100).toFixed(2) : '—'} <small>tNIGHT</small></strong><p>1.00 entry / 1.90 winner payout / draw refunds both</p></div><div className="duel-tally"><div><span>DUELS</span><strong>{session?.played ?? '—'}</strong></div><div><span>WINS</span><strong>{session?.wins ?? '—'}</strong></div></div></section><section className="duel-rules panel"><div className="panel-head"><span>THE POWER TRIANGLE</span><MoonStar size={15} /></div><div className="duel-triangle"><div>☾ <span>MOON BEATS STAR</span></div><div>★ <span>STAR BEATS SHADOW</span></div><div>◆ <span>SHADOW BEATS MOON</span></div></div><p>Matching moves tie. If a player fails to reveal, the revealer wins after the deadline. If neither reveals, both stakes return.</p></section><div className="duel-honesty"><ShieldCheck size={25} /><span><strong>PLAY A REAL PERSON</strong><small>This shared-room demo works across browsers. Credits are simulated; wallet and on-chain staking are not connected yet.</small></span></div></aside>
  </div>;
}
