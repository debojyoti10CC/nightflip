import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { fileURLToPath, URL } from 'node:url';

const browserWebSocket = fileURLToPath(new URL('./src/browser-websocket.ts', import.meta.url));
const browserAssert = fileURLToPath(new URL('../node_modules/assert/build/assert.js', import.meta.url));

export default defineConfig({
  plugins: [react(), wasm()],
  server: { port: 5173, proxy: { '/api': 'http://127.0.0.1:8787' } },
  build: { target: 'esnext', minify: false },
  optimizeDeps: {
    include: ['@midnight-ntwrk/compact-runtime'],
    exclude: ['@midnight-ntwrk/onchain-runtime-v3'],
  },
  resolve: {
    alias: [
      { find: 'assert', replacement: browserAssert },
      { find: /^isomorphic-ws$/, replacement: browserWebSocket },
      { find: /^isomorphic-ws\/browser\.js$/, replacement: browserWebSocket },
    ],
  },
});
