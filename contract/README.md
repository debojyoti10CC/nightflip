# NightFlip contracts

`src/nightflip.compact` is the Solo Flip on-chain core. Compiler 0.31.0 / language 0.23 generates nine transaction circuits and four pure helpers. `src/nightduel.compact` adds a separate two-player protocol with five transaction circuits and three pure helpers.

## Rules

- Stake: 1,000,000 STAR = 1 tNIGHT. Payout: 1,900,000 STAR = 1.90 tNIGHT, following the [official wallet DApp denomination](https://github.com/midnightntwrk/midnight-wallet-dapp).
- A round publishes a seed commitment before bets open. The reveal verifies that commitment and derives Moon/Shadow from the high bit of the first byte of `persistentHash(["nightflip:outcome:v1", roundId, seed])`. This is a domain-separated hash bit; it is equivalent in fairness to choosing the low bit, but differs from the PRD's illustrative `hash mod 2` notation. The client must use the generated `outcomeOf` helper to avoid a byte-order mismatch.
- A bet publishes a `persistentCommit` over side, player key and round ID with a fresh 32-byte salt. Plaintext side and salt are not in the ledger.
- Claims require the registered player secret, matching commitment, winning side and an ACTIVE bet. Refunds require the player secret, an unrevealed round and a passed reveal deadline. Each bet settles once.
- Bet intake requires sufficient contract balance for all outstanding maximum payouts. Reservations for losing bets remain until a later protocol enhancement; this is conservative and requires operator bankroll top-ups across rounds.
- At most 20 bets are accepted per round. The operator key cannot place bets. Pausing blocks new bets but leaves claims and refunds callable.

## Integration boundary

Local simulator tests prove Compact state transitions and expected unshielded transfer effects. They do not prove real wallet balancing, fee sponsorship or Preprod settlement. Those require funded test wallets and a deployed contract in checkpoint 4.

Compiler 0.31.x has a [reported range-constraint advisory](https://github.com/LFDT-Minokawa/compact/security/advisories/GHSA-3p6x-5vpx-wwpj) for a particular conditional and unconditional cast pattern. NightFlip does not intentionally use that pattern, but generated circuits and the toolchain must be reviewed again before any deployment. Simulator tests alone do not establish proof-system soundness.

`registerPlayer` binds a public address to a secret-derived key, but the Compact circuit alone cannot prove that the registrant controls the stated unshielded wallet address. The wallet/transaction layer and evidence exporter must verify the address-to-transaction relationship before a row counts toward the 70-user target. No user count is claimed at this stage.

Operator secrets and player secrets must remain outside public analytics and Git. Salts must be generated with a secure RNG and never reused.

## Night Duel

The duel contract uses Moon = 0, Shadow = 1, Star = 2. Moon beats Star, Star beats Shadow, and Shadow beats Moon. Both players deposit 1,000,000 STAR and commit hidden moves bound to their private keys and duel ID. A decisive settlement sends 1,900,000 STAR to the winner and 100,000 STAR to the treasury address set during deployment. A tie sends 1,000,000 STAR to each. The creator can refund an unmatched duel after the join deadline. After the reveal deadline, anyone may settle: one revealer wins by forfeit and zero revealers are both refunded. A completed duel cannot settle twice.

The browser demo uses SHA-256 commitments and simulated credits; it is separate from this Compact protocol. The on-chain client, deployment, wallet ownership binding, payout-destination proof, and full Preprod playthrough are outstanding. See [duel trust model](../docs/DUEL.md).
