---
"@invana/tables": minor
"@invana/blocks": minor
"@invana/assistant": patch
"@invana/ui": patch
---

A table keeps its cell padding everywhere except in an assistant's answer. The table block draws no box (its shell frames it) and is seamless only when `seamless` is passed. The assistant passes it, and a board panel or a page section does not. `DataTable` and `CastTable` take `bordered`: `bordered={false}` drops the box and keeps the padding, for a table inside a card or a panel. `seamless` still drops both.
