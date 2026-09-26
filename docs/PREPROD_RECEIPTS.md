# NightFlip Preprod receipts

This is the public record for the operator-controlled Midnight Preprod release. It includes only completed on-chain actions. It does not claim player participation, player payouts, or a completed 70-user cohort.

## Contract

- **Network:** Midnight Preprod
- **NightFlip contract:** `7aaa30860b58da5d3c1db21b69be5a5a093af0c998b21fedbc4348eb70cd100b`
- **Public build configuration:** `VITE_NIGHTFLIP_CONTRACT_ADDRESS` in `app/.env.production`

## Completed operator actions

| Action | Midnight transaction hash | Block | Recorded result |
| --- | --- | ---: | --- |
| Deploy NightFlip | `3de781c8ed0e906f2c13d008535770704664d57acfd42738f99abf0adc2f9288` | 2723649 | Contract address above created |
| Fund bankroll | `94f576285bddeb0ab984364dd88168df2404bee9579d81b637408621f6c71e87` | 2723818 | 100 test tNIGHT supplied to the contract bankroll |
| Open round 1 | `a9ff5662b018ed8b14df65dea5a25e4e3638b2562dfbe30ab2a71f7d8b3de32b` | 2723966 | Committed round opened with a five-minute betting window |

## Verification boundary

The address and transaction hashes above were emitted by the Midnight operator CLI after indexer confirmation. The deployed contract state was read back from the Preprod indexer: round `0`, not paused, before the first round was opened. The public browser is configured with the contract address so a Lace Preprod wallet can perform its contract verification path.

No participant wallets, player bet receipts, winner claims, or timeout refunds are recorded here. Those events need real consenting players and independently verifiable transactions; they must never be synthesized for a submission.
