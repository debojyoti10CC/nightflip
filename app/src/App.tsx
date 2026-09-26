import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, Check, Coins, Download,
  History, LockKeyhole, Menu, MoonStar, RotateCcw, ShieldCheck,
  Sparkles, Star, Users, Volume2, VolumeX, Wallet, X,
} from 'lucide-react';
import {
  loadDemo, saveDemo,
  verifyDemoRound, type DemoRound, type DemoSave, type Side,
} from './game/demo';
import './duel.css';
import { connectPreprodWallet, hasPreprodWallet, type WalletInfo } from './wallet/lace';
import { NightStage, type NightStagePhase } from './scene/NightStage';
import './scene/night-stage.css';

type Phase = 'idle' | 'committing' | 'flipping' | 'result';
type Panel = 'how' | 'fairness' | 'feedback' | 'wallet' | null;

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
    <p className="modal-lede">Each NightFlip contract round locks a seed commitment before bets open. After close, the operator reveals the seed and anyone can reproduce the public outcome.</p>
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
    </> : <div className="empty-proof"><ShieldCheck size={33} /><p>No revealed Preprod round is available in this browser yet.</p></div>}
    <p className="modal-footnote">The Preprod contract uses Midnight Compact persistent hashes and zero-knowledge proofs. This screen will show a real round receipt only after a contract is deployed and a round settles.</p>
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
  const [mode, setMode] = useState<'duel' | 'solo'>('solo');
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
  const contractAddress = (import.meta.env.VITE_NIGHTFLIP_CONTRACT_ADDRESS || '').trim();
  const preprodPlayable = Boolean(walletInfo && contractAddress);
  const walletDetected = hasPreprodWallet();
  const [error, setError] = useState('');
  const audio = useRef<AudioContext | null>(null);
  const musicTimer = useRef<number | null>(null);

  useEffect(() => { saveDemo(save); }, [save]);

  const displayedRounds = contractAddress ? save.rounds : [];
  const wins = displayedRounds.filter((round) => round.won).length;
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

  useEffect(() => {
    if (!sound) return;
    const context = audio.current ?? (audio.current = new AudioContext());
    const notes = [110, 146.83, 164.81, 146.83, 123.47, 164.81, 196, 164.81];
    let step = 0;
    const playPulse = () => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = step % 4 === 0 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(notes[step % notes.length], context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.028, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.45);
      step += 1;
    };
    void context.resume().then(() => {
      playPulse();
      musicTimer.current = window.setInterval(playPulse, 460);
    });
    return () => {
      if (musicTimer.current !== null) window.clearInterval(musicTimer.current);
      musicTimer.current = null;
    };
  }, [sound]);

  const flip = async () => {
    if (!walletInfo) {
      setPanel('wallet');
      setError('Connect a Midnight Preprod wallet before you place a stake.');
      return;
    }
    if (!contractAddress) {
      setError('NightFlip is waiting for its Preprod contract address. No stake can be submitted until deployment is complete.');
      return;
    }
    setError('The contract address is configured, but the live circuit client has not been enabled in this build. No transaction was submitted.');
  };

  const claim = () => {
    if (!activeRound?.won || activeRound.claimed) return;
    const updated = { ...activeRound, claimed: true };
    setActiveRound(updated);
    tone(880, 0.2);
    updateSave({ balance: Math.round((save.balance + 1.9) * 100) / 100, rounds: save.rounds.map((round) => round.id === updated.id ? updated : round) });
  };

  const playAgain = () => { setSelection(null); setActiveRound(null); setPhase('idle'); setError(''); };
  const connectWallet = async () => {
    setWalletBusy(true); setWalletError('');
    try { setWalletInfo(await connectPreprodWallet()); }
    catch (cause) { setWalletError(cause instanceof Error ? cause.message : 'Wallet connection failed.'); }
    finally { setWalletBusy(false); }
  };

  const buttonLabel = !walletInfo ? 'CONNECT PREPROD WALLET' : !contractAddress ? 'PREPROD CONTRACT PENDING' : phase === 'committing' ? 'LOCKING YOUR PICK…' : phase === 'flipping' ? 'FLIPPING THE NIGHT…' : 'STAKE 1 tNIGHT';
  const stagePhase: NightStagePhase = !walletInfo || !contractAddress
    ? 'offline'
    : phase === 'committing' ? 'preparing'
      : phase === 'flipping' ? 'revealing'
        : phase === 'result' ? 'revealed' : 'open';
  const stageDetail = !walletInfo
    ? 'Connect Lace on Midnight Preprod. Your wallet remains in control.'
    : !contractAddress
      ? 'The NightFlip contract is being prepared on Preprod. Stakes remain disabled until its on-chain address is verified.'
      : phase === 'result' && activeRound
        ? `Round settled: ${activeRound.outcome} was revealed from the committed seed.`
        : undefined;

  return <div className="site-shell">
    <div className="scanlines" aria-hidden="true" />
    <div className="utility-bar"><div className="utility-inner"><span><span className="live-dot" /> MIDNIGHT PREPROD TEST ARCADE</span><span>TEST TOKENS ONLY <span className="utility-separator">//</span> NO REAL-WORLD VALUE</span><span className="utility-build">BUILD 01 • 199X EDITION</span></div></div>

    <header className="site-header">
      <div className="brand" aria-label="NightFlip home"><span className="brand-emblem"><span>✦</span></span><span className="brand-name">NIGHT<span>FLIP</span><small>MOON OR NOTHING</small></span></div>
      <nav className={mobileMenu ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
        <button className="nav-link active" onClick={() => { setMode('solo'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenu(false); }}>THE GAME</button>
        <button className="nav-link" onClick={() => { setPanel('how'); setMobileMenu(false); }}>HOW TO PLAY</button>
        <button className="nav-link" onClick={() => { setPanel('fairness'); setMobileMenu(false); }}>FAIRNESS</button>
        <button className="nav-link" onClick={() => { setPanel('feedback'); setMobileMenu(false); }}>FEEDBACK</button>
      </nav>
      <div className="header-actions"><span className="demo-tag"><span /> PREPROD MODE</span><button className="wallet-button" onClick={() => setPanel('wallet')}><Wallet size={17} /> {walletInfo ? 'LACE CONNECTED' : 'CONNECT WALLET'} <ArrowDownRight size={16} /></button><button className="menu-button" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={23} /></button></div>
    </header>

    <main>
      <section className="intro-strip"><div><span className="intro-kicker"><span className="intro-star">✳</span> WELCOME TO THE AFTER HOURS</span><h1>{mode === 'duel' ? <>OUTSMART A RIVAL.<br /><em>OWN THE NIGHT.</em></> : <>CALL THE COIN.<br /><em>CHASE THE NIGHT.</em></>}</h1><p>{mode === 'duel' ? 'Three hidden moves. One real opponent. Your call.' : 'One private pick. One fixed stake. One moment of truth.'}</p></div><div className="intro-stamp"><span>THE MIDNIGHT</span><strong>ARCADE</strong><span>EST. 199X</span></div></section>

      <div className="game-layout">
        <section className="game-frame" aria-label="NightFlip game">
          <div className="frame-top"><div className="frame-heading"><span className="frame-symbol">✦</span> THE NIGHT ROOM <span className="frame-sub">// PREPROD TABLE</span></div><div className="frame-controls"><span className="round-status"><span /> {contractAddress ? `CONTRACT ${contractAddress.slice(0, 8)}…` : 'CONTRACT NOT DEPLOYED'}</span><button className="small-icon sound-toggle" onClick={() => setSound(!sound)} aria-label={sound ? 'Mute arcade music' : 'Play arcade music'} title={sound ? 'Mute arcade music' : 'Play arcade music'}>{sound ? <><Volume2 size={16} /><small>SOUND ON</small></> : <><VolumeX size={16} /><small>SOUND OFF</small></>}</button></div></div>

          <div className="night-room night-room--live">
            <NightStage
              phase={stagePhase}
              roundId={contractAddress ? undefined : null}
              choice={selection}
              outcome={activeRound?.outcome}
              won={activeRound?.won}
              betCount={0}
              statusDetail={stageDetail}
            />
          </div>

          <div className="play-area">
            <div className="play-heading"><div><span className="eyebrow">01 / MAKE YOUR CALL</span><h2>MOON <span>OR</span> SHADOW?</h2></div><div className={preprodPlayable ? 'private-note ready' : 'private-note'}><LockKeyhole size={15} /> {preprodPlayable ? 'PREPROD TABLE READY' : 'PRIVATE PICK • PREPROD SETUP'}</div></div>
            <div className="side-options">
              {(['MOON', 'SHADOW'] as Side[]).map((side) => <button key={side} type="button" className={`side-card ${side.toLowerCase()} ${selection === side ? 'selected' : ''}`} aria-pressed={selection === side} onClick={() => phase === 'idle' && setSelection(side)} disabled={phase !== 'idle'}>
                <span className="side-card-icon"><SideMark side={side} size={38} /></span><span className="side-card-copy"><span className="side-card-name">{side}</span><span className="side-card-description">{side === 'MOON' ? 'Follow the light' : 'Trust the dark'}</span></span><span className="side-card-check">{selection === side ? <Check size={18} /> : '○'}</span>
              </button>)}
            </div>
            <div className="action-row">
              {phase === 'result' ? <div className="result-actions"><div className={`result-callout ${activeRound?.won ? 'win' : 'loss'}`}><span>{activeRound?.won ? '✦ WINNER WINNER' : '✳ ROUND COMPLETE'}</span><strong>{activeRound?.won ? '+1.90 tNIGHT' : `${activeRound?.outcome} WON`}</strong><small>{activeRound?.won ? 'Demo payout ready to claim' : 'Your 1 tNIGHT demo stake was spent'}</small></div><div className="result-buttons">{activeRound?.won && !activeRound.claimed && <button className="button button-lime" onClick={claim}><Coins size={19} /> CLAIM 1.90</button>}<button className="button button-outline" onClick={playAgain}>PLAY AGAIN <RotateCcw size={17} /></button></div></div> : <><button className="button button-lime flip-button" onClick={flip} disabled={phase !== 'idle' || (preprodPlayable && !selection)}>{phase === 'idle' ? <span className="flip-spark">✦</span> : <span className="spinner" />}{buttonLabel}<ArrowRight size={21} /></button><div className="stake-note"><strong>FIXED PREPROD STAKE</strong><span>1.00 tNIGHT <span className="dot-divide">•</span> WIN 1.90</span></div></>}
            </div>
            {error && <p className="inline-error" role="alert">{error}</p>}
            {walletInfo && !contractAddress && phase === 'idle' && <div className="low-credits">Wallet connected. The game will unlock after the NightFlip Preprod contract is deployed and its address is configured.</div>}
          </div>
          <div className="frame-footer"><span><ShieldCheck size={15} /> COMMITTED ROUND SEED</span><span><LockKeyhole size={15} /> HIDDEN PLAYER CHOICE</span><span><Sparkles size={15} /> PREPROD ONLY</span></div>
        </section>

        <aside className="sidebar">
          <section className="panel wallet-panel"><div className="panel-head"><span>PLAYER TERMINAL</span><span className="panel-dot">● ● ●</span></div><div className="wallet-top"><div className="avatar-badge">✦</div><div><span className="eyebrow">WALLET SESSION</span><strong>{walletInfo ? walletInfo.walletName : 'NOT CONNECTED'}</strong></div><span className={walletInfo ? 'online-pill' : 'online-pill offline'}>{walletInfo ? 'PREPROD' : 'OFFLINE'}</span></div><div className="balance-box"><span>{walletInfo ? 'PREPROD WALLET' : 'WALLET REQUIRED'}</span><strong>{walletInfo ? `${walletInfo.unshieldedAddress.slice(0, 10)}…${walletInfo.unshieldedAddress.slice(-6)}` : 'CONNECT'} <small>{walletInfo ? 'ADDRESS' : 'LACE'}</small></strong><div className="balance-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="wallet-meta"><span><Coins size={15} /> FIXED BET <strong>1.00</strong></span><span><Sparkles size={15} /> WIN PAYS <strong>1.90</strong></span></div><p className="panel-disclaimer">{walletInfo ? `DUST available: ${walletInfo.dustBalance.toString()} / ${walletInfo.dustCap.toString()} raw units. Contract calls remain disabled until the deployed address is set.` : 'Connect Lace on Midnight Preprod. The wallet keeps all authorization and private keys.'}</p></section>

          <section className="panel stats-panel"><div className="panel-head"><span>YOUR PREPROD ACTIVITY</span><History size={15} /></div><div className="stats-grid"><div><span>ROUNDS PLAYED</span><strong>{String(displayedRounds.length).padStart(2, '0')}</strong></div><div><span>WINS</span><strong>{String(wins).padStart(2, '0')}</strong></div></div><div className="history-head"><span>RECENT SETTLEMENTS</span><span className="eyebrow">ON-CHAIN</span></div><div className="history-list">{displayedRounds.length ? displayedRounds.slice(0, 4).map((round) => <button className="history-item" key={round.id} onClick={() => { setActiveRound(round); setPanel('fairness'); }}><span className={`history-symbol ${round.outcome.toLowerCase()}`}><SideMark side={round.outcome} size={18} /></span><span><strong>ROUND #{String(round.id).padStart(3, '0')}</strong><small>{round.choice} PICK</small></span><em className={round.won ? 'won' : 'lost'}>{round.won ? 'WON' : 'LOST'}</em></button>) : <div className="history-empty">NO SETTLEMENTS YET <span>✦</span><small>Your first confirmed Preprod bet will appear here.</small></div>}</div></section>

          <button className="fairness-card" onClick={() => setPanel('fairness')}><span className="fairness-icon"><ShieldCheck size={27} /></span><span><strong>FAIR PLAY,<br />NO GUESSWORK.</strong><small>See how the coin is locked before you play.</small><b>EXPLORE FAIRNESS <ArrowRight size={14} /></b></span></button>
        </aside>
      </div>

      <section className="how-strip"><div><span className="eyebrow">{mode === 'duel' ? 'THE DUEL FLOW' : 'THE RULES ARE SIMPLE'}</span><h2>THREE MOVES.<br /><em>ONE FATE.</em></h2></div>{mode === 'duel' ? <><div className="rule"><span>01</span><MoonStar size={27} /><strong>CHOOSE & COMMIT</strong><p>Pick Moon, Shadow, or Star. Only a salted hash reaches the room service.</p></div><div className="rule"><span>02</span><Users size={29} /><strong>BRING A RIVAL</strong><p>Share the room link. Both players lock one demo credit before any reveal.</p></div><div className="rule"><span>03</span><ShieldCheck size={29} /><strong>REVEAL & VERIFY</strong><p>Both moves are checked against their commitments. Winner gets 1.90; ties refund both.</p></div></> : <><div className="rule"><span>01</span><SideMark side="MOON" size={27} /><strong>CHOOSE A SIDE</strong><p>Moon or Shadow. Your choice stays hidden behind a commitment.</p></div><div className="rule"><span>02</span><Coins size={29} /><strong>LOCK YOUR STAKE</strong><p>One fixed test stake enters the NightFlip contract. No bet sliders, no surprises.</p></div><div className="rule"><span>03</span><Sparkles size={29} /><strong>REVEAL & CLAIM</strong><p>Watch the coin, verify the revealed seed, then claim on-chain if you win.</p></div></>}</section>
      <section className="closing-banner"><span>✦</span><p>THE NIGHT IS YOUNG. <strong>{mode === 'duel' ? 'WHO WILL OWN THE ROOM?' : "WHAT'S YOUR CALL?"}</strong></p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button></section>
    </main>

    <footer className="site-footer"><div className="brand footer-brand"><span className="brand-emblem"><span>✦</span></span><span className="brand-name">NIGHT<span>FLIP</span></span></div><p>BUILT FOR MIDNIGHT PREPROD. FREE TEST TOKENS. ZERO REAL-WORLD VALUE.</p><div><button onClick={() => setPanel('how')}>HOW TO PLAY</button><button onClick={() => setPanel('feedback')}>FEEDBACK</button><span>© 2026 NIGHTFLIP</span></div></footer>

    {panel === 'how' && <Modal title="HOW TO PLAY" onClose={() => setPanel(null)}><div className="how-modal">{mode === 'duel' ? <><div><b>01</b><h3>LOCK A HIDDEN MOVE</h3><p>Moon beats Star, Star beats Shadow, Shadow beats Moon. Your browser hashes your move with a fresh random salt before joining the room.</p></div><div><b>02</b><h3>INVITE A RIVAL</h3><p>Share the room link. A second browser locks a move and one simulated demo credit. Neither player sees the other's choice.</p></div><div><b>03</b><h3>BOTH REVEAL</h3><p>Each player reveals their move and salt. The service checks both commitments. A tie refunds both stakes.</p></div><div><b>04</b><h3>SETTLE OR TIME OUT</h3><p>The winner receives 1.90 simulated credits. If a rival fails to reveal in time, the revealing player wins; if neither reveals, both are refunded.</p></div></> : <><div><b>01</b><h3>MAKE A PRIVATE PICK</h3><p>Choose Moon or Shadow. Your choice and random salt form a commitment. The public game sees the commitment, not your side.</p></div><div><b>02</b><h3>LOCK 1 tNIGHT</h3><p>Every bet is exactly 1 test tNIGHT and is recorded by the NightFlip Preprod contract.</p></div><div><b>03</b><h3>REVEAL THE SEED</h3><p>A seed is committed before bets open and revealed afterward. The outcome is derived from that seed and can be checked independently.</p></div><div><b>04</b><h3>CLAIM OR REFUND</h3><p>A correct guess wins 1.90 test tNIGHT. If a real Preprod round misses its reveal deadline, the contract allows a refund.</p></div></>}</div><button className="button button-lime modal-action" onClick={() => setPanel(null)}>LET'S PLAY <ArrowRight size={17} /></button></Modal>}
    {panel === 'fairness' && (mode === 'duel' ? <Modal title="DUEL FAIRNESS" onClose={() => setPanel(null)}><p className="modal-lede">Both players commit a salted SHA-256 hash before revealing. The room service checks each move and salt against its hash. After a completed duel, the game shows both hashes and salts so either browser can verify them.</p><div className="how-modal"><div><b>01</b><h3>LOCKED BEFORE REVEAL</h3><p>The second player cannot see the first move when choosing. A 32-byte random salt makes guessing a hidden move from its hash impractical.</p></div><div><b>02</b><h3>OPEN RESULT</h3><p>Moon beats Star; Star beats Shadow; Shadow beats Moon. Matching moves refund both stakes.</p></div></div><p className="modal-footnote">This browser duel is a centralized demo with simulated credits. Its room service and hashes are not on Midnight Preprod yet.</p></Modal> : <FairnessPanel round={activeRound ?? save.rounds[0]} onClose={() => setPanel(null)} />)}
    {panel === 'feedback' && <FeedbackPanel mode={mode} onClose={() => setPanel(null)} />}
    {panel === 'wallet' && <Modal title="ENTER THE NIGHT" onClose={() => setPanel(null)}><p className="modal-lede">Connect a Lace Midnight wallet on Preprod. NightFlip reads your address, wallet network and DUST status locally; it never asks for a seed phrase.</p><div className="wallet-options"><div className="wallet-option active"><div><span className="wallet-option-icon">✦</span><span><strong>CONNECT ON PREPROD</strong><small>Wallet authorization stays in Lace</small></span></div><Check size={19} /></div><div className="wallet-option"><div><span className="wallet-option-icon"><Wallet size={20} /></span><span><strong>{walletInfo ? 'LACE CONNECTED TO PREPROD' : 'CONNECT LACE ON PREPROD'}</strong><small>{walletInfo ? `${walletInfo.shieldedCoinPublicKey.slice(0, 15)}…${walletInfo.shieldedCoinPublicKey.slice(-8)}` : walletDetected ? 'Compatible Lace wallet detected' : 'Install or enable Lace Midnight first'}</small></span></div>{walletInfo ? <Check size={19} /> : <button className="wallet-connect-action" onClick={() => void connectWallet()} disabled={walletBusy}>{walletBusy ? 'CONNECTING…' : 'CONNECT'}</button>}</div></div>{walletError && <p className="inline-error" role="alert">{walletError}</p>}{walletInfo && <p className="verify-good">Preprod wallet connected and validated. Contract interaction unlocks after the on-chain deployment address is configured.</p>}<button className="button button-lime modal-action" onClick={() => setPanel(null)}>RETURN TO TABLE <ArrowRight size={17} /></button><p className="modal-footnote">Never enter a wallet seed phrase into this page. Official Preprod wallet authorization stays in Lace.</p></Modal>}
  </div>;
}

export default App;
