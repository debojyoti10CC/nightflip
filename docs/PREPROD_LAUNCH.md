# Preprod launch gate

NightFlip has a real Midnight Preprod wallet connection. The DApp reads the connected wallet's Preprod address, service configuration, and DUST status through DApp Connector API `4.0.1`; it rejects a non-Preprod wallet before play can start.

Run the public network check:

```powershell
npm run preprod:check
```

This verifies `system_chain` returns `Midnight Preprod` and the public Preprod indexer has a block height. It proves the shared network is reachable, not that the game contract has been deployed.

## Deployment handoff

Before turning on staking, the operator must complete these actions from a funded Lace Preprod wallet with a configured proof service:

1. Request free tNIGHT from the official Preprod faucet and generate tDUST in Lace.
2. Deploy the reviewed `contract/src/nightflip.compact` artifact using the matching Midnight 4.1.1 / Compact 0.31.1 Preprod toolchain.
3. Fund the contract treasury to cover the 1.90 tNIGHT payout for every open bet.
4. Set `VITE_NIGHTFLIP_CONTRACT_ADDRESS` in the hosted application's environment and redeploy it.
5. Open and reveal the first operator round, then make one real stake, claim, and refund test before onboarding other people.

The current public site deliberately labels the contract as undeployed and refuses to submit a stake until step 4 is complete. It must not represent simulated credits as a Preprod transaction.

The official Preprod RPC and indexer endpoints are documented in the [Midnight network reference](https://docs.midnight.network/guides/networks-and-environments). The required package versions are pinned in `docs/NETWORK.md`.
