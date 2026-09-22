# Midnight Preprod compatibility snapshot

Checked 23 September 2026 against the [official Midnight SDK compatibility matrix](https://github.com/midnightntwrk/midnight-sdk/blob/main/COMPATIBILITY.md) and the current [official Bulletin Board](https://github.com/midnightntwrk/example-bboard) and [Private Party](https://github.com/midnightntwrk/example-private-party) examples. Recheck before deployment because version and network state can change.

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

The matrix above currently lags the source examples. The working **contract development lock** for NightFlip is Compact toolchain 0.5.1, compiler 0.31.0, language 0.23, compact-runtime 0.16.0, and Midnight.js network-id 4.1.1. The official Bulletin Board contract compiled with compiler 0.31.0 in WSL; NightFlip then compiled with the same compiler and passed simulator tests. This proves local compatibility, not Preprod transaction compatibility. The latter is a checkpoint 4 gate.

Preprod endpoints from the same matrix:

- Node RPC: `https://rpc.preprod.midnight.network`
- Indexer: `https://indexer.preprod.midnight.network`
- Proof server: `https://lace-proof-pub.preprod.midnight.network`
- Faucet: `https://faucet.preprod.midnight.network`
- Explorer: `https://explorer.preprod.midnight.network`

The [official Private Party example](https://github.com/midnightntwrk/example-private-party) provides native NIGHT deposit/payout and DUST sponsorship patterns. The [official Bulletin Board example](https://github.com/midnightntwrk/example-bboard) provides a React/Lace DApp structure. Their repository versions must be checked against this matrix before copying implementation details.

## Host check

This machine has Node 24.16.0, npm 11.13.0, Git 2.54.0, Docker 29.6.2 and WSL Ubuntu. Compact 0.5.1 and compiler 0.31.0 are installed in WSL Ubuntu. Native Windows `compact.exe` is a filesystem command, not the Midnight compiler. The repository's compile script selects WSL on Windows.
