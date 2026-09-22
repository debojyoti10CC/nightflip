import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, Check, Coins, Download,
  History, LockKeyhole, Menu, MoonStar, RotateCcw, ShieldCheck,
  Sparkles, Star, Users, Volume2, VolumeX, Wallet, X,
} from 'lucide-react';
import {
  loadDemo, prepareDemoRound, resetDemo, resolveDemoRound, saveDemo,
  verifyDemoRound, type DemoRound, type DemoSave, type Side,
} from './game/demo';
import Duel from './Duel';
import './duel.css';
import { connectPreprodWallet, type WalletInfo } from './wallet/lace';

type Phase = 'idle' | 'committing' | 'flipping' | 'result';
type Panel = 'how' | 'fairness' | 'feedback' | 'wallet' | null;

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function SideMark({ side, size = 36 }: { side: Side; size?: number }) {
  if (side === 'MOON') return <MoonStar size={size} strokeWidth={1.8} />;
  return <span className="shadow-mark" style={{ width: size, height: size }}><Star size={size * .72} fill="currentColor" strokeWidth={1.5} /></span>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-top"><span className="eyebrow">NIGHTFLIP / INFO TERMINAL</span><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      <h2>{title}</h2>
      {children}
    </section>
  </div>;
}

function FairnessPanel({ round, onClose }: { round?: DemoRound; onClose: () => void }) {
  const [verified, setVerified] = useState<boolean | null>(null);
  useEffect(() => { setVerified(null); }, [round]);
  const check = async () => { if (round) setVerified(await verifyDemoRound(round)); };
  const download = () => {
    if (!round) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ protocol: 'nightflip-solo-demo-v1', mode: 'browser-demo', ...round }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = `nightflip-proof-${round.id}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <Modal title="FAIRNESS CHECK" onClose={onClose}>
    <p className="modal-lede">Each demo round locks a random seed behind a commitment before the coin flips. After the flip, the seed is revealed so you can reproduce the result.</p>
    {round ? <>
      <div className="proof-list">
        <div><span>ROUND ID</span><strong>#{String(round.id).padStart(3, '0')}</strong></div>
        <div><span>COMMITMENT BEFORE FLIP</span><code>{round.roundCommitment}</code></div>
        <div><span>REVEALED SEED</span><code>{round.seed}</code></div>
        <div><span>OUTCOME HASH</span><code>{round.outcomeHash}</code></div>
        <div><span>RULE</span><strong>First hash byte ≥ 128 → Moon; otherwise Shadow</strong></div>
      </div>
      <button className="button button-lime modal-action" onClick={check}><ShieldCheck size={17} /> VERIFY THIS ROUND</button>
      <button className="button button-outline modal-action" onClick={download}><Download size={17} /> SAVE PROOF JSON</button>
      {verified !== null && <p className={verified ? 'verify-good' : 'verify-bad'}>{verified ? '✓ Commitment and result verified in your browser.' : 'Verification failed. This demo round may have been altered.'}</p>}
    </> : <div className="empty-proof"><ShieldCheck size={33} /><p>Flip once to reveal the first proof record.</p></div>}
    <p className="modal-footnote">Demo hashes use browser SHA-256. The Preprod contract uses Midnight Compact persistent hashes and zero-knowledge proofs. Demo credits are local and have no token value.</p>
  </Modal>;
}

function FeedbackPanel({ mode, onClose }: { mode: 'solo' | 'duel'; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('Game clarity');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedWhere, setSavedWhere] = useState<'server' | 'browser'>('browser');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) return;
    const entry = { rating, category, message: message.slice(0, 1000), mode };
    try {
      const response = await fetch(`${import.meta.env.VITE_DUEL_API_URL || ''}/api/feedback`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
      if (!response.ok) throw new Error('Feedback service unavailable');
      setSavedWhere('server');
    } catch {
      const previous = JSON.parse(localStorage.getItem('nightflip-feedback-v1') || '[]') as unknown[];
      localStorage.setItem('nightflip-feedback-v1', JSON.stringify([{ ...entry, at: new Date().toISOString() }, ...previous].slice(0, 100)));
      setSavedWhere('browser');
    }
    setSubmitted(true);
  };
  return <Modal title="TELL US HOW IT FELT" onClose={onClose}>
    {submitted ? <div className="feedback-done"><Sparkles size={45} /><h3>MESSAGE SAVED</h3><p>{savedWhere === 'server' ? 'Your feedback reached the project demo service. Thank you for helping improve the game.' : 'The service was unavailable, so your feedback is saved in this browser. Please try sending it later.'}</p><button className="button button-lime" onClick={onClose}>BACK TO THE NIGHT <ArrowRight size={17} /></button></div> :
      <form className="feedback-form" onSubmit={submit}>
        <p className="modal-lede">Tell us what felt fun or confusing in {mode === 'duel' ? 'Night Duel' : 'Solo Flip'}. Feedback goes to the project demo service. Please leave out wallet addresses and other private details.</p>
        <label className="field-label">HOW CLEAR WAS THE GAME?</label>
        <div className="rating-row" role="group" aria-label="Game clarity rating">
          {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} out of 5`} className={rating >= value ? 'rating active' : 'rating'} onClick={() => setRating(value)}><Star size={25} fill="currentColor" /></button>)}
        </div>
        <label className="field-label" htmlFor="feedback-category">WHAT SHOULD WE IMPROVE?</label>
        <select id="feedback-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Game clarity</option><option>Duel strategy</option><option>Multiplayer connection</option><option>Visual design</option><option>Fairness explanation</option><option>Wallet onboarding</option><option>Performance</option>
        </select>
        <label className="field-label" htmlFor="feedback-message">ANYTHING ELSE? <span>OPTIONAL</span></label>
        <textarea id="feedback-message" rows={4} maxLength={1000} placeholder="Tell us what worked or what felt confusing…" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="button button-lime modal-action" type="submit" disabled={!rating}>SEND FEEDBACK <ArrowRight size={17} /></button>
      </form>}
  </Modal>;
}

