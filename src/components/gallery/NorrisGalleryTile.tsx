"use client";

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
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#fffdf9] to-[#f6f3ec] p-6"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,98,0.35),transparent_50%)]" />
      <p className="relative text-center font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a962]/90">
        {label}
      </p>
    </div>
  );
}

function ariaTitle(item: TikTokGalleryItem, meta: TikTokOEmbedResult | undefined) {
  const t = meta?.title?.trim();
  if (t) return t;
  return item.title;
}

export function NorrisGalleryTile({ item, meta, onOpen }: Props) {
  const [thumbError, setThumbError] = useState(false);
  const showThumb = Boolean(meta?.thumbnailUrl) && !thumbError;

  return (
    <article className="block h-full w-full">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block h-full w-full overflow-hidden bg-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a962] focus-visible:outline-offset-[-2px]"
        aria-label={ariaTitle(item, meta)}
      >
        <div className="relative h-full w-full">
          {showThumb ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote TikTok CDN host varies
            <img
              src={meta!.thumbnailUrl!}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              onError={() => setThumbError(true)}
            />
          ) : (
            <ThumbPlaceholder label={item.title} />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10"
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-black/80 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/10 transition duration-300 group-hover:scale-110 group-hover:bg-white">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
