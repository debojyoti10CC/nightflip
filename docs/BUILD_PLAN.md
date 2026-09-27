# Build plan

NightFlip is built in six checkpoints that move from the arcade interaction to the multiplayer room service and Midnight protocol.

## Product contract

- Preprod only; tNIGHT is a free test asset with no real-world value.
- Exactly 1 tNIGHT per bet; a winning claim pays exactly 1.90 tNIGHT.
- Moon/Shadow choice and random salt remain local and private. The public bet stores a commitment bound to player and round.
- The operator commits to a seed before accepting bets, closes the round, then reveals the seed. The public outcome is reproducible from the seed and round ID.
- A missed reveal deadline lets each player recover the 1 tNIGHT stake. Pause cannot block safe claim or refund paths.

## Checkpoints

| Step | Product result | Verification |
| --- | --- | --- |
| 1 | Repository foundation and network configuration | Files and host prerequisites checked |
| 2 | Compact protocol and state-transition suite | Simulator tests cover loss, double claim, timeout, pause, and bankroll |
| 3 | 1990s arcade UI, Solo Flip, and two-browser Night Duel | Local playthrough and production build |
| 4 | Lace Preprod connection and NightFlip contract lifecycle | Deployed contract record and browser client |
| 5 | Feedback service and gameplay QA | Room-service tests and bot tournaments |
| 6 | Public demo, CI, and product documentation | Build, automated checks, and hosted demo |

## Design direction

Bold late-1990s arcade interface: dark indigo night room, electric violet and acid-lime highlights, chunky display lettering, beveled control panels, scanline texture, pixel accents, and large readable state indicators. Motion supports the coin and result reveal while keeping mobile play accessible.

## Scope decisions

Solo Flip remains the fast original mode. Night Duel adds the head-to-head strategy loop. The game has no variable wagers, NFTs, real-money path, or mainnet configuration.
