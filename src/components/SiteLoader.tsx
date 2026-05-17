"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { shouldSkipSplash, useInitialLoad } from "@/hooks/useInitialLoad";

function subscribeSkipSplash() {
  return () => undefined;
}

function getSkipSplashSnapshot() {
  return shouldSkipSplash();
}

function getSkipSplashServerSnapshot() {
  return false;
}

type SiteLoaderProps = {
  children: React.ReactNode;
};

export function SiteLoader({ children }: SiteLoaderProps) {
  const skipSplash = useSyncExternalStore(
    subscribeSkipSplash,
    getSkipSplashSnapshot,
    getSkipSplashServerSnapshot,
  );
  const { isReady, progress, showSplash } = useInitialLoad(skipSplash);

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
