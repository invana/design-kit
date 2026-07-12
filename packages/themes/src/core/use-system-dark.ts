import { useSyncExternalStore } from 'react';

// The OS `prefers-color-scheme: dark` preference, exposed as an external store.
// Reading it via useSyncExternalStore lets consumers derive their dark flag
// during render — no effect, no synchronous setState, and SSR-safe.

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Whether the OS currently prefers a dark colour scheme. */
export function useSystemDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
