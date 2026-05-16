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
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-4"
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
            className="relative z-[101] mx-auto w-full max-w-[min(300px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#c9a962]/35 bg-white shadow-[0_0_0_1px_rgba(201,169,98,0.08),0_24px_80px_rgba(0,0,0,0.22)] sm:max-h-[min(92dvh,820px)] sm:max-w-[420px]"
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

            <div className="relative w-full bg-[var(--color-surface)]">
              {embedSrc ? (
                <div className="relative mx-auto aspect-square w-full max-w-[min(520px,calc(100vw-2rem),calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-5.5rem))] sm:max-w-none">
                  <iframe
                    title="TikTok video"
                    src={embedSrc}
                    className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2"
                    allow="encrypted-media; autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                  <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-cream)]">
                    Preview unavailable
                  </p>
                  <p className="max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
                    Open this clip on TikTok from your device.
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center rounded-full border border-[#c9a962] bg-[#c9a962]/10 px-5 py-2.5 text-sm font-semibold text-[#c9a962] transition hover:bg-[#c9a962]/20"
                  >
                    View on TikTok
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
