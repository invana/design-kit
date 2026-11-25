---
"@invana/blocks": patch
"@invana/assistant": patch
---

A proposal decided step by step: `ProposalOptions.steps`, each a row with its kind, what it changes, a note and its issues, with Accept and Reject while open (sent as `accept` and `reject` with the step's id) or its state (`accepted`, `rejected`, `stale`) once decided; `Accept all` (sent as `accept-all`) while more than one is open. Two new blocks: `markdown`, for an answer a model wrote in Markdown (lists, code, tables, links; raw HTML dropped), and `filters`, filters an answer found for a table elsewhere with Apply and Clear. The composer gains context chips, `composer.context`: their ids go with each prompt as `context`, and a chip's × sends the new `remove-context` event.
