# Midnight Preprod compatibility snapshot

Checked 23 September 2026 against the [official Midnight SDK compatibility matrix](https://github.com/midnightntwrk/midnight-sdk/blob/main/COMPATIBILITY.md). Recheck before deployment because version and network state can change.

| Component | Official stable version |
| --- | --- |
| Compact toolchain | 0.5.1 |
| Compact compiler | 0.30.0 |
| Compact language | 0.22.0 |
| compact-js | 2.5.0 |
| compact-runtime | 0.15.0 |
| Midnight.js packages | 4.0.4 |
| wallet-sdk-facade | 3.0.0 |
| dapp-connector-api | 4.0.1 |
| ledger-v8 | 8.0.3 |

Official examples have independently moved to newer compiler/language versions, so mix-and-match dependencies are unsafe. Checkpoint 2 will compile an official example and the NightFlip contract against one coherent version set before treating this snapshot as a working lock.

Preprod endpoints from the same matrix:

- Node RPC: `https://rpc.preprod.midnight.network`
- Indexer: `https://indexer.preprod.midnight.network`
- Proof server: `https://lace-proof-pub.preprod.midnight.network`
- Faucet: `https://faucet.preprod.midnight.network`
- Explorer: `https://explorer.preprod.midnight.network`

The [official Private Party example](https://github.com/midnightntwrk/example-private-party) provides native NIGHT deposit/payout and DUST sponsorship patterns. The [official Bulletin Board example](https://github.com/midnightntwrk/example-bboard) provides a React/Lace DApp structure. Their repository versions must be checked against this matrix before copying implementation details.

## Host check

This machine has Node 24.16.0, npm 11.13.0, Git 2.54.0, Docker 29.6.2 and WSL Ubuntu. Native Windows `compact.exe` is a filesystem command, not the Midnight compiler. Contract compilation should run in WSL or a compatible container.
