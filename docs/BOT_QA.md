# Bot QA records

## Local logic tournament

Run the reproducible local tournament with:

```sh
npm run bot:qa
```

It creates 100 temporary local simulation sessions, pairs them into 50 Night Duel rounds, makes both sides commit and reveal, and verifies that every duel settles and that simulated-credit accounting reconciles. The committed record is [bot-qa-100.json](proofs/bot-qa-100.json).

## Live Render tournament

Run the hosted tournament with:

```sh
npm run render:bot-qa
```

It calls the public NightFlip Render API at `https://nightflip-arcade.onrender.com`: 100 automated sessions create or join 50 duels, commit hidden moves, reveal, and each read the final state from the running service. It first requires `/api/health` to report demo mode, retries transient HTTP failures, and stores no session bearer tokens in the report. The recorded successful run is [render-bot-qa-100.json](proofs/render-bot-qa-100.json).

## Evidence boundary

Both bot runs are automated demo QA.

- They have **zero wallet addresses**.
- They submit **zero Midnight Preprod transactions**.
- They do not connect to Lace, receive tNIGHT, or touch either Compact contract.
- They are not users and do not count toward participant, transaction, or submission metrics.

For public chain activity, use [the Preprod analytics scanner](PREPROD_ANALYTICS.md), which reads only actual indexer and RPC data.
