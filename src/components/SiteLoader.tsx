"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { useInitialLoad } from "@/hooks/useInitialLoad";

type SiteLoaderProps = {
  children: React.ReactNode;
};

export function SiteLoader({ children }: SiteLoaderProps) {
  const { isReady, progress, showSplash } = useInitialLoad();

  return (
    <>
      <AnimatePresence>{showSplash ? <SplashScreen key="splash" progress={progress} /> : null}</AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          opacity: isReady ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={showSplash ? "pointer-events-none" : undefined}
        aria-hidden={showSplash}
      >
        {children}
      </motion.div>
    </>
  );
}
