# NightFlip

NightFlip is a Midnight Preprod coin-flip game prototype. Players choose Moon or Shadow privately and stake a fixed 1 tNIGHT test token. A revealed round seed determines the outcome; a valid winner can claim 1.90 tNIGHT, and a player can refund a stake if the operator misses the reveal deadline.

**Status:** checkpoint 1 of 6 complete. This repository is a scaffold, not yet a playable or deployed DApp. No real-value tokens, purchases, redemption, or prizes are supported.

## Build checkpoints

1. **Foundation and version gate** — extract requirements, verify official compatibility information, create the repository structure and project scripts.
2. **Contract and protocol** — implement registration, commitment, fixed stake, reveal, winner claim, timeout refund, authorization, and simulator tests.
3. **Playable game** — create the responsive 90s-inspired Night Room, animation, local state and full game flow.
4. **Preprod connection** — integrate Lace, prover, operator, wallet balances and transactions; deploy and test on Preprod when an operator wallet and test funds are available.
5. **Beta operations** — add DUST sponsorship, funding help, feedback, privacy-safe analytics and verified-user export.
6. **Release proof** — harden the build, run full QA, complete documentation and prepare the live demo and submission evidence.

The source PRD is `NightFlip_Midnight_Level5_PRD.docx` supplied separately. See [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md) for the scope and dependencies, and [docs/NETWORK.md](docs/NETWORK.md) for the current toolchain snapshot.

## Local prerequisites

- Node.js 22.15 or newer (24.16 detected on this machine)
- Docker for the proof server
- WSL/Linux for the Compact developer toolchain (the Windows `compact.exe` command is unrelated)
- Lace Midnight wallet configured for Preprod for end-to-end testing

No wallet seed or operator key should be committed to this repository.