function App() {
  const [mode, setMode] = useState<'duel' | 'solo'>('duel');
  const [save, setSave] = useState<DemoSave>(loadDemo);
  const [selection, setSelection] = useState<Side | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeRound, setActiveRound] = useState<DemoRound | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [sound, setSound] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [error, setError] = useState('');
  const busy = useRef(false);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => { saveDemo(save); }, [save]);

  const roundId = (save.rounds[0]?.id ?? 0) + 1;
  const wins = save.rounds.filter((round) => round.won).length;
  const updateSave = (next: DemoSave) => { setSave(next); saveDemo(next); };
  const tone = (frequency: number, duration = 0.12) => {
    if (!sound) return;
    try {
      const context = audio.current ?? (audio.current = new AudioContext());
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch { /* Audio is optional if browser policy blocks it. */ }
  };

  const flip = async () => {
    if (busy.current || !selection || save.balance < 1) return;
    busy.current = true;
    setError('');
    try {
      setPhase('committing');
      tone(330);
      const chosen = selection;
      const prepared = await prepareDemoRound(roundId);
      updateSave({ ...save, balance: Math.round((save.balance - 1) * 100) / 100 });
      await delay(650);
      setPhase('flipping');
      tone(440, 0.18);
      await delay(2300);
      const round = await resolveDemoRound(roundId, chosen, prepared.seed, prepared.commitment);
      updateSave({ balance: Math.round((save.balance - 1) * 100) / 100, rounds: [round, ...save.rounds] });
      setActiveRound(round);
      setPhase('result');
      tone(round.won ? 660 : 220, 0.3);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The demo flip failed. Try again.');
      setPhase('idle');
    } finally { busy.current = false; }
  };

  const claim = () => {
    if (!activeRound?.won || activeRound.claimed) return;
    const updated = { ...activeRound, claimed: true };
    setActiveRound(updated);
    tone(880, 0.2);
    updateSave({ balance: Math.round((save.balance + 1.9) * 100) / 100, rounds: save.rounds.map((round) => round.id === updated.id ? updated : round) });
  };

  const playAgain = () => { setSelection(null); setActiveRound(null); setPhase('idle'); setError(''); };
  const restart = () => { updateSave(resetDemo()); playAgain(); setPanel(null); };
  const connectWallet = async () => {
    setWalletBusy(true); setWalletError('');
    try { setWalletInfo(await connectPreprodWallet()); }
    catch (cause) { setWalletError(cause instanceof Error ? cause.message : 'Wallet connection failed.'); }
    finally { setWalletBusy(false); }
  };

  const buttonLabel = phase === 'committing' ? 'LOCKING YOUR PICK…' : phase === 'flipping' ? 'FLIPPING THE NIGHT…' : 'FLIP FOR 1 tNIGHT';

  return <div className="site-shell">
    <div className="scanlines" aria-hidden="true" />
    <div className="utility-bar"><div className="utility-inner"><span><span className="live-dot" /> MIDNIGHT PREPROD TEST ARCADE</span><span>TEST TOKENS ONLY <span className="utility-separator">//</span> NO REAL-WORLD VALUE</span><span className="utility-build">BUILD 01 • 199X EDITION</span></div></div>

    <header className="site-header">
      <div className="brand" aria-label="NightFlip home"><span className="brand-emblem"><span>✦</span></span><span className="brand-name">NIGHT<span>FLIP</span><small>MOON OR NOTHING</small></span></div>
      <nav className={mobileMenu ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
        <button className="nav-link active" onClick={() => { setMode('duel'); setMobileMenu(false); }}>THE GAME</button>
        <button className="nav-link" onClick={() => { setPanel('how'); setMobileMenu(false); }}>HOW TO PLAY</button>
        <button className="nav-link" onClick={() => { setPanel('fairness'); setMobileMenu(false); }}>FAIRNESS</button>
        <button className="nav-link" onClick={() => { setPanel('feedback'); setMobileMenu(false); }}>FEEDBACK</button>
      </nav>
      <div className="header-actions"><span className="demo-tag"><span /> DEMO MODE</span><button className="wallet-button" onClick={() => setPanel('wallet')}><Wallet size={17} /> {walletInfo ? 'LACE CONNECTED' : 'CONNECT WALLET'} <ArrowDownRight size={16} /></button><button className="menu-button" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={23} /></button></div>
    </header>

    <main>
      <section className="intro-strip"><div><span className="intro-kicker"><span className="intro-star">✳</span> WELCOME TO THE AFTER HOURS</span><h1>{mode === 'duel' ? <>OUTSMART A RIVAL.<br /><em>OWN THE NIGHT.</em></> : <>CALL THE COIN.<br /><em>CHASE THE NIGHT.</em></>}</h1><p>{mode === 'duel' ? 'Three hidden moves. One real opponent. Your call.' : 'One private pick. One fixed stake. One moment of truth.'}</p></div><div className="intro-stamp"><span>THE MIDNIGHT</span><strong>ARCADE</strong><span>EST. 199X</span></div></section>

      <div className="mode-switch" role="tablist" aria-label="Game modes"><button role="tab" aria-selected={mode === 'duel'} className={mode === 'duel' ? 'active' : ''} onClick={() => setMode('duel')}><Users size={18} /> NIGHT DUEL <small>2 PLAYERS</small></button><button role="tab" aria-selected={mode === 'solo'} className={mode === 'solo' ? 'active' : ''} onClick={() => setMode('solo')}><MoonStar size={18} /> SOLO FLIP <small>CLASSIC MODE</small></button></div>

      {mode === 'duel' ? <Duel /> : <div className="game-layout">
        <section className="game-frame" aria-label="NightFlip game">
          <div className="frame-top"><div className="frame-heading"><span className="frame-symbol">✦</span> THE NIGHT ROOM <span className="frame-sub">// MAIN EVENT</span></div><div className="frame-controls"><span className="round-status"><span /> ROUND #{String(roundId).padStart(3, '0')}</span><button className="small-icon" onClick={() => setSound(!sound)} aria-label={sound ? 'Mute sound' : 'Enable sound'} title={sound ? 'Mute sound' : 'Enable sound'}>{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button></div></div>

          <div className="night-room">
            <div className="room-grid" /><div className="starfield" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ left: `${(index * 37 + 13) % 100}%`, top: `${(index * 19 + 7) % 65}%`, animationDelay: `${(index % 7) * .4}s` }} />)}</div>
            <div className="horizon" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
            <div className="room-label label-left">⚡ PRIVATE PICK</div><div className="room-label label-right">50<span>/</span>50 ODDS</div>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="coin-stage"><div className={`coin ${phase === 'flipping' ? 'coin-flipping' : ''} ${phase === 'result' && activeRound?.outcome === 'SHADOW' ? 'coin-shadow-result' : ''}`}>
              <div className="coin-face coin-front"><div className="coin-face-inner"><MoonStar size={86} strokeWidth={1.2} /><span>MOON</span></div></div>
              <div className="coin-face coin-back"><div className="coin-face-inner"><SideMark side="SHADOW" size={86} /><span>SHADOW</span></div></div>
            </div><div className="coin-halo" /></div>
            <div className="room-floor" />
            <div className="room-bottom-label">{phase === 'idle' ? 'PICK A SIDE TO BEGIN' : phase === 'committing' ? 'YOUR CHOICE IS LOCKED' : phase === 'flipping' ? 'FATE IS IN MOTION' : activeRound?.won ? 'THE NIGHT IS YOURS' : 'THE NIGHT CHOSE OTHERWISE'}</div>
          </div>

          <div className="play-area">
            <div className="play-heading"><div><span className="eyebrow">01 / MAKE YOUR CALL</span><h2>MOON <span>OR</span> SHADOW?</h2></div><div className="private-note"><LockKeyhole size={15} /> YOUR PICK STAYS PRIVATE</div></div>
            <div className="side-options">
              {(['MOON', 'SHADOW'] as Side[]).map((side) => <button key={side} type="button" className={`side-card ${side.toLowerCase()} ${selection === side ? 'selected' : ''}`} aria-pressed={selection === side} onClick={() => phase === 'idle' && setSelection(side)} disabled={phase !== 'idle'}>
                <span className="side-card-icon"><SideMark side={side} size={38} /></span><span className="side-card-copy"><span className="side-card-name">{side}</span><span className="side-card-description">{side === 'MOON' ? 'Follow the light' : 'Trust the dark'}</span></span><span className="side-card-check">{selection === side ? <Check size={18} /> : '○'}</span>
              </button>)}
            </div>
            <div className="action-row">
              {phase === 'result' ? <div className="result-actions"><div className={`result-callout ${activeRound?.won ? 'win' : 'loss'}`}><span>{activeRound?.won ? '✦ WINNER WINNER' : '✳ ROUND COMPLETE'}</span><strong>{activeRound?.won ? '+1.90 tNIGHT' : `${activeRound?.outcome} WON`}</strong><small>{activeRound?.won ? 'Demo payout ready to claim' : 'Your 1 tNIGHT demo stake was spent'}</small></div><div className="result-buttons">{activeRound?.won && !activeRound.claimed && <button className="button button-lime" onClick={claim}><Coins size={19} /> CLAIM 1.90</button>}<button className="button button-outline" onClick={playAgain}>PLAY AGAIN <RotateCcw size={17} /></button></div></div> : <><button className="button button-lime flip-button" onClick={flip} disabled={!selection || phase !== 'idle' || save.balance < 1}>{phase === 'idle' ? <span className="flip-spark">✦</span> : <span className="spinner" />}{buttonLabel}<ArrowRight size={21} /></button><div className="stake-note"><strong>FIXED STAKE</strong><span>1.00 tNIGHT <span className="dot-divide">•</span> WIN 1.90</span></div></>}
            </div>
            {error && <p className="inline-error" role="alert">{error}</p>}
            {save.balance < 1 && phase === 'idle' && <div className="low-credits">Demo credits exhausted. <button onClick={restart}>Reset your demo session</button> to play again.</div>}
          </div>
          <div className="frame-footer"><span><ShieldCheck size={15} /> COMMITTED ROUND SEED</span><span><LockKeyhole size={15} /> HIDDEN PLAYER CHOICE</span><span><Sparkles size={15} /> TESTNET ONLY</span></div>
        </section>

        <aside className="sidebar">
          <section className="panel wallet-panel"><div className="panel-head"><span>PLAYER TERMINAL</span><span className="panel-dot">● ● ●</span></div><div className="wallet-top"><div className="avatar-badge">✦</div><div><span className="eyebrow">CURRENT SESSION</span><strong>ARCADE GUEST</strong></div><span className="online-pill">ONLINE</span></div><div className="balance-box"><span>DEMO CREDIT BALANCE</span><strong>{save.balance.toFixed(2)} <small>tNIGHT</small></strong><div className="balance-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="wallet-meta"><span><Coins size={15} /> FIXED BET <strong>1.00</strong></span><span><Sparkles size={15} /> WIN PAYS <strong>1.90</strong></span></div><p className="panel-disclaimer">Local demo credits only. No wallet, blockchain transaction, or real token balance is connected.</p></section>

          <section className="panel stats-panel"><div className="panel-head"><span>YOUR AFTER-HOURS STATS</span><History size={15} /></div><div className="stats-grid"><div><span>ROUNDS PLAYED</span><strong>{String(save.rounds.length).padStart(2, '0')}</strong></div><div><span>WINS</span><strong>{String(wins).padStart(2, '0')}</strong></div></div><div className="history-head"><span>RECENT FLIPS</span><button onClick={restart} title="Reset demo session">RESET <RotateCcw size={12} /></button></div><div className="history-list">{save.rounds.length ? save.rounds.slice(0, 4).map((round) => <button className="history-item" key={round.id} onClick={() => { setActiveRound(round); setPanel('fairness'); }}><span className={`history-symbol ${round.outcome.toLowerCase()}`}><SideMark side={round.outcome} size={18} /></span><span><strong>ROUND #{String(round.id).padStart(3, '0')}</strong><small>{round.choice} PICK</small></span><em className={round.won ? 'won' : 'lost'}>{round.won ? 'WON' : 'LOST'}</em></button>) : <div className="history-empty">NO FLIPS YET <span>✦</span><small>Your story starts with one call.</small></div>}</div></section>

          <button className="fairness-card" onClick={() => setPanel('fairness')}><span className="fairness-icon"><ShieldCheck size={27} /></span><span><strong>FAIR PLAY,<br />NO GUESSWORK.</strong><small>See how the coin is locked before you play.</small><b>EXPLORE FAIRNESS <ArrowRight size={14} /></b></span></button>
        </aside>
      </div>}

      <section className="how-strip"><div><span className="eyebrow">{mode === 'duel' ? 'THE DUEL FLOW' : 'THE RULES ARE SIMPLE'}</span><h2>THREE MOVES.<br /><em>ONE FATE.</em></h2></div>{mode === 'duel' ? <><div className="rule"><span>01</span><MoonStar size={27} /><strong>CHOOSE & COMMIT</strong><p>Pick Moon, Shadow, or Star. Only a salted hash reaches the room service.</p></div><div className="rule"><span>02</span><Users size={29} /><strong>BRING A RIVAL</strong><p>Share the room link. Both players lock one demo credit before any reveal.</p></div><div className="rule"><span>03</span><ShieldCheck size={29} /><strong>REVEAL & VERIFY</strong><p>Both moves are checked against their commitments. Winner gets 1.90; ties refund both.</p></div></> : <><div className="rule"><span>01</span><SideMark side="MOON" size={27} /><strong>CHOOSE A SIDE</strong><p>Moon or Shadow. Your choice stays hidden behind a commitment.</p></div><div className="rule"><span>02</span><Coins size={29} /><strong>LOCK YOUR STAKE</strong><p>One fixed test stake. No bet sliders, no surprises.</p></div><div className="rule"><span>03</span><Sparkles size={29} /><strong>REVEAL & CLAIM</strong><p>Watch the flip, verify the seed, and claim if you win.</p></div></>}</section>
      <section className="closing-banner"><span>✦</span><p>THE NIGHT IS YOUNG. <strong>{mode === 'duel' ? 'WHO WILL OWN THE ROOM?' : "WHAT'S YOUR CALL?"}</strong></p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button></section>
    </main>

    <footer className="site-footer"><div className="brand footer-brand"><span className="brand-emblem"><span>✦</span></span><span className="brand-name">NIGHT<span>FLIP</span></span></div><p>BUILT FOR MIDNIGHT PREPROD. FREE TEST TOKENS. ZERO REAL-WORLD VALUE.</p><div><button onClick={() => setPanel('how')}>HOW TO PLAY</button><button onClick={() => setPanel('feedback')}>FEEDBACK</button><span>© 2026 NIGHTFLIP</span></div></footer>

    {panel === 'how' && <Modal title="HOW TO PLAY" onClose={() => setPanel(null)}><div className="how-modal">{mode === 'duel' ? <><div><b>01</b><h3>LOCK A HIDDEN MOVE</h3><p>Moon beats Star, Star beats Shadow, Shadow beats Moon. Your browser hashes your move with a fresh random salt before joining the room.</p></div><div><b>02</b><h3>INVITE A RIVAL</h3><p>Share the room link. A second browser locks a move and one simulated demo credit. Neither player sees the other's choice.</p></div><div><b>03</b><h3>BOTH REVEAL</h3><p>Each player reveals their move and salt. The service checks both commitments. A tie refunds both stakes.</p></div><div><b>04</b><h3>SETTLE OR TIME OUT</h3><p>The winner receives 1.90 simulated credits. If a rival fails to reveal in time, the revealing player wins; if neither reveals, both are refunded.</p></div></> : <><div><b>01</b><h3>MAKE A PRIVATE PICK</h3><p>Choose Moon or Shadow. Your choice and random salt form a commitment. The public game sees the commitment, not your side.</p></div><div><b>02</b><h3>LOCK 1 tNIGHT</h3><p>Every bet is exactly 1 test tNIGHT. In this demo, credits are simulated locally; the Preprod flow uses the Midnight contract.</p></div><div><b>03</b><h3>REVEAL THE SEED</h3><p>A seed is committed before bets open and revealed afterward. The outcome is derived from that seed and can be checked independently.</p></div><div><b>04</b><h3>CLAIM OR REFUND</h3><p>A correct guess wins 1.90 test tNIGHT. If a real Preprod round misses its reveal deadline, the contract allows a refund.</p></div></>}</div><button className="button button-lime modal-action" onClick={() => setPanel(null)}>LET'S PLAY <ArrowRight size={17} /></button></Modal>}
    {panel === 'fairness' && (mode === 'duel' ? <Modal title="DUEL FAIRNESS" onClose={() => setPanel(null)}><p className="modal-lede">Both players commit a salted SHA-256 hash before revealing. The room service checks each move and salt against its hash. After a completed duel, the game shows both hashes and salts so either browser can verify them.</p><div className="how-modal"><div><b>01</b><h3>LOCKED BEFORE REVEAL</h3><p>The second player cannot see the first move when choosing. A 32-byte random salt makes guessing a hidden move from its hash impractical.</p></div><div><b>02</b><h3>OPEN RESULT</h3><p>Moon beats Star; Star beats Shadow; Shadow beats Moon. Matching moves refund both stakes.</p></div></div><p className="modal-footnote">This browser duel is a centralized demo with simulated credits. Its room service and hashes are not on Midnight Preprod yet.</p></Modal> : <FairnessPanel round={activeRound ?? save.rounds[0]} onClose={() => setPanel(null)} />)}
    {panel === 'feedback' && <FeedbackPanel mode={mode} onClose={() => setPanel(null)} />}
    {panel === 'wallet' && <Modal title="ENTER THE NIGHT" onClose={() => setPanel(null)}><p className="modal-lede">Connect a Lace Midnight wallet to check Preprod readiness. Gameplay remains a simulated demo until the contracts, proof service, and transaction flow are deployed.</p><div className="wallet-options"><div className="wallet-option active"><div><span className="wallet-option-icon">✦</span><span><strong>PLAY LOCAL DEMO</strong><small>Instant play • simulated credits</small></span></div><Check size={19} /></div><div className="wallet-option"><div><span className="wallet-option-icon"><Wallet size={20} /></span><span><strong>{walletInfo ? 'LACE CONNECTED TO PREPROD' : 'CONNECT LACE ON PREPROD'}</strong><small>{walletInfo ? `${walletInfo.coinPublicKey.slice(0, 15)}…${walletInfo.coinPublicKey.slice(-8)}` : 'Wallet discovery and network handshake only'}</small></span></div>{walletInfo ? <Check size={19} /> : <button className="wallet-connect-action" onClick={() => void connectWallet()} disabled={walletBusy}>{walletBusy ? 'CONNECTING…' : 'CONNECT'}</button>}</div></div>{walletError && <p className="inline-error" role="alert">{walletError}</p>}{walletInfo && <p className="verify-good">Preprod connector ready. No game transaction has been submitted.</p>}<button className="button button-lime modal-action" onClick={() => setPanel(null)}>CONTINUE IN DEMO <ArrowRight size={17} /></button><p className="modal-footnote">Never enter a wallet seed phrase into this page. Official Preprod wallet authorization stays in Lace.</p></Modal>}
  </div>;
}

export default App;
