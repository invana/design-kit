import * as React from 'react';
import {
  createAccessStore,
  type AccessDeclared,
  type AccessStore,
  type AccessWindow,
  type LayerPalette,
} from '@invana/ui';

import feed from '../../../../fixtures/ui-extended/access-monitor.json';

/**
 * Story-only plumbing shared by the AccessBoard, AccessStream and AccessMonitor stories. The
 * windows themselves are data — one recorded cycle of a run in
 * `fixtures/ui-extended/access-monitor.json`, summed the way the server sums them — and this
 * file only folds them into a store. The palette is the caller's, so it stays in code.
 */
export const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  tasks: { swatch: 'bg-data-3' },
  third_party: { swatch: 'bg-data-8' },
  llm: { swatch: 'bg-data-7' },
  cache: { swatch: 'bg-data-5' },
};

export const FEED = feed;
export const DECLARED = feed.declared as AccessDeclared[];
export const WINDOWS = feed.windows as unknown as AccessWindow[];

/** A recorded window re-summed at `rate` touches a second — the same shape, more or less traffic. */
export function atRate(window: AccessWindow, rate: number): AccessWindow {
  if (rate === feed.rate) return window;
  const counts = window.counts
    .map((c) => ({ ...c, count: Math.round((c.count * rate) / feed.rate) }))
    .filter((c) => c.count > 0);
  return { ...window, counts };
}

/** A store fed the first `windows` windows — a frozen frame. */
export function primedStore(windows: number): AccessStore {
  const store = createAccessStore({ declared: DECLARED });
  for (const w of WINDOWS.slice(0, windows)) store.push(w);
  return store;
}

/** A store fed the recorded windows as a replay reaches them; a restart folds from empty. */
export function useReplayedStore(at: number, rate: number = feed.rate): AccessStore {
  const store = React.useMemo(() => createAccessStore({ declared: DECLARED }), []);
  const pushed = React.useRef(0);
  React.useEffect(() => {
    if (at < pushed.current) {
      store.reset();
      pushed.current = 0;
    }
    for (; pushed.current < at; pushed.current++) store.push(atRate(WINDOWS[pushed.current]!, rate));
  }, [store, at, rate]);
  return store;
}

/** What a store holds now, redrawn as windows land. */
export function useSnapshot(store: AccessStore) {
  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
