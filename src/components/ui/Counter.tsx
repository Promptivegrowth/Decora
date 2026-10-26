"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Número que cuenta en ascenso desde 0 al entrar en pantalla. */
export function Counter({
  value,
  suffix = "",
  className = "",
  delay = 0,
  duration = 2.2,
}: {
  value: number;
  suffix?: string;
  className?: string;
  /** Segundos de espera antes de empezar a contar */
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce, delay, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {n}
      {suffix}
    </span>
  );
}
