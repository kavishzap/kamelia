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

const seg = "border-white/[0.32] transition-colors duration-300 ease-out group-hover:border-[#c9a962]/90 group-focus-visible:border-[#c9a962]/90";
const hairline = "bg-white/[0.28] transition-colors duration-300 ease-out group-hover:bg-[#c9a962]/90 group-focus-visible:bg-[#c9a962]/90";

function ThumbPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-br from-[#1a1814] via-[#0f0f0f] to-[#050505] p-4"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,98,0.35),transparent_50%)]" />
      <p className="relative font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a962]/90">
        {label}
      </p>
    </div>
  );
}

function captionText(item: TikTokGalleryItem, meta: TikTokOEmbedResult | undefined) {
  if (item.description) return item.description;
  const t = meta?.title?.trim();
  if (t && t.length > 0) return t.length > 160 ? `${t.slice(0, 157)}…` : t;
  return item.subtitle;
}

/**
 * Partial boxed lines (corner brackets + broken edges + gutter stubs),
 * full gold frame on hover / focus-visible — Lando-style, Kamelia gold.
 * Thumbnail fills the 9:16 frame edge-to-edge (`object-cover`); 9:16 matches TikTok frames.
 */
export function NorrisGalleryTile({ item, index, meta, onOpen }: Props) {
  const [thumbError, setThumbError] = useState(false);
  const showThumb = Boolean(meta?.thumbnailUrl) && !thumbError;
  const caption = captionText(item, meta);

  const colMd = index % 4;
  const colSm = index % 2;
  const stubMdR = colMd < 3;
  const stubMdL = colMd > 0;
  const stubSmR = colSm === 0;
  const stubSmL = colSm === 1;

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
        className="group relative w-full overflow-visible text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-[9/16] w-full bg-black">
          {/* Hover / focus: full closed frame */}
          <div
            className="pointer-events-none absolute inset-0 z-30 rounded-[14px] border border-transparent opacity-0 transition-all duration-300 ease-out group-hover:border-[#c9a962] group-hover:opacity-100 group-hover:shadow-[0_0_28px_-6px_rgba(201,169,98,0.4)] group-focus-visible:border-[#c9a962] group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_28px_-6px_rgba(201,169,98,0.4)]"
            aria-hidden
          />

          {/* Default partial “circuit” frame */}
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-visible:opacity-0"
            aria-hidden
          >
            <div className={`absolute left-0 top-0 h-11 w-11 rounded-tl-[14px] border-l border-t ${seg}`} />
            <div className={`absolute right-0 top-0 h-11 w-11 rounded-tr-[14px] border-r border-t ${seg}`} />
            <div className={`absolute bottom-0 left-0 h-11 w-11 rounded-bl-[14px] border-b border-l ${seg}`} />
            <div className={`absolute bottom-0 right-0 h-11 w-11 rounded-br-[14px] border-b border-r ${seg}`} />

            <div className={`absolute left-12 top-0 h-px w-[28%] max-w-[7rem] ${hairline}`} />
            <div className={`absolute right-12 top-0 h-px w-[28%] max-w-[7rem] ${hairline}`} />
            <div className={`absolute bottom-0 left-12 h-px w-[28%] max-w-[7rem] ${hairline}`} />
            <div className={`absolute bottom-0 right-12 h-px w-[28%] max-w-[7rem] ${hairline}`} />

            <div className={`absolute left-0 top-[22%] h-[20%] w-px ${hairline}`} />
            <div className={`absolute left-0 bottom-[22%] h-[20%] w-px ${hairline}`} />
            <div className={`absolute right-0 top-[22%] h-[20%] w-px ${hairline}`} />
            <div className={`absolute right-0 bottom-[22%] h-[20%] w-px ${hairline}`} />

            {stubMdR ? (
              <div className={`absolute -right-2 top-[46%] z-[21] hidden h-px w-2 lg:block ${hairline}`} />
            ) : null}
            {stubMdL ? (
              <div className={`absolute -left-2 top-[46%] z-[21] hidden h-px w-2 lg:block ${hairline}`} />
            ) : null}
            {stubSmR ? (
              <div className={`absolute -right-1.5 top-[46%] z-[21] hidden h-px w-1.5 sm:block lg:hidden ${hairline}`} />
            ) : null}
            {stubSmL ? (
              <div className={`absolute -left-1.5 top-[46%] z-[21] hidden h-px w-1.5 sm:block lg:hidden ${hairline}`} />
            ) : null}
          </div>

          <div className="absolute inset-0 min-h-0 overflow-hidden rounded-[13px] bg-black">
            {showThumb ? (
              // eslint-disable-next-line @next/next/no-img-element -- TikTok CDN
              <img
                src={meta!.thumbnailUrl!}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out"
                onError={() => setThumbError(true)}
              />
            ) : (
              <ThumbPlaceholder label={item.title} />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a962]/35 bg-[#c9a962] text-black shadow-[0_10px_36px_-10px_rgba(201,169,98,0.55)] transition duration-300 group-hover:scale-110 group-hover:border-[#e8d9b4] sm:h-11 sm:w-11">
                <svg className="ml-0.5 h-4.5 w-4.5 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </button>

      <p className="mt-3 max-w-[22rem] text-pretty font-[family-name:var(--font-display)] text-[0.7rem] leading-relaxed tracking-wide text-white/48 sm:text-xs md:mt-3.5">
        {caption}
      </p>
    </motion.article>
  );
}
