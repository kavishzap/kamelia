"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function HeroScroll() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[var(--color-surface)]"
      aria-label="Hero"
    >
      <div className="relative min-h-[min(92vh,860px)] w-full">
        <video
          src="/herovideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Left-dark gradient for legible, left-aligned hero copy */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.38)_38%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0)_78%)]"
          aria-hidden
        />

        <div className="absolute inset-0 flex items-center justify-start px-2 py-16 pt-24 sm:px-4 sm:pt-28 lg:px-6">
          <div className="mx-auto w-full max-w-[1520px]">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="pointer-events-auto w-full max-w-xl px-1 text-left sm:max-w-2xl sm:px-2"
          >
            <p
              className="text-[clamp(3.25rem,7vw,5.25rem)] font-semibold leading-[0.92] tracking-tight text-white"
              style={{
                fontFamily:
                  "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
              }}
            >
              Kamelia
            </p>
            <p className="mt-4 font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.4em] text-white/90 sm:text-base">
              The Floral Designer
            </p>
            <h1 className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-[clamp(1.9rem,3.4vw,2.75rem)] font-semibold leading-snug text-white">
              Luxury Floral Styling for Unforgettable Events
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              Wedding stages, floral arches, mandaps, engagement decor, and premium event styling.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-start gap-3 sm:gap-4">
              <Link
                href="/#contact"
                className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-full bg-[#c9a962] px-8 py-3 text-sm font-semibold text-black shadow-[0_12px_34px_-16px_rgba(0,0,0,0.55)] transition hover:bg-[#d4bc7a]"
              >
                Plan Your Event
              </Link>
              <Link
                href="/#gallery"
                className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-full border border-white/70 bg-transparent px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-18px_rgba(0,0,0,0.55)] transition hover:border-white hover:bg-white/10"
              >
                View Gallery
              </Link>
            </div>
          </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
