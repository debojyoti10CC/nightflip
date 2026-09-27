# NightFlip Preprod receipts

## Retired deployment

The initial operator deployment is retained here for traceability only. Its first round was opened with JavaScript milliseconds even though Midnight's `blockTime*` circuits use Unix seconds. That makes the close deadline unreachable. It received no player activity and is not configured in the public build.

| Action | Midnight transaction hash | Block | Recorded result |
| --- | --- | ---: | --- |
| Deploy NightFlip | `3de781c8ed0e906f2c13d008535770704664d57acfd42738f99abf0adc2f9288` | 2723649 | Retired contract `7aaa30860b58da5d3c1db21b69be5a5a093af0c998b21fedbc4348eb70cd100b` |
| Fund bankroll | `94f576285bddeb0ab984364dd88168df2404bee9579d81b637408621f6c71e87` | 2723818 | 100 test tNIGHT supplied |
| Open round 1 | `a9ff5662b018ed8b14df65dea5a25e4e3638b2562dfbe30ab2a71f7d8b3de32b` | 2723966 | Retired because of the unit error |

## Retired replacement

The replacement operator uses Unix seconds for `closeAt` and `revealBy`, and its close transition was independently finalized. Its five-minute reveal window was too short for the local DUST restoration and proof-generation cycle. It received no player activity and is not configured in the public build.

| Action | Midnight transaction hash | Block | Recorded result |
| --- | --- | ---: | --- |
| Deploy replacement NightFlip | `8937438deaf51441bfcdccf435fad256191efd3e7314121a014c31cda989015f` | 2724438 | Retired contract `57f5b3b56e59dfa057956b95051aab06642a2eb5792c0d3f4fa77346ceec4d8c` |
| Fund bankroll | `a454830589cb43ee0bc2ed6aa66e1517247aef573296e58d9df6099a49147c2d` | 2724569 | 100 test tNIGHT supplied to the contract bankroll |
| Open round 1 | `b03697cb11cfd028a96e362cca688f4abdb20d591f11e17a067f6f3c3ac1fd7d` | 2724719 | Opened with Unix-second deadlines |
| Close round 1 | `ef0d2d7e1a3f50a952c5655979af9a8d073fa9cd53767b9b75a1f2fd758320fb` | 2724875 | Close transition finalized, proving the corrected deadline unit |

## Current release

The next deployment uses a one-hour reveal window after the five-minute betting phase, allowing the operator's real Preprod wallet to restore, prove, and submit the reveal. It will be configured in the public build only after its receipts are indexed.

No participant wallets, player bet receipts, winner claims, or timeout refunds are recorded here. Those events need real consenting players and independently verifiable transactions; they must never be synthesized for a submission.
