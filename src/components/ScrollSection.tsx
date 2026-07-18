"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/** Section shell with scroll snap + fade-up enter (Home → About). */
export function ScrollSection({ children, className = "", id }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className={`snap-start ${className}`.trim()}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 36 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -6% 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
