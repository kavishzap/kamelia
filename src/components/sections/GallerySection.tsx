"use client";

import { useEffect, useMemo, useState } from "react";
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

/** Vertical stagger — 1 col default, 2-col from `sm`, 4-col from `lg` */
function staggerClass(index: number) {
  const col4 = index % 4;
  const col2 = index % 2;
  const smPair = ["", "sm:mt-10"][col2];
  const lg = ["lg:mt-0", "lg:mt-[4.75rem]", "lg:mt-10", "lg:mt-[4.75rem]"][col4];
  return `${smPair} ${lg}`.trim();
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
      className="relative scroll-mt-24 border-t border-white/[0.06] bg-black px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.42em] text-[#c9a962]">
              Portfolio
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
              Gallery
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55 sm:text-right md:max-w-lg md:pb-1 md:text-base">
            Install films from our studio — tap a tile to watch in place. Same staggered grid energy as a pit-wall
            board, finished in Kamelia noir and gold.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-16 lg:mt-16 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-24">
          {tiktokGalleryItems.map((item, i) => (
            <div key={item.id} className={staggerClass(i)}>
              <NorrisGalleryTile
                item={item}
                index={i}
                meta={metaById[item.id]}
                onOpen={() => setActiveId(item.id)}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16 lg:mt-20">
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.22em] text-[#c9a962] underline decoration-[#c9a962]/55 decoration-1 underline-offset-[8px] transition hover:text-[#e8d9b4] hover:decoration-[#c9a962] sm:text-base"
          >
            View more
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
