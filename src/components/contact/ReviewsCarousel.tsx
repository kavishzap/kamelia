"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { REVIEWS, type Review } from "@/data/reviews";

const AUTO_MS = 2000;
/** Three copies so we can always slide forward and snap back invisibly */
const LOOP = [...REVIEWS, ...REVIEWS, ...REVIEWS];
const LEN = REVIEWS.length;
const START = LEN; // middle copy

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden
            className={filled ? "text-[var(--color-gold)]" : "text-black/15"}
          >
            <path
              fill="currentColor"
              d="M12 2.8l2.6 6.4 6.9.6-5.2 4.5 1.6 6.7L12 17.6 6.1 21l1.6-6.7L2.5 9.8l6.9-.6L12 2.8z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col border border-black/8 bg-[var(--color-surface-raised)] px-5 py-5 sm:px-6 sm:py-6">
      <StarRow rating={review.rating} />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)] sm:text-[0.9375rem]">
        “{review.quote}”
      </p>
      <p className="mt-5 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-cream)]">
        {review.name}
      </p>
      <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-black/45">{review.role}</p>
    </article>
  );
}

export function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(START);
  const [slideW, setSlideW] = useState(0);
  const [gap, setGap] = useState(16);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(START);
  indexRef.current = index;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector<HTMLElement>("[data-review-slide]");
    if (!first) return;
    const styles = window.getComputedStyle(track);
    const g = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    setGap(g);
    setSlideW(first.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /** Keep index in the middle copy so neighbors always exist (no blank) */
  const normalize = useCallback((i: number) => {
    if (i < LEN) return i + LEN;
    if (i >= LEN * 2) return i - LEN;
    return i;
  }, []);

  const jumpTo = useCallback(
    (i: number) => {
      setAnimate(false);
      setIndex(normalize(i));
    },
    [normalize],
  );

  // After a non-animated jump, re-enable animation on next frame
  useLayoutEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(id);
  }, [animate, index]);

  // When we land outside the middle band after an animated move, snap back
  useEffect(() => {
    if (!animate) return;
    if (index >= LEN && index < LEN * 2) return;
    const t = window.setTimeout(() => jumpTo(index), 420);
    return () => window.clearTimeout(t);
  }, [index, animate, jumpTo]);

  const goTo = useCallback((next: number, withAnimation = true) => {
    if (!withAnimation) {
      setAnimate(false);
      setIndex(next);
      return;
    }
    setAnimate(true);
    setIndex(next);
  }, []);

  const go = useCallback(
    (delta: number) => {
      goTo(indexRef.current + delta, true);
    },
    [goTo],
  );

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      goTo(indexRef.current + 1, true);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, goTo]);

  const offset = slideW > 0 ? index * (slideW + gap) : 0;
  const logical = ((index % LEN) + LEN) % LEN;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mb-10 sm:mb-12"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 2000);
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
          Kind words
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => go(-1)}
            className="inline-flex h-9 w-9 items-center justify-center border border-black/15 bg-white text-black transition hover:border-[var(--color-gold)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => go(1)}
            className="inline-flex h-9 w-9 items-center justify-center border border-black/15 bg-white text-black transition hover:border-[var(--color-gold)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative mt-5 overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Client reviews"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-[var(--color-surface)] to-transparent sm:w-8"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-[var(--color-surface)] to-transparent sm:w-8"
          aria-hidden
        />

        <motion.div
          ref={trackRef}
          className="flex gap-4 sm:gap-5"
          animate={{ x: -offset }}
          transition={
            animate
              ? { type: "spring", stiffness: 280, damping: 34 }
              : { duration: 0 }
          }
          drag="x"
          dragElastic={0.06}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            const step = slideW + gap || 1;
            const delta = Math.round((-info.offset.x - info.velocity.x * 0.12) / step);
            goTo(indexRef.current + (delta === 0 ? (info.offset.x < 0 ? 1 : info.offset.x > 0 ? -1 : 0) : delta), true);
            window.setTimeout(() => setPaused(false), 2000);
          }}
        >
          {LOOP.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              data-review-slide
              className="w-[min(82vw,20.5rem)] shrink-0 sm:w-[min(48%,22rem)] lg:w-[min(34%,24rem)]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {REVIEWS.map((review, i) => (
          <button
            key={review.name}
            type="button"
            aria-label={`Go to review ${i + 1}`}
            aria-current={i === logical}
            onClick={() => goTo(START + i, true)}
            className={[
              "h-1.5 transition-all",
              i === logical ? "w-6 bg-[var(--color-gold)]" : "w-1.5 bg-black/20 hover:bg-black/35",
            ].join(" ")}
          />
        ))}
      </div>
    </motion.div>
  );
}
