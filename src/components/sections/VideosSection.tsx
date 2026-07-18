"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { tiktokGalleryItems } from "@/data/tiktok-gallery";
import { ScrollSection } from "@/components/ScrollSection";
import { TikTokGalleryModal } from "@/components/gallery/TikTokGalleryModal";
import type { TikTokOEmbedResult } from "@/components/gallery/tiktok-types";

async function fetchOembed(url: string): Promise<TikTokOEmbedResult | null> {
  try {
    const res = await fetch(`/api/tiktok-oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    return (await res.json()) as TikTokOEmbedResult;
  } catch {
    return null;
  }
}

function Thumb({
  src,
  label,
  className = "",
}: {
  src?: string;
  label: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const show = Boolean(src) && !error;

  return (
    <div className={`relative overflow-hidden bg-[var(--color-surface-raised)] ${className}`}>
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element -- TikTok CDN
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <span className="text-center font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

function VideoTile({
  label,
  src,
  className,
  onOpen,
  index,
}: {
  label: string;
  src?: string;
  className?: string;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.04 * Math.min(index, 6),
      }}
      onClick={onOpen}
      className={`group relative block w-full overflow-hidden bg-[var(--color-surface-raised)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${className ?? ""}`}
      aria-label={`Play ${label}`}
    >
      <Thumb src={src} label={label} className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/20"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
          <svg className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </span>
      </div>
    </motion.button>
  );
}

export function VideosSection() {
  const [metaById, setMetaById] = useState<Record<string, TikTokOEmbedResult>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const uniqueUrls = [...new Set(tiktokGalleryItems.map((item) => item.url))];
      const metaByUrlEntries = await Promise.all(
        uniqueUrls.map(async (url) => {
          const m = await fetchOembed(url);
          return [url, m] as const;
        }),
      );
      if (cancelled) return;
      const metaByUrl: Record<string, TikTokOEmbedResult> = {};
      for (const [url, m] of metaByUrlEntries) {
        if (m) metaByUrl[url] = m;
      }
      const next: Record<string, TikTokOEmbedResult> = {};
      for (const item of tiktokGalleryItems) {
        const m = metaByUrl[item.url];
        if (m) next[item.id] = m;
      }
      setMetaById(next);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeItem = useMemo(
    () => tiktokGalleryItems.find((i) => i.id === activeId) ?? null,
    [activeId],
  );
  const activeMeta = activeId ? metaById[activeId] ?? null : null;

  if (tiktokGalleryItems.length === 0) return null;

  const featured = tiktokGalleryItems[0]!;
  const side = tiktokGalleryItems.slice(1, 3);
  const rest = tiktokGalleryItems.slice(side.length === 2 ? 3 : 1);

  return (
    <>
    <ScrollSection
      id="videos"
      className="relative scroll-mt-24 bg-transparent px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
            Videos
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.1] text-[var(--color-cream)]">
            See our work in motion
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-[var(--color-muted)]">
            Installs and celebrations, captured on TikTok.
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-10">
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-12 lg:gap-4">
            <VideoTile
              index={0}
              label={featured.piece ?? featured.title}
              src={metaById[featured.id]?.thumbnailUrl ?? undefined}
              onOpen={() => setActiveId(featured.id)}
              className={
                side.length === 2
                  ? "aspect-[4/5] sm:aspect-[5/4] lg:col-span-7 lg:aspect-auto lg:min-h-[560px]"
                  : "aspect-[4/5] sm:aspect-[5/4] lg:col-span-12 lg:min-h-[420px]"
              }
            />

            {side.length === 2 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-5 lg:grid-cols-1 lg:gap-4">
                {side.map((item, i) => (
                  <VideoTile
                    key={item.id}
                    index={i + 1}
                    label={item.piece ?? item.title}
                    src={metaById[item.id]?.thumbnailUrl ?? undefined}
                    onOpen={() => setActiveId(item.id)}
                    className="aspect-[4/5] lg:aspect-auto lg:min-h-[272px]"
                  />
                ))}
              </div>
            ) : null}
          </div>

          {rest.length > 0 ? (
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:mt-3 sm:gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-4">
              {rest.map((item, i) => (
                <VideoTile
                  key={item.id}
                  index={i + 3}
                  label={item.piece ?? item.title}
                  src={metaById[item.id]?.thumbnailUrl ?? undefined}
                  onOpen={() => setActiveId(item.id)}
                  className="aspect-[4/5]"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </ScrollSection>

      <TikTokGalleryModal
        open={activeItem !== null}
        item={activeItem}
        meta={activeMeta}
        onClose={() => setActiveId(null)}
      />
    </>
  );
}
