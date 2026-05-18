"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef } from "react";
import type { TikTokGalleryItem } from "@/data/tiktok-gallery";
import type { TikTokOEmbedResult } from "./tiktok-types";

type Props = {
  open: boolean;
  item: TikTokGalleryItem | null;
  meta: TikTokOEmbedResult | null;
  onClose: () => void;
};

/** TikTok Embed Player — description/music off by default; see developers.tiktok.com/doc/embed-player */
function playerSrc(videoId: string) {
  const q = new URLSearchParams({
    autoplay: "1",
    description: "0",
    music_info: "0",
    rel: "0",
  });
  return `https://www.tiktok.com/player/v1/${videoId}?${q.toString()}`;
}

export function TikTokGalleryModal({ open, item, meta, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onKeyDown]);

  const videoId = item?.videoId ?? meta?.videoId ?? null;
  const embedSrc = videoId ? playerSrc(videoId) : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(4.5rem+env(safe-area-inset-top)+0.5rem)] sm:p-4 sm:pt-[max(1.5rem,env(safe-area-inset-top))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[201] mx-auto flex w-full max-w-[min(420px,calc(100vw-2rem))] max-h-[calc(100dvh-5.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-2xl border border-[#c9a962]/35 bg-white shadow-[0_0_0_1px_rgba(201,169,98,0.08),0_24px_80px_rgba(0,0,0,0.22)] sm:max-h-[min(calc(100dvh-3rem),calc((min(420px,100vw-2rem))*16/9+2rem))]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <h2 id={titleId} className="sr-only">
              {item.title}
            </h2>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a962]/50 bg-white/90 text-[var(--color-cream)] shadow-lg backdrop-blur-sm transition hover:border-[#c9a962] hover:bg-[var(--color-surface-raised)] sm:right-3 sm:top-3 sm:h-10 sm:w-10"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="relative min-h-0 w-full flex-1 bg-[var(--color-surface)]">
              {embedSrc ? (
                <motion.div className="relative mx-auto aspect-[9/16] h-[min(calc(100dvh-5.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)),calc((min(420px,100vw-2rem))*16/9))] w-auto max-w-[min(420px,calc(100vw-2rem))] sm:h-[min(calc(100dvh-4rem),calc((min(420px,100vw-2rem))*16/9))]">
                  <iframe
                    title="TikTok video"
                    src={embedSrc}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="encrypted-media; autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </motion.div>
              ) : (
                <motion.div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                  <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-cream)]">
                    Preview unavailable
                  </p>
                  <p className="max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
                    This clip could not be loaded. Try again later or use the link under the gallery tile.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
