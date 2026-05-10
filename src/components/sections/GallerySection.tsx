"use client";

import { useEffect, useMemo, useState } from "react";
import { tiktokGalleryItems } from "@/data/tiktok-gallery";
import { TikTokGalleryModal } from "@/components/gallery/TikTokGalleryModal";
import { TikTokVideoCard } from "@/components/gallery/TikTokVideoCard";
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
    <section
      id="gallery"
      className="relative scroll-mt-24 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
          Portfolio
        </p>
        <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-[#f5f0e8] sm:text-4xl">
          Gallery
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#9a948a]">
          Short films from our installs — tap a card to watch in place, or open on TikTok.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
          {tiktokGalleryItems.map((item, i) => (
            <TikTokVideoCard
              key={item.id}
              item={item}
              index={i}
              meta={metaById[item.id]}
              onOpen={() => setActiveId(item.id)}
            />
          ))}
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
