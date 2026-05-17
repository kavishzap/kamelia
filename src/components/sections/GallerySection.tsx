"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { tiktokGalleryItems } from "@/data/tiktok-gallery";
import { SOCIAL_LINKS } from "@/data/social-links";
import { NorrisGalleryTile } from "@/components/gallery/NorrisGalleryTile";
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

export function GallerySection() {
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
  const activeMeta = activeId ? metaById[activeId] : null;

  return (
    <section id="gallery" className="relative scroll-mt-24 bg-[var(--color-surface)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <p
            className="text-[clamp(2rem,4.2vw,3.15rem)] leading-none text-black/80"
            style={{
              fontFamily:
                "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
            }}
          >
            Wonderful gift
          </p>
          <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-cream)] sm:text-sm">
            Gallery of work
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {tiktokGalleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9, y: 18 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.06 * Math.min(i, 10),
              }}
              className="min-w-0 will-change-transform"
            >
              <NorrisGalleryTile
                item={item}
                index={i}
                meta={metaById[item.id]}
                onOpen={() => setActiveId(item.id)}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16 lg:mt-20">
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-[clamp(2rem,4.2vw,3.15rem)] leading-none text-black/80"
            style={{
              fontFamily:
                "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
            }}
          >
            <span>Follow us on TikTok</span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black/80 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.45)]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <TikTokGalleryModal
        open={activeItem !== null}
        item={activeItem}
        meta={activeMeta}
        onClose={() => setActiveId(null)}
      />
    </section>
  );
}
