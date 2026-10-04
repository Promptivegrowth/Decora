"use client";

import { useSyncExternalStore } from "react";

/** Estado global "la web terminó de cargar" (lo marca el preloader). */
let ready = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSiteReady() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
}
