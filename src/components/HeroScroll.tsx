"use client";

import Link from "next/link";
import { btnHeroOutlineClass, btnPrimaryClass } from "@/lib/button-classes";
import { motion, useReducedMotion } from "framer-motion";

export function HeroScroll() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black"
      aria-label="Hero"
    >
      <div className="relative h-[100dvh] w-full lg:h-auto lg:min-h-[min(92vh,860px)]">
        <video
          src="/herovideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          suppressHydrationWarning
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Left-dark gradient for legible, left-aligned hero copy */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.38)_38%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0)_78%)]"
          aria-hidden
        />

        <div className="absolute inset-0 flex items-center justify-start px-4 py-16 pt-[max(5.5rem,env(safe-area-inset-top)+4.25rem)] sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto w-full max-w-[1520px]">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="pointer-events-auto w-full max-w-xl px-1 text-left sm:max-w-2xl sm:px-2"
          >
            <p className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-tight text-white">
              Kamelia
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[0.625rem] font-medium uppercase tracking-[0.28em] text-white/95 sm:mt-4 sm:text-xs sm:tracking-[0.32em]">
              The Floral Designer
            </p>
            <h1 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.5vw,2rem)] font-semibold leading-snug text-white sm:mt-6">
              Luxury Floral Styling for Unforgettable Events
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              Wedding stages, floral arches, mandaps, engagement decor, and premium event styling.
            </p>

            <div className="mt-9 flex w-full max-w-[min(100%,280px)] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-4">
              <Link
                href="/#contact"
                className={`${btnPrimaryClass} w-full min-h-[48px] justify-center px-8 py-3 sm:w-auto sm:min-w-[180px]`}
              >
                Plan Your Event
              </Link>
              <Link
                href="/#gallery"
                className={`${btnHeroOutlineClass} w-full min-h-[48px] justify-center px-8 py-3 sm:w-auto sm:min-w-[180px]`}
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
