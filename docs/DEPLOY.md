# Demo deployment runbook

This is a runbook for a **simulated-credit demo**, not a Preprod release. The UI is a static Vite build. The Night Duel room service must run as a long-lived Node process. Static hosting alone will show a page but cannot run multiplayer or receive feedback.

1. Provision an HTTPS host for the UI and a Node 24 host for `services/duel/server.mjs`. Put the API behind an HTTPS reverse proxy. Configure `HOST`, `PORT`, `DUEL_STATE_FILE`, and `FEEDBACK_FILE` using private, writable paths. Keep the state and feedback files out of the published static directory and back them up privately.
2. Prefer a same-origin `/api` reverse proxy. If the API has a separate origin, set `APP_ORIGIN` on the service to the exact UI origin and set `VITE_DUEL_API_URL` at UI build time to the API origin. Only that configured origin receives CORS access.
3. Run `npm ci`, `npm run build`, then publish `app/dist`. Start `npm run start -w @nightflip/duel-service` under a process supervisor. Restrict direct access to the Node port when a reverse proxy is used.
4. Verify in two independent browsers: create a room, join from the open-room board and invite link, reveal both moves, check winner/tie and balance, verify both hashes, refresh, and submit a clearly identified test feedback message. Remove the test feedback row before reporting beta feedback.
5. Keep the page's **DEMO MODE** and simulated-credit disclosures visible. Do not label the demo as a Midnight transaction. For a real Preprod launch, follow the gates in [submission evidence](SUBMISSION.md) and [network notes](NETWORK.md).

The service persists anonymous session bearer tokens and rooms in a JSON file. Treat that file as private application state; exposure lets someone impersonate a demo session. It is not a production wallet identity system.
