import { useCallback, useEffect, useRef, useState } from 'react';

type Cue = 'lock' | 'reveal' | 'win' | 'loss';

const melody = [0, 7, 12, 7, 3, 7, 10, 7, 0, 7, 12, 15, 10, 7, 3, 7];
const bass = [55, 55, 65.41, 65.41, 49, 49, 73.42, 73.42];

function note(context: AudioContext, frequency: number, duration: number, volume: number, type: OscillatorType = 'square', delay = 0) {
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.015);
}

export function useNightAudio() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const getContext = useCallback(() => contextRef.current ?? (contextRef.current = new AudioContext()), []);
  const toggle = useCallback(async () => {
    const context = getContext();
    await context.resume();
    setEnabled((current) => !current);
  }, [getContext]);

  const cue = useCallback((name: Cue) => {
    if (!enabled) return;
    const context = getContext();
    if (name === 'lock') [440, 330, 220].forEach((pitch, index) => note(context, pitch, .14, .035, 'square', index * .08));
    if (name === 'reveal') [220, 329.63, 440, 659.25].forEach((pitch, index) => note(context, pitch, .27, .04, 'sawtooth', index * .12));
    if (name === 'win') [523.25, 659.25, 783.99, 1046.5].forEach((pitch, index) => note(context, pitch, .28, .05, 'square', index * .13));
    if (name === 'loss') [392, 329.63, 261.63].forEach((pitch, index) => note(context, pitch, .3, .03, 'triangle', index * .15));
  }, [enabled, getContext]);

  useEffect(() => {
    if (!enabled) return;
    const context = getContext();
    const tick = () => {
      const step = stepRef.current++ % 16;
      const frequency = 220 * Math.pow(2, melody[step] / 12);
      note(context, frequency, .12, .014, 'square');
      if (step % 2 === 0) note(context, bass[(step / 2) % bass.length], .3, .025, 'triangle');
      if (step % 4 === 2) note(context, 880, .025, .006, 'sawtooth');
    };
    tick();
    timerRef.current = window.setInterval(tick, 190);
    return () => { if (timerRef.current != null) window.clearInterval(timerRef.current); timerRef.current = null; };
  }, [enabled, getContext]);

  useEffect(() => () => { if (timerRef.current != null) window.clearInterval(timerRef.current); void contextRef.current?.close(); }, []);

  return { enabled, toggle, cue };
}
