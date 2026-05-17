"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { TikTokGalleryItem } from "@/data/tiktok-gallery";
import type { TikTokOEmbedResult } from "./tiktok-types";

type Props = {
  item: TikTokGalleryItem;
  index: number;
  meta: TikTokOEmbedResult | undefined;
  onOpen: () => void;
};

function ThumbPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1814] via-[#0f0f0f] to-[#050505] p-4"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,98,0.35),transparent_50%)]" />
      <p className="relative text-center font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a962]/90">
        {label}
      </p>
    </div>
  );
}

function captionText(item: TikTokGalleryItem, meta: TikTokOEmbedResult | undefined) {
  if (item.description) return item.description;
  const t = meta?.title?.trim();
  if (t && t.length > 0) return t.length > 160 ? `${t.slice(0, 157)}?` : t;
  return item.subtitle;
}

/** Square grid tile ? matches portfolio section; modal stays 9:16 for full TikTok playback. */
export function NorrisGalleryTile({ item, index, meta, onOpen }: Props) {
  const [thumbError, setThumbError] = useState(false);
  const showThumb = Boolean(meta?.thumbnailUrl) && !thumbError;
  const caption = captionText(item, meta);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: 0.05 * (index % 6), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full flex-col"
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden bg-white text-left shadow-sm ring-1 ring-black/5 transition hover:ring-[#c9a962]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
      >
        <div className="relative aspect-square w-full bg-black">
          {showThumb ? (
            // eslint-disable-next-line @next/next/no-img-element -- TikTok CDN
            <img
              src={meta!.thumbnailUrl!}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.03]"
              onError={() => setThumbError(true)}
            />
          ) : (
            <ThumbPlaceholder label={item.title} />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15"
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black/80 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition duration-300 group-hover:scale-110 group-hover:bg-white sm:h-14 sm:w-14">
              <svg className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </div>
        </div>
      </button>

      <p className="mt-3 line-clamp-3 text-pretty font-[family-name:var(--font-display)] text-[0.7rem] leading-relaxed tracking-wide text-[var(--color-muted)] sm:text-xs md:mt-3.5">
        {caption}
      </p>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex w-fit text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#c9a962] underline decoration-[#c9a962]/45 underline-offset-[5px] transition hover:text-[#a88b4a] hover:decoration-[#c9a962] sm:text-[0.7rem]"
      >
        View on TikTok
      </a>
    </motion.article>
  );
}
