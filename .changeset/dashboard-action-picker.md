---
"@invana/dashboard": patch
---

An action can be a **picker**. `picker: true` draws an action's `options` as a dropdown instead of
a segmented switch — for a choice among named records, too many or too long to lay side by side — and
dispatches `{ option }` exactly as the switch does. `optionLabels` names each option for the reader,
so a picker can show an agent's name and send its id; a segmented switch reads it too. Story: *D12
Action · a picker beside a switch*.
