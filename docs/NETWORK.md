# Midnight Preprod compatibility snapshot

Checked 23 September 2026 against the current [official Preprod compatibility matrix](https://docs.midnight.network/relnotes/support-matrix), [official endpoints](https://docs.midnight.network/relnotes/network), and the [Compact compiler advisory](https://github.com/LFDT-Minokawa/compact/security/advisories/GHSA-3p6x-5vpx-wwpj). Recheck before deployment because versions and network state can change.

| Component | Official Preprod tested version |
| --- | --- |
| Compact toolchain | 0.5.1 |
| Compact compiler | 0.31.1 |
| Compact language | 0.23 |
| compact-js | 2.5.1 |
| compact-runtime | 0.16.0 |
| Midnight.js packages | 4.1.1 |
| Wallet SDK | 1.2.0 |
| dapp-connector-api | 4.0.1 |
| Preprod node | 1.0.3 |
| Preprod indexer | 4.3.302 |
| Proof server | 8.1.0 |

The working **local development lock** remains compiler 0.31.0, language 0.23, compact-runtime 0.16.0, and Midnight.js network-id 4.1.1. Both NightFlip contracts compile and pass simulator tests. This proves local development behavior, not Preprod transaction compatibility or proof-system soundness.

**Deployment gate:** the advisory's affected-version metadata covers compiler versions through 0.31.1. The official Preprod matrix currently lists 0.31.1, while the newer 0.34.0 compiler targets a different ledger generation according to its [release notes](https://docs.midnight.network/relnotes/compact/toolchain-0.34.0). Do not deploy these contracts until the official toolchain support and advisory status are reconciled, a compatible fixed compiler is available, and generated verifier keys are reviewed. This is a network/toolchain issue; test funds alone cannot clear it.

Preprod endpoints from the same matrix:

- Node RPC: `https://rpc.preprod.midnight.network`
- Indexer GraphQL: `https://indexer.preprod.midnight.network/api/v4/graphql`
- Faucet UI: `https://midnight-tmnight-preprod.nethermind.dev/`
- Explorer: `https://preprod.midnightexplorer.com/`

Use the connected Lace wallet's reported prover URI for its supported proof service rather than hardcoding a URL here.

The [official Private Party example](https://github.com/midnightntwrk/example-private-party) provides native NIGHT deposit/payout and DUST sponsorship patterns. The [official Bulletin Board example](https://github.com/midnightntwrk/example-bboard) provides a React/Lace DApp structure. Their repository versions must be checked against this matrix before copying implementation details.

## Host check

This machine has Node 24.16.0, npm 11.13.0, Git 2.54.0, Docker 29.6.2 and WSL Ubuntu. Compact 0.5.1 and compiler 0.31.0 are installed in WSL Ubuntu. Native Windows `compact.exe` is a filesystem command, not the Midnight compiler. The repository's compile script selects WSL on Windows.
