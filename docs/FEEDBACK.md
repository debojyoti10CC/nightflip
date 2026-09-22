# Feedback loop

## Collection

The game has an in-app rating and message form with categories for strategy, multiplayer connection, clarity, visuals, fairness, wallet onboarding, and performance. The local service validates and appends feedback to ignored `data/feedback.jsonl`. If the service is unavailable, the browser stores a local fallback and clearly says so. Do not include wallet addresses or private details in free text. The project owner should review feedback weekly, group repeated issues, record decisions here, and link the commit that changed the game.

## Decision log

| Date | Source | Feedback | Decision | Evidence |
| --- | --- | --- | --- | --- |
| 2026-09-23 | Project owner, conversation | The simple coin flip felt too shallow for a serious submission: “this is just spinning and getting na”; requested better logic and possible multiplayer. | Keep the original solo MVP and add Night Duel: real two-browser rooms, hidden Moon/Shadow/Star choices, clear counterplay, tie/forfeit/refund rules, and verifiable reveal hashes. | `app/src/Duel.tsx`, `services/duel/game.mjs`, `contract/src/nightduel.compact`; two-browser local playthrough and tests. |

## Beta review template

For each real test session, record date, mode, issue or quote, severity, decision, commit or document link, and whether the participant retested. Aggregate themes without publishing private feedback text or wallet details. A 70-user cohort must consist of genuine, separately verified Preprod activity; form submissions and demo sessions alone do not count.
