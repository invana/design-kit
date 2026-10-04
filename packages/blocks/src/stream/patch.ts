/**
 * Where in a spec a patch lands, from its root: a name reads a field of an
 * object; on a list, a name is the item whose `key` (or `id`) it is, and a
 * number is an index. `["tasks", "plan", "subtasks"]` is the subtasks of the
 * task keyed `plan`. Empty, it is the spec itself.
 */
export type PatchPath = (string | number)[]

/**
 * How a block changes while it streams — the same four ways for every kind,
 * so a conversation, a board or a page streams any block alike. The API sends
 * these; {@link applyBlockPatch} returns a new spec and never mutates the old.
 *
 * A merge (`set`, `upsert`) is a JSON merge patch one level deep: a field sent
 * as `null` is removed — the *now* line dropped as a run ends — since JSON
 * cannot send `undefined`.
 */
export type BlockPatch =
  /** Merge `fields` into the object at `at` — the clock moving, a run settling. */
  | { op: "set"; at?: PatchPath; fields: Record<string, unknown> }
  /** Add `text` to the end of the string at `at` — a narrative's words. */
  | { op: "append"; at: PatchPath; text: string }
  /** Add `items` to the end of the list at `at` — a chart's points, a table's rows. */
  | { op: "push"; at: PatchPath; items: unknown[] }
  /**
   * Merge `item` into the list item at `at` with the same `key` (or `id`), or
   * add it at the end — a task starting, then settling.
   */
  | { op: "upsert"; at: PatchPath; item: Record<string, unknown> }

export type BlockPatchOp = BlockPatch["op"]

export class BlockPatchError extends Error {}

type Obj = Record<string, unknown>

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v)

/** `fields` merged over `target`; a field sent as `null` is removed. */
function merge(target: Obj, fields: Obj): Obj {
  const next = { ...target, ...fields }
  for (const [name, value] of Object.entries(fields)) if (value === null) delete next[name]
  return next
}

/** An item's identity on a list: its `key`, else its `id`. */
const identity = (item: unknown) => (isObj(item) ? (item.key ?? item.id) : undefined)

const where = (path: PatchPath, depth: number) => JSON.stringify(path.slice(0, depth))

/** The index `segment` names on `list` — by position, or by key. */
function indexOn(list: unknown[], segment: string | number, path: PatchPath, depth: number) {
  const at = typeof segment === "number" ? segment : list.findIndex((item) => identity(item) === segment)
  if (at < 0 || at >= list.length) throw new BlockPatchError(`No item ${JSON.stringify(segment)} at ${where(path, depth)}.`)
  return at
}

/**
 * `node` with the value at `path[depth..]` replaced by `fn(value)`, copying
 * only along the path. A missing field reads as `undefined`, so `fn` can
 * create it — a first `push` makes the list.
 */
function update(node: unknown, path: PatchPath, depth: number, fn: (value: unknown) => unknown): unknown {
  if (depth === path.length) return fn(node)
  const segment = path[depth]
  if (Array.isArray(node)) {
    const at = indexOn(node, segment, path, depth)
    const next = node.slice()
    next[at] = update(node[at], path, depth + 1, fn)
    return next
  }
  if (isObj(node) && typeof segment === "string") {
    return { ...node, [segment]: update(node[segment], path, depth + 1, fn) }
  }
  throw new BlockPatchError(`Nothing to read ${JSON.stringify(segment)} from at ${where(path, depth)}.`)
}

function patchValue(value: unknown, patch: BlockPatch): unknown {
  const at = JSON.stringify(patch.at ?? [])
  switch (patch.op) {
    case "set":
      if (!isObj(value)) throw new BlockPatchError(`"set": ${at} is not an object.`)
      return merge(value, patch.fields)
    case "append":
      if (value !== undefined && typeof value !== "string") throw new BlockPatchError(`"append": ${at} is not text.`)
      return (value ?? "") + patch.text
    case "push":
      if (value !== undefined && !Array.isArray(value)) throw new BlockPatchError(`"push": ${at} is not a list.`)
      return [...((value as unknown[]) ?? []), ...patch.items]
    case "upsert": {
      if (value !== undefined && !Array.isArray(value)) throw new BlockPatchError(`"upsert": ${at} is not a list.`)
      const id = identity(patch.item)
      if (id === undefined) throw new BlockPatchError(`"upsert": the item at ${at} has no key or id.`)
      const list = (value as unknown[]) ?? []
      const found = list.findIndex((item) => identity(item) === id)
      if (found < 0) return [...list, merge({}, patch.item)]
      return list.map((item, i) => (i === found ? merge(item as Obj, patch.item) : item))
    }
  }
}

/**
 * A block's spec after one patch. Any spec — a block's options, or a block
 * spec with its `kind`, which no patch can change.
 */
export function applyBlockPatch<S extends object>(spec: S, patch: BlockPatch): S {
  const next = update(spec, patch.at ?? [], 0, (value) => patchValue(value, patch)) as S
  return "kind" in spec ? ({ ...next, kind: (spec as Obj).kind } as S) : next
}

/** Apply patches in order — a recorded stream, replayed. */
export function applyBlockPatches<S extends object>(spec: S, patches: BlockPatch[]): S {
  return patches.reduce<S>(applyBlockPatch, spec)
}
