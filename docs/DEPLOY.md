# Demo deployment runbook

This is a runbook for a **simulated-credit demo**, not a Preprod release. The repository now builds one container that serves the Vite UI and Night Duel API from the same origin. The Node process must stay running; static hosting alone cannot run multiplayer or receive feedback.

## Single-origin container

```sh
docker build -t nightflip-demo .
docker run --rm -p 8787:8787 -v nightflip-data:/app/data nightflip-demo
```

Open `http://127.0.0.1:8787/` and check `http://127.0.0.1:8787/api/health`. The named volume keeps demo room state and feedback across container restarts. The image uses Node 24, builds the UI, and serves both `/` and `/api` from the same process. Do not publish the local HTTP port directly on the internet.

For a public demo, use a host that builds this Dockerfile, provides HTTPS, runs one persistent instance, and mounts a **private persistent volume at `/app/data`**. Expose container port `8787`; use `/api/health` as the health check. Store and back up the volume privately because it contains anonymous session bearer tokens and user-written feedback. Keep the UI's **DEMO MODE** disclosure visible.

The current public demo is [nightflip-arcade.onrender.com](https://nightflip-arcade.onrender.com). It runs the same single-origin Docker image on Render's free plan. The URL, UI, `/api/health`, and a two-browser room were checked on 23 September 2026. The plan spins down while idle and has an ephemeral filesystem, so it is suitable for review of the demo but not for retaining room state or collecting durable beta feedback. Attach a persistent disk on a paid service, or move state and feedback to a managed datastore, before a real beta.

## Separate UI and API hosts

1. Provision an HTTPS host for the UI and a Node 24 host for `services/duel/server.mjs`. Put the API behind an HTTPS reverse proxy. Configure `HOST`, `PORT`, `DUEL_STATE_FILE`, and `FEEDBACK_FILE` using private, writable paths. Keep the state and feedback files out of the published static directory and back them up privately. Leave `STATIC_DIR` unset for API-only hosting.
2. Prefer a same-origin `/api` reverse proxy. If the API has a separate origin, set `APP_ORIGIN` on the service to the exact UI origin and set `VITE_DUEL_API_URL` at UI build time to the API origin. Only that configured origin receives CORS access.
3. Run `npm ci`, `npm run build`, then publish `app/dist`. Start `npm run start -w @nightflip/duel-service` under a process supervisor. Restrict direct access to the Node port when a reverse proxy is used.
4. Verify in two independent browsers: create a room, join from the open-room board and invite link, reveal both moves, check winner/tie and balance, verify both hashes, refresh, and submit a clearly identified test feedback message. Remove the test feedback row before reporting beta feedback.
5. Keep the page's **DEMO MODE** and simulated-credit disclosures visible. Do not label the demo as a Midnight transaction. For a real Preprod launch, follow the gates in [submission evidence](SUBMISSION.md) and [network notes](NETWORK.md).

The service persists anonymous session bearer tokens and rooms in a JSON file. Treat that file as private application state; exposure lets someone impersonate a demo session. It is not a production wallet identity system.
