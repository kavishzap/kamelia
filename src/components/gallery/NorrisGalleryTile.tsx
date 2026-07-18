"use client";

import { useState } from "react";
import type { TikTokGalleryItem } from "@/data/tiktok-gallery";
import type { TikTokOEmbedResult } from "./tiktok-types";

type Props = {
  item: TikTokGalleryItem;
  meta: TikTokOEmbedResult | undefined;
  onOpen: () => void;
};

function ThumbPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface-raised)] p-4"
      aria-hidden
    >
      <p className="text-center font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
        {label}
      </p>
    </div>
  );
}

/** Vertical TikTok tile — 9:16 frame; modal plays full clip. */
export function NorrisGalleryTile({ item, meta, onOpen }: Props) {
  const [thumbError, setThumbError] = useState(false);
  const showThumb = Boolean(meta?.thumbnailUrl) && !thumbError;
  const label = item.piece ?? item.title;

  return (
    <article className="flex w-full flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden bg-[var(--color-surface-raised)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
        aria-label={`Play ${label}`}
      >
        <div className="relative aspect-[9/16] w-full bg-black">
          {showThumb ? (
            // eslint-disable-next-line @next/next/no-img-element -- TikTok CDN
            <img
              src={meta!.thumbnailUrl!}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.03]"
              onError={() => setThumbError(true)}
            />
          ) : (
            <ThumbPlaceholder label={label} />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/25"
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
              <svg className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </div>
        </div>
      </button>

      <div className="mt-3">
        {item.season ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            {item.season}
            {item.year ? ` · ${item.year}` : null}
          </p>
        ) : null}
        <p className="mt-1 font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-[var(--color-cream)] sm:text-[0.95rem]">
          {label}
        </p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
        >
          View on TikTok
        </a>
      </div>
    </article>
  );
}
