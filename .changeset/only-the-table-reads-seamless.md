---
"@invana/blocks": patch
---

Only the table block reads `seamless`; grid, scope, proposal and confirm stay seamless everywhere. The proposal block no longer passes `seamless` to `ProposalCard`, where it only governed evidence the block never sends. No visual change.
