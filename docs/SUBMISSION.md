# Level 5 submission evidence

This document separates completed code from evidence that requires real Preprod activity or an external release. Do not fill a requirement with synthetic addresses, fake usage, or locally simulated credits.

| Requirement | Current evidence | Still required |
| --- | --- | --- |
| Level 4 MVP extended | Solo Flip UI and Compact protocol; added two-player Night Duel UI, room service, and Compact protocol | Funded Preprod end-to-end demonstration |
| Public GitHub repository | Local Git history | Publish repository URL |
| Live demo link | Local `http://127.0.0.1:5173/` only | Host UI and API over HTTPS; record public URL |
| 70 verifiable Preprod wallets | None collected | 70 genuine wallet addresses, consent, and per-address on-chain participation evidence |
| Feedback loop | [feedback process and first decision](FEEDBACK.md); in-app form and service | Real beta feedback, decisions, retests, and links to changes |
| Updated documentation | README, network, build, contract, duel, feedback, this checklist | Update after actual deployment and beta |
| Demo video | Local UI can be recorded | Record full MVP, multiplayer, wallet transaction, proof, refund and explorer evidence |
| Minimum 30 meaningful commits | See `git rev-list --count HEAD` | Continue scoped changes to reach 30 genuine feature, test, docs or fix commits |

## Cohort evidence format

Prepare a CSV with `wallet_address,network,first_participation_tx,contract_address,first_seen_utc,verification_url,consent_record`. Every row must have a distinct genuine Preprod wallet controlled by a participant and a transaction that the reviewer can independently find. Store consent privately; publish only what participants approved. Registration alone is insufficient because the current contract does not cryptographically bind an address to its registrant. Never fabricate missing rows.

## Deployment gates

1. Resolve and review the Compact compiler soundness advisory recorded in `NETWORK.md`; recompile and retest with a safe official version.
2. Bind the Preprod wallet address to the participant and test native-token transaction in a real client.
3. Provision and verify the Preprod prover, indexer, funded operator wallet, faucet guidance, and DUST sponsorship.
4. Run real transaction tests for winning claim, losing claim rejection, timeout refund, duel tie, and duel forfeit; record explorer links.
5. Host the app and room service over HTTPS, configure origin restrictions, monitor service health, and protect the data directory.
6. Run beta with real participants, close feedback issues, and record a truthful demo video.
