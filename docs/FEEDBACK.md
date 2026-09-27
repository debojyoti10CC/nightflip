# Feedback loop

## Collection

The game has an in-app rating and message form with categories for strategy, multiplayer connection, clarity, visuals, fairness, wallet onboarding, and performance. The local service validates and appends feedback to ignored `data/feedback.jsonl`. If the service is unavailable, the browser stores a local fallback and clearly says so. Do not include wallet addresses or private details in free text. Review recurring themes, record decisions here, and link the commit that changed the game.

Run `npm run feedback:summary` to count responses and average ratings by mode and category without printing free-text messages. Review individual messages privately in the service data file before writing a public issue or decision-log entry.

## Decision log

| Date | Source | Feedback | Decision | Evidence |
| --- | --- | --- | --- | --- |
| 2026-09-23 | Project owner, conversation | The simple coin flip felt too shallow; requested stronger logic and multiplayer. | Keep Solo Flip and add Night Duel: two-browser rooms, hidden Moon/Shadow/Star choices, clear counterplay, tie/forfeit/refund rules, and verifiable reveal hashes. | `app/src/Duel.tsx`, `services/duel/game.mjs`, `contract/src/nightduel.compact`; two-browser playthrough and tests. |

## Playtest review template

For each playtest, record the date, mode, issue or quote, severity, decision, related commit or document, and whether the player retested. Aggregate themes without publishing private feedback text or wallet details.
