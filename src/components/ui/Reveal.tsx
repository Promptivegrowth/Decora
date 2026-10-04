"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/** Aparición suave al entrar en pantalla. */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Revela su contenido como una cortina roller que se recoge hacia arriba:
 * una lámina de color cubre el elemento y se enrolla dejando ver la imagen.
 */
export function ShadeReveal({
  children,
  className = "",
  delay = 0,
  shade = "bg-teal",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  shade?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
      {!reduce && (
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${shade}`}
          initial={{ y: "0%" }}
          whileInView={{ y: "-101%" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay }}
        >
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gold" />
        </motion.div>
      )}
    </div>
  );
}
