"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { btnHeroOutlineClass, btnPrimaryClass } from "@/lib/button-classes";

export function HeroScroll() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.8], [0.55, 0.85]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative snap-start overflow-hidden bg-black"
      aria-label="Hero"
    >
      <div className="relative h-[100dvh] w-full lg:h-auto lg:min-h-[min(92vh,860px)]">
        <motion.div
          className="absolute inset-0"
          style={reduceMotion ? undefined : { y: mediaY, scale: mediaScale }}
        >
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
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          style={reduceMotion ? { opacity: 0.45 } : { opacity: scrimOpacity }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.28)_40%,rgba(0,0,0,0.08)_65%,rgba(0,0,0,0)_80%)]"
          aria-hidden
        />

        <div className="absolute inset-0 flex items-center justify-start px-4 py-16 pt-[max(5.5rem,env(safe-area-inset-top)+4.25rem)] sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto w-full max-w-[1520px]">
            <motion.article
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={
                reduceMotion
                  ? undefined
                  : { y: contentY, opacity: contentOpacity }
              }
              className="pointer-events-auto w-full max-w-xl px-1 text-left sm:max-w-2xl sm:px-2"
            >
              <p className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-tight text-white">
                Kamellia
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
                  href="/#videos"
                  className={`${btnHeroOutlineClass} w-full min-h-[48px] justify-center px-8 py-3 sm:w-auto sm:min-w-[180px]`}
                >
                  View Videos
                </Link>
              </div>
            </motion.article>
          </div>
        </div>

        <motion.a
          href="/#occasions"
          style={reduceMotion ? undefined : { opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80 transition hover:text-white sm:bottom-8"
          aria-label="Scroll to occasions"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em]">
            Scroll
          </span>
          <motion.span
            aria-hidden
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-5 items-start justify-center rounded-full border border-white/40 pt-1.5"
          >
            <span className="h-1.5 w-1 rounded-full bg-white/90" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
