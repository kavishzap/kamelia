"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { runInitialLoad } from "@/lib/asset-preload";

const MIN_SPLASH_MS = 700;
const SESSION_KEY = "kamelia-splash-v2";

type LoadState = {
  isReady: boolean;
  progress: number;
  showSplash: boolean;
};

function completeSplash(
  loadId: number,
  activeLoadId: MutableRefObject<number>,
  setProgress: (n: number) => void,
  setIsReady: (v: boolean) => void,
  setShowSplash: (v: boolean) => void,
) {
  if (loadId !== activeLoadId.current) return;

  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }

  setProgress(1);
  setIsReady(true);

  window.setTimeout(() => {
    if (loadId === activeLoadId.current) {
      setShowSplash(false);
    }
  }, 400);
}

export function useInitialLoad(skipSplash = false): LoadState {
  const [progress, setProgress] = useState(skipSplash ? 1 : 0);
  const [isReady, setIsReady] = useState(skipSplash);
  const [showSplash, setShowSplash] = useState(!skipSplash);
  const activeLoadId = useRef(0);

  useEffect(() => {
    if (skipSplash) {
      setIsReady(true);
      setShowSplash(false);
      setProgress(1);
      return;
    }

    const loadId = ++activeLoadId.current;
    let cancelled = false;

    const run = async () => {
      const started = performance.now();

      try {
        await runInitialLoad((ratio) => {
          if (!cancelled && loadId === activeLoadId.current) {
            setProgress(ratio);
          }
        });
      } catch {
        /* proceed anyway */
      }

      const elapsed = performance.now() - started;
      const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
      if (remaining > 0) {
        await new Promise((r) => window.setTimeout(r, remaining));
      }

      if (cancelled || loadId !== activeLoadId.current) return;

      completeSplash(loadId, activeLoadId, setProgress, setIsReady, setShowSplash);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [skipSplash]);

  useEffect(() => {
    if (!showSplash) {
      document.body.style.overflow = "";
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSplash]);

  return { isReady, progress, showSplash };
}

export function shouldSkipSplash(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
