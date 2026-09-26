# Preprod launch gate

NightFlip has a real Midnight Preprod wallet connection. The DApp reads the connected wallet's Preprod address, service configuration, and DUST status through DApp Connector API `4.0.1`; it rejects a non-Preprod wallet before play can start.

Run the public network check:

```powershell
npm run preprod:check
```

This verifies `system_chain` returns `Midnight Preprod` and the public Preprod indexer has a block height. It proves the shared network is reachable, not that the game contract has been deployed.

## Operator runbook

The repository includes a Preprod operator CLI for deployment and timed rounds. It keeps the operator wallet seed, operator secret, round seeds, and local encrypted contract state under ignored `data/`; none of that material is committed.

Start the local proof server, compile with the vetted compiler, then create the operator wallet:

```powershell
docker run -d --name nightflip-proof-preprod -p 127.0.0.1:6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v
npm run compile -w @nightflip/contract -- nightflip
npm run operator -- init
npm run operator -- address
```

Fund the printed `mn_addr_preprod…` address at the official faucet, then register its tNIGHT for fee generation:

```powershell
npm run operator -- register-dust
npm run operator -- address
```

`dustSpeckBalance` must be greater than zero before a deployment can pay its fee. Registration is on-chain, but usable tDUST can take time to appear; retrying deployment while it is zero only fails with `InsufficientFunds`.

Once DUST is available, the complete controlled test is:

```powershell
npm run operator -- deploy
npm run operator -- fund 100
npm run operator -- open 5
npm run operator -- close 1
npm run operator -- reveal 1
npm run operator -- status
```

The CLI prints the Preprod transaction receipt for every successful action. Do not set `VITE_NIGHTFLIP_CONTRACT_ADDRESS` or present staking as live until deployment, bankroll funding, an open/reveal, a player bet, a winner claim, and an expired-round refund have each been confirmed on-chain.

The current public site deliberately labels the contract as undeployed and refuses to submit a stake until this sequence is proven. It must not represent simulated credits as a Preprod transaction.

The official Preprod RPC and indexer endpoints are documented in the [Midnight network reference](https://docs.midnight.network/guides/networks-and-environments). The required package versions are pinned in `docs/NETWORK.md`.
