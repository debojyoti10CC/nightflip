# Build plan

This plan translates the supplied NightFlip PRD into six reviewable checkpoints. The user requested a pause after each checkpoint.

## Product contract

- Preprod only; tNIGHT is a free test asset with no real-world value.
- Exactly 1 tNIGHT per bet; winning claim pays exactly 1.90 tNIGHT.
- Moon/Shadow choice and random salt remain local/private. The public bet stores a commitment bound to player and round.
- The operator commits to a seed before accepting bets, closes the round, then reveals the seed. The public outcome is reproducible from the seed and round ID.
- A missed reveal deadline lets each player recover the 1 tNIGHT stake. Pause cannot block safe claim/refund paths.
- Public player registration and on-chain transaction evidence support the Level 5 cohort requirement.

## Checkpoint exits

| Step | Reviewable result | Verification |
| --- | --- | --- |
| 1 | Repo scaffold, requirements summary, compatibility snapshot | Files and host prerequisites checked |
| 2 | Compiled Compact contract and state-transition tests | Local simulator tests, including loss, double claim and timeout |
| 3 | Full 90s-style browser game, including a clearly labeled local demo mode | Browser playthrough at desktop and mobile widths |
| 4 | Real Preprod wallet and transaction path | Funded test wallet playthrough and explorer links |
| 5 | Operator/sponsor controls, feedback, metrics and evidence export | Abuse and privacy checks; real verified rows only |
| 6 | QA, CI, docs, live demo preparation | Build and end-to-end evidence review |

## Inputs needed later

Checkpoint 4 needs a Preprod Lace test wallet, free faucet tNIGHT for player and operator bankroll, and access to a proof server. The app will never request a seed phrase in chat or store one in the repository. Public hosting and the 70-person beta need user choices and real participants; neither can be fabricated by code.

## Design direction

Bold late-90s arcade interface: dark indigo night room, electric violet and acid-lime highlights, chunky display lettering, beveled control panels, scanline texture, pixel accents and large readable state indicators. Use motion deliberately for the coin and result reveal. Keep accessibility and mobile play intact.

## Scope decisions

Implement one game only. No variable wagers, casino lobby, NFTs, multiplayer, real-money path or mainnet configuration. Treat the PRD as a specification, not as instructions to bypass verification or invent adoption evidence.
