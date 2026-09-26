# NightFlip Preprod receipts

## Retired deployment

The initial operator deployment is retained here for traceability only. Its first round was opened with JavaScript milliseconds even though Midnight's `blockTime*` circuits use Unix seconds. That makes the close deadline unreachable. It received no player activity and is not configured in the public build.

| Action | Midnight transaction hash | Block | Recorded result |
| --- | --- | ---: | --- |
| Deploy NightFlip | `3de781c8ed0e906f2c13d008535770704664d57acfd42738f99abf0adc2f9288` | 2723649 | Retired contract `7aaa30860b58da5d3c1db21b69be5a5a093af0c998b21fedbc4348eb70cd100b` |
| Fund bankroll | `94f576285bddeb0ab984364dd88168df2404bee9579d81b637408621f6c71e87` | 2723818 | 100 test tNIGHT supplied |
| Open round 1 | `a9ff5662b018ed8b14df65dea5a25e4e3638b2562dfbe30ab2a71f7d8b3de32b` | 2723966 | Retired because of the unit error |

## Replacement release

The operator now uses Unix seconds for `closeAt` and `revealBy`. A replacement contract is being deployed with a fresh bankroll and round. This record will be updated only after its receipts have been indexed.

No participant wallets, player bet receipts, winner claims, or timeout refunds are recorded here. Those events need real consenting players and independently verifiable transactions; they must never be synthesized for a submission.
