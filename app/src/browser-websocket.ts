// The indexer provider imports a Node-compatible WebSocket package. In the arcade
// browser we deliberately bind it to the browser's native implementation.
export const WebSocket = globalThis.WebSocket;
export default WebSocket;
