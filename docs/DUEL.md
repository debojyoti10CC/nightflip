# Night Duel rules and trust model

Night Duel adds a real opponent and a strategic choice to the original NightFlip MVP. It is a simultaneous-choice game with three moves:

| Move | Beats |
| --- | --- |
| Moon | Star |
| Star | Shadow |
| Shadow | Moon |

Both players commit before either reveals. Equal moves tie. The fixed stake is 1.00 tNIGHT (simulated in the browser); a decisive winner gets 1.90 and the intended fee is 0.10. A tie refunds 1.00 to each player. A creator with no opponent is refunded after the join deadline. Once both join, each must reveal before the reveal deadline; one revealer wins by forfeit, and zero revealers are both refunded.

## Browser demo

The room service in `services/duel` connects two browsers through an invite code. A browser generates a 32-byte random salt and sends `SHA-256("nightflip-duel-v1:" + move + ":" + salt)` before reveal. The service never receives the move or salt during commitment. At reveal, it checks the hash. Both hashes and salts are displayed for independent browser verification after completion. Sessions and rooms are persisted to the local ignored data directory. Credits are simulated and can be reset by starting a new session; they have no token value.

This is a centralized service, so the server can see moves as they are revealed and controls demo settlement. Its proof shows that the revealed moves match the earlier hashes; it is not a zero-knowledge or on-chain proof. The API must run behind HTTPS with one configured allowed origin for a public demo.

## Compact contract

`contract/src/nightduel.compact` models room creation, joining, hidden commitments, reveal, direct payout, tie refund, and deadline settlement. It uses Midnight `persistentCommit`, which is **not byte-compatible** with the browser SHA-256 demo commitment. An on-chain client must generate and submit the Compact commitment and proof. The contract compiles with the local Compact 0.31.0 toolchain and passes simulator state-transition tests. It has not been deployed or independently audited.

The contract takes a payout address and a separate private player secret. It checks knowledge of that secret for reveal/refund, but it does not prove that the supplied address belongs to the connecting wallet. The Preprod client must bind wallet identity to address and transaction evidence before deployment or using participant addresses as proof of unique users. This remains a release gate.

## Known delivery boundaries

- The live browser duel is demo-only. No Preprod wallet, test tNIGHT, DUST sponsorship, or on-chain settlement is wired to it.
- The Compact simulator aggregates output amounts by token, so simulator tests verify state transitions and total value; payout destinations require an end-to-end Preprod transaction test.
- Browser room tokens are stored in session storage and service state is stored on the server. Protect the data directory and do not expose it through static hosting.
