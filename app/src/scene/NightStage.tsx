import { MoonStar, ShieldCheck, Sparkles, Star } from 'lucide-react';
import './night-stage.css';

export type NightSide = 'MOON' | 'SHADOW';
export type NightStagePhase =
  | 'offline'
  | 'open'
  | 'preparing'
  | 'sealed'
  | 'closed'
  | 'revealing'
  | 'revealed'
  | 'expired';

type NightStageProps = {
  phase: NightStagePhase;
  roundId?: number | bigint | null;
  choice?: NightSide | null;
  outcome?: NightSide | null;
  won?: boolean | null;
  secondsRemaining?: number | null;
  betCount?: number | null;
  statusDetail?: string;
};

const copy: Record<NightStagePhase, { chapter: string; title: string; detail: string }> = {
  offline: { chapter: 'SIGNAL 00', title: 'THE TABLE IS DARK', detail: 'Connect Lace on Preprod. The next live round will appear here.' },
  open: { chapter: 'SIGNAL 01', title: 'THE TABLE IS OPEN', detail: 'Choose your side while the round is accepting entries.' },
  preparing: { chapter: 'SIGNAL 02', title: 'LOCKING YOUR PICK', detail: 'Lace is proving and submitting your entry. Keep this window open.' },
  sealed: { chapter: 'SIGNAL 03', title: 'YOUR PICK IS SEALED', detail: 'Your transaction is confirmed. The other entries remain hidden until reveal.' },
  closed: { chapter: 'SIGNAL 04', title: 'THE TABLE IS CLOSED', detail: 'Betting has ended. Waiting for the operator to reveal the committed seed.' },
  revealing: { chapter: 'SIGNAL 05', title: 'THE NIGHT UNFOLDS', detail: 'The revealed on-chain outcome is coming into view.' },
  revealed: { chapter: 'SIGNAL 06', title: 'THE NIGHT HAS SPOKEN', detail: 'The seed and result are now public. Inspect the receipt below.' },
  expired: { chapter: 'SIGNAL 07', title: 'REVEAL WINDOW ENDED', detail: 'The seed was not revealed in time. Eligible entries can be refunded.' },
};

function SideGlyph({ side }: { side: NightSide }) {
  return side === 'MOON' ? <MoonStar aria-hidden="true" /> : <Star aria-hidden="true" fill="currentColor" />;
}

function formatCountdown(seconds: number | null | undefined) {
  if (seconds == null) return '—:—';
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export function NightStage({ phase, roundId, choice, outcome, won, secondsRemaining, betCount, statusDetail }: NightStageProps) {
  const revealed = phase === 'revealed' && outcome != null;
  const phaseCopy = copy[phase];
  const title = revealed ? (won == null ? `${outcome} TAKES THE NIGHT` : won ? 'YOU OWN THE NIGHT' : 'THE NIGHT TURNS') : phaseCopy.title;
  const signal = phase === 'preparing' ? 'PROOF IN PROGRESS' : phase === 'revealing' ? 'SEED VERIFIED' : phase === 'revealed' ? 'ON-CHAIN RESULT' : phase === 'expired' ? 'REFUND WINDOW' : phase === 'offline' ? 'STANDBY' : 'PREPROD LIVE';

  return <div className={`night-stage night-stage--${phase}`}>
    <div className="night-stage__stars" aria-hidden="true">{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ left: `${(index * 47 + 17) % 100}%`, top: `${(index * 29 + 9) % 75}%`, animationDelay: `${(index % 9) * .3}s` }} />)}</div>
    <div className="night-stage__grid" aria-hidden="true" />
    <div className="night-stage__sun" aria-hidden="true" />
    <div className="night-stage__horizon" aria-hidden="true" />
    <div className="night-stage__lights" aria-hidden="true"><i /><i /><i /><i /><i /></div>

    <div className="night-stage__hud night-stage__hud--top">
      <span className="night-stage__hud-tag"><i /> {signal}</span>
      <span className="night-stage__round">{roundId != null ? `ROUND ${String(roundId).padStart(3, '0')}` : 'AWAITING ROUND'}</span>
    </div>

    <div className="night-stage__arena" aria-hidden="true">
      <div className="night-stage__ring night-stage__ring--outer" />
      <div className="night-stage__ring night-stage__ring--inner" />
      <div className="night-stage__choice night-stage__choice--left"><span>YOUR CALL</span><strong>{choice ? <SideGlyph side={choice} /> : '?'}</strong><small>{choice ?? 'UNSET'}</small></div>
      <div className={`night-stage__coin night-stage__coin--${outcome?.toLowerCase() ?? 'unknown'}`}>
        <div className="night-stage__coin-edge" />
        <div className="night-stage__coin-face night-stage__coin-face--moon"><MoonStar /><b>MOON</b></div>
        <div className="night-stage__coin-face night-stage__coin-face--shadow"><Star fill="currentColor" /><b>SHADOW</b></div>
      </div>
      <div className="night-stage__choice night-stage__choice--right"><span>THE NIGHT</span><strong>{revealed ? <SideGlyph side={outcome} /> : '?'}</strong><small>{revealed ? outcome : 'HIDDEN'}</small></div>
      <div className="night-stage__reveal-burst" />
    </div>

    <div className="night-stage__story" aria-live="polite">
      <span className="night-stage__chapter">{phaseCopy.chapter} <i /> {roundId != null ? `LIVE ROUND ${roundId}` : 'MIDNIGHT PREPROD'}</span>
      <h2>{title}</h2>
      <p>{statusDetail ?? phaseCopy.detail}</p>
    </div>

    <div className="night-stage__hud night-stage__hud--bottom">
      <span><Sparkles size={13} /> {phase === 'open' ? `${betCount ?? 0} / 20 ENTRIES` : phase === 'preparing' ? 'DO NOT CLOSE THIS TAB' : phase === 'sealed' ? 'ENTRY CONFIRMED' : phase === 'revealed' ? 'RESULT VERIFIED' : 'COMMIT–REVEAL ROUND'}</span>
      <span><ShieldCheck size={13} /> {phase === 'open' ? `CLOSES IN ${formatCountdown(secondsRemaining)}` : phase === 'sealed' || phase === 'closed' ? `REVEAL ${formatCountdown(secondsRemaining)}` : 'MIDNIGHT PREPROD'}</span>
    </div>
  </div>;
}
