import { Buffer } from 'buffer';

// Midnight's browser SDK transitively expects these browser-safe globals.
globalThis.Buffer = Buffer;
Object.assign(globalThis, { process: { env: { NODE_ENV: import.meta.env.MODE } } });
