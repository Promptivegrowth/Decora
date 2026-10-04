"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type QuoteItem = { id: string; color?: string; qty: number };

type QuoteCtx = {
  items: QuoteItem[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string, color?: string) => void;
  update: (index: number, patch: Partial<QuoteItem>) => void;
  remove: (index: number) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const Ctx = createContext<QuoteCtx | null>(null);
const KEY = "dcora-quote-v1";

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratar desde localStorage tras montar
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((id: string, color?: string) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.id === id && it.color === color);
      if (i >= 0) return prev.map((it, j) => (j === i ? { ...it, qty: it.qty + 1 } : it));
      return [...prev, { id, color, qty: 1 }];
    });
  }, []);

  const value = useMemo<QuoteCtx>(
    () => ({
      items,
      count: items.reduce((n, it) => n + it.qty, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      update: (index, patch) =>
        setItems((prev) => prev.map((it, j) => (j === index ? { ...it, ...patch } : it))),
      remove: (index) => setItems((prev) => prev.filter((_, j) => j !== index)),
      clear: () => setItems([]),
      has: (id) => items.some((it) => it.id === id),
    }),
    [items, isOpen, add],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuote() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}
