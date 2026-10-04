"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <ul className="divide-y divide-navy/10 border-y border-navy/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.q}>
            <h3 className="text-base sm:text-lg">
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-display font-bold transition-colors hover:text-teal"
              >
                {it.q}
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                    isOpen ? "rotate-45 bg-teal text-gold" : "bg-teal/10 text-teal"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 leading-relaxed text-navy/70">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
