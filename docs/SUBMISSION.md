# Level 5 submission evidence

This document separates completed code from evidence that requires real Preprod activity or an external release. Do not fill a requirement with synthetic addresses, fake usage, or locally simulated credits.

| Requirement | Current evidence | Still required |
| --- | --- | --- |
| Level 4 MVP extended | Solo Flip UI and Compact protocol; added two-player Night Duel UI, room service, and Compact protocol | Funded Preprod end-to-end demonstration |
| Public GitHub repository | [debojyoti10CC/nightflip](https://github.com/debojyoti10CC/nightflip), public `main` branch | Keep release documentation current |
| Live demo link | Local `http://127.0.0.1:5173/` and tested single-origin Docker build | Host the container over HTTPS with a private persistent volume; record public URL |
| 70 verifiable Preprod wallets | None collected | 70 genuine wallet addresses, consent, and per-address on-chain participation evidence |
| Feedback loop | [feedback process and first decision](FEEDBACK.md); in-app form and service | Real beta feedback, decisions, retests, and links to changes |
| Updated documentation | README, network, build, contract, duel, feedback, this checklist | Update after actual deployment and beta |
| Demo video | [Browser demo recording](video/nightflip-browser-demo.mp4) shows two-player play, Solo Flip, and fairness | Add actual wallet transaction, refund and explorer evidence after Preprod integration |
| Minimum 30 meaningful commits | 30 scoped commits on `main` before this checklist update | Preserve a reviewable, meaningful history |

## Cohort evidence format

Prepare a CSV with `wallet_address,network,first_participation_tx,contract_address,first_seen_utc,verification_url,consent_record`. Every row must have a distinct genuine Preprod wallet controlled by a participant and a transaction that the reviewer can independently find. Store consent privately; publish only what participants approved. Registration alone is insufficient because the current contract does not cryptographically bind an address to its registrant. Never fabricate missing rows.

The owner also requested **150 Preprod transactions from different accounts**. Count only successful, independently queryable transactions from the accounts actually used; record the canonical transaction hash, address, contract, circuit, block, timestamp, and explorer link. One operator generating many wallets would produce distinct accounts but would **not** establish 70 distinct users. No NightFlip Preprod transactions have been produced yet. The browser demo's room IDs, hashes, and credit changes are not transactions.

## Deployment gates

1. Resolve the current mismatch between the Preprod tested compiler (0.31.1) and the compiler soundness advisory's affected-version metadata (through 0.31.1), recorded in `NETWORK.md`; recompile and retest with a safe compatible official version.
2. Bind the Preprod wallet address to the participant and test native-token transaction in a real client.
3. Provision and verify the Preprod prover, indexer, funded operator wallet, faucet guidance, and DUST sponsorship.
4. Run real transaction tests for winning claim, losing claim rejection, timeout refund, duel tie, and duel forfeit; record explorer links.
5. Host the app and room service over HTTPS, configure origin restrictions, monitor service health, and protect the data directory.
6. Run beta with real participants, close feedback issues, and record a truthful demo video.
