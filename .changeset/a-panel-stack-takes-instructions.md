---
"@invana/ui": minor
---

`PanelStack` takes instructions, and says what happened.

A stack whose sections are routed needs a way in. When a URL names the drawer a reader just
drilled into, that drawer has to open — otherwise the detail renders into a section the reader
collapsed ten minutes ago and nothing appears to have happened.

`stackRef` is that way in: `expand(id)` · `collapse(id)` · `toggle(id)` · `isCollapsed(id)`.

```tsx
const stack = React.useRef<PanelStackHandle>(null)
React.useEffect(() => stack.current?.expand(openDrawer), [openDrawer])
<PanelStack stackRef={stack} onCollapsedChange={setCollapsed} sections={…} />
```

`onCollapsedChange` reports every open and close with the whole map — from a header click *and*
from a drag past `minSize`, which is the case a consumer cannot otherwise see.

**There is deliberately no `collapsed` prop.** The resizable group owns the geometry: a drag
collapses a section and releasing it opens one again. A controlled map would be a second owner of
that state, fighting every drag and re-asserting a stale value the moment the user let go. So the
stack stays the owner, reports what changed, and accepts instructions — the same split
`react-resizable-panels` itself makes.

`expand()` keeps the donor search it already had: the library's own `expand()` quietly does nothing
when the neighbouring panel is itself collapsed, so the room is taken from the tallest expanded
section instead. With every other section collapsed there is no donor, and the group keeps its
shape rather than stealing height from a header.
