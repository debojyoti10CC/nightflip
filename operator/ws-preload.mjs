import { WebSocket } from 'ws';

// Polkadot's provider expects the ws implementation, not Node's built-in WebSocket.
globalThis.WebSocket = WebSocket;
