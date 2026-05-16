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
  /** Arc / fan gallery — tighter frame, larger corner radius */
  variant?: "default" | "fan";
  className?: string;
};

function FloralPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-br from-[#fffdf9] via-[#f5e6a8]/35 to-[#e8d48b]/50 p-5"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_20%_30%,rgba(201,169,98,0.9),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(232,212,139,0.7),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M24%204L28%2018L42%2014L32%2024L42%2034L28%2030L24%2044L20%2030L6%2034L16%2024L6%2014L20%2018Z%22%20fill%3D%22%23c9a962%22%20fill-opacity%3D%220.2%22%2F%3E%3C%2Fsvg%3E')]" />
      <p className="relative font-[family-name:var(--font-display)] text-lg font-semibold text-[#2a2520]/85">
        {label}
      </p>
    </div>
  );
}

export function TikTokVideoCard({ item, index, meta, onOpen, variant = "default", className }: Props) {
  const [thumbError, setThumbError] = useState(false);
  const showThumb = Boolean(meta?.thumbnailUrl) && !thumbError;
  const displayTitle = meta?.title ?? item.title;
  const isFan = variant === "fan";

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: 0.08 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={["group relative", className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        onClick={onOpen}
        className={[
          "relative w-full overflow-hidden border-2 border-[#e8d9b4]/90 bg-gradient-to-b from-[#fffdf9] to-[#f7f0e4] text-left shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] ring-1 ring-[#c9a962]/25 transition hover:border-[#c9a962] hover:shadow-[0_28px_70px_-20px_rgba(201,169,98,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          isFan ? "rounded-[1.75rem] sm:rounded-[2rem]" : "rounded-2xl",
        ].join(" ")}
      >
        <div
          className={[
            "relative aspect-[9/16] w-full",
            isFan
              ? "max-h-[min(58vh,520px)] sm:max-h-[min(56vh,560px)] md:max-h-[min(54vh,600px)] lg:max-h-[640px]"
              : "max-h-[min(72vh,560px)] sm:max-h-[520px]",
          ].join(" ")}
        >
          {showThumb ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote TikTok CDN host varies
            <img
              src={meta!.thumbnailUrl!}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              onError={() => setThumbError(true)}
            />
          ) : (
            <FloralPlaceholder label={item.title} />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a2520]/55 via-transparent to-[#fffdf9]/25" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className={[
                "flex items-center justify-center rounded-full bg-[#c9a962] text-[#0a0a0a] shadow-lg ring-4 ring-[#fffdf9]/90 transition group-hover:scale-110 group-hover:bg-[#d4bc7a]",
                isFan ? "h-14 w-14 sm:h-[3.75rem] sm:w-[3.75rem]" : "h-16 w-16",
              ].join(" ")}
            >
              <svg
                className={isFan ? "h-6 w-6 sm:h-7 sm:w-7" : "h-7 w-7"}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a1814]/90 to-transparent px-4 pb-4 pt-16">
            <p className="line-clamp-2 font-[family-name:var(--font-display)] text-base font-semibold text-[#fffdf9] drop-shadow-md">
              {displayTitle}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#e8d9b4]">{item.subtitle}</p>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
