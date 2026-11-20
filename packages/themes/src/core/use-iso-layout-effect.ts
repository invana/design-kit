import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server.
 *
 * The theme is written onto `<html>` in a layout effect so it lands before the
 * first paint — and before any child's passive effect reads the document.
 * On the server a layout effect only logs a warning, so fall back there.
 */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
