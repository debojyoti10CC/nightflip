# Preprod analytics scanner

Run the scanner with:

```sh
npm run preprod:analytics
```

The command is read-only. It checks `system_chain` at `https://rpc.preprod.midnight.network` and refuses to continue unless the result is `Midnight Preprod`. It then reads the project’s committed Preprod contract configuration and receipt record, confirms those contract addresses occur in the public Midnight Preprod indexer, and scans every block from the earliest recorded deployment through the indexer tip captured at the start of the run.

The output is calculated on each run:

- **Distinct observable wallet addresses** is the deduplicated set of `mn_addr_preprod…` owners emitted in public unshielded inputs or outputs of a transaction that calls one of NightFlip’s discovered contracts. Shielded identities and any field that does not expose an unshielded address are not counted.
- **Transactions scanned** is the number of distinct public transactions with a contract action for one of those contracts.
- **Blocks scanned** is the number of actual Preprod blocks queried in the verified deployment-to-tip range.
- **Contract addresses excluded** is the number of discovered NightFlip contract identifiers found in matching actions. Contract identifiers are kept outside the wallet-address set.

The scanner does not create addresses, submit transactions, fund wallets, change contract state, or cache results. Its counts can rise only when relevant public Preprod activity exists.

## Data sources

- Network and endpoint values: the same Midnight Preprod RPC and GraphQL indexer configured by the project’s `preprod:check` tool and operator.
- Contract candidates: `app/.env.production` plus contract-labelled addresses in `docs/PREPROD_RECEIPTS.md`.
- Verified activity: `block`, `transactions`, `contractActions`, and public unshielded output owners from the Midnight Preprod indexer.
