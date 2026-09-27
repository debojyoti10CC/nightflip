# Local bot QA record

Run the reproducible automated tournament with:

```sh
npm run bot:qa
```

The command creates 100 temporary local simulation sessions, pairs them into 50 Night Duel rounds, makes both sides commit and reveal, and verifies that every duel settles and that simulated-credit accounting reconciles. The committed record is [bot-qa-100.json](proofs/bot-qa-100.json).

## Evidence boundary

This is code-level QA for the room game only.

- These bots have **zero wallet addresses**.
- They submit **zero Midnight Preprod transactions**.
- They do not connect to Lace, receive tNIGHT, or touch either Compact contract.
- They are not users and do not count toward participant, transaction, or submission metrics.

For public chain activity, use [the Preprod analytics scanner](PREPROD_ANALYTICS.md), which reads only actual indexer and RPC data.
