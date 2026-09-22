# NightFlip / Night Duel

A bold, late-90s-inspired Midnight arcade. **Night Duel** is a two-player strategy game: Moon beats Star, Star beats Shadow, Shadow beats Moon. Each player locks a hidden move and a fixed stake, then both reveal. **Solo Flip** preserves the original Moon/Shadow coin-flip MVP.

The browser currently runs a clearly labeled **demo with simulated credits**. Night Duel rooms work between separate browsers through the included service. The wallet modal can connect a compatible Lace API on Preprod to check readiness; neither game mode currently submits a Midnight transaction. Two Compact contracts compile locally and have simulator tests; they are **not deployed**. Do not present demo rounds as on-chain activity.

## Run locally

Node.js 22.15+ and npm are required. Compact compilation additionally requires the official Linux toolchain (WSL Ubuntu on Windows).

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. To test Night Duel, create a room, copy its link, and open it in another browser or private window. Both players get 5 simulated credits. The dev command starts the UI on 5173 and room service on 8787. Room and session state is saved in ignored `data/duel-state.json`; feedback is saved in ignored `data/feedback.jsonl`.

```sh
npm run build
npm run test
npm run compile -w @nightflip/contract
```

## Game rules

Night Duel locks one simulated credit per player. The winner receives 1.90, the remaining 0.10 is the intended treasury fee, and a tie refunds both. If nobody joins in five minutes, the creator is refunded. Once a rival joins, both have three minutes to reveal. A player who reveals wins by forfeit if the other stays silent; if neither reveals, both are refunded. The browser service uses salted SHA-256 commitments and displays both proof values after a completed duel.

The `nightduel.compact` contract models the same move and payout rules with Midnight `persistentCommit` and native test-token transfers. The original `nightflip.compact` contract has a private Moon/Shadow bet, committed operator seed, 1.00 stake, 1.90 winning claim, and timeout refund. Their integration and deployment remain release gates. See [duel design](docs/DUEL.md), [contract notes](contract/README.md), and [network status](docs/NETWORK.md).

## Submission status

The code and local demo are reviewable. A Level 5 submission still needs a public GitHub repository, hosted demo and room service, funded Preprod deployment with wallet transactions, 70 genuine verifiable participant wallet addresses, beta feedback, a full demo video, and at least 30 meaningful commits. No participant or on-chain evidence has been invented. See [submission evidence](docs/SUBMISSION.md) and [feedback log](docs/FEEDBACK.md).

No real-value tokens, purchases, redemption, or prizes are supported. Never enter a wallet seed phrase into the app or commit one to the repository.
