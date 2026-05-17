"use client";

import { motion } from "framer-motion";

type SplashScreenProps = {
  progress: number;
};

export function SplashScreen({ progress }: SplashScreenProps) {
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--color-surface)] px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading Kamelia"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-w-xs flex-col items-center text-center"
      >
        <img
          src="/logo_black.png"
          alt=""
          width={720}
          height={240}
          decoding="async"
          className="h-16 w-auto object-contain sm:h-20"
        />
        <p className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-black sm:text-3xl">
          Kamelia
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-[0.65rem] font-medium uppercase tracking-[0.32em] text-black sm:text-xs">
          The Floral Designer
        </p>
      </motion.div>

      <motion.div
        className="mt-12 w-full max-w-[220px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="h-[2px] overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full rounded-full bg-[var(--color-gold)] transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(8, pct)}%` }}
          />
        </div>
        <p className="mt-3 text-center text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[var(--color-muted)]">
          Preparing your experience
        </p>
      </motion.div>
    </motion.div>
  );
}
