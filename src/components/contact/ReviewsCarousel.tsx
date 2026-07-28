"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Review } from "@/data/reviews";

const AUTO_MS = 2000;

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
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
    <article className="mx-auto flex w-full max-w-xl flex-col border border-black/8 bg-[var(--color-surface-raised)] px-5 py-6 text-center sm:px-8 sm:py-8">
      <StarRow rating={review.rating} />
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
        “{review.message}”
      </p>
      <p className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-cream)]">
        {review.name}
      </p>
    </article>
  );
}

function ReviewsTrack({ reviews }: { reviews: Review[] }) {
  const len = reviews.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number, dir: number) => {
      const n = ((next % len) + len) % len;
      setDirection(dir);
      setIndex(n);
    },
    [len],
  );

  const go = useCallback(
    (delta: number) => {
      goTo(index + delta, delta >= 0 ? 1 : -1);
    },
    [goTo, index],
  );

  useEffect(() => {
    if (paused || len < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => {
        setDirection(1);
        return (current + 1) % len;
      });
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, len]);

  const review = reviews[index];

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
        {len > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => go(-1)}
              className="inline-flex h-9 w-9 items-center justify-center border border-black/15 bg-white text-black transition hover:border-[var(--color-gold)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => go(1)}
              className="inline-flex h-9 w-9 items-center justify-center border border-black/15 bg-white text-black transition hover:border-[var(--color-gold)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="relative mt-5 overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Client reviews"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={review.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 36 : -36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -36 : 36 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={len > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => setPaused(true)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -56 || info.velocity.x < -400) go(1);
              else if (info.offset.x > 56 || info.velocity.x > 400) go(-1);
              window.setTimeout(() => setPaused(false), 2000);
            }}
            className="mx-auto w-full max-w-xl cursor-default touch-pan-y"
          >
            <ReviewCard review={review} />
          </motion.div>
        </AnimatePresence>
      </div>

      {len > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {reviews.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={[
                "h-1.5 transition-all",
                i === index ? "w-6 bg-[var(--color-gold)]" : "w-1.5 bg-black/20 hover:bg-black/35",
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviews");
        const payload = (await res.json().catch(() => null)) as { reviews?: Review[] } | null;
        if (cancelled) return;
        setReviews(Array.isArray(payload?.reviews) ? payload.reviews : []);
      } catch {
        if (!cancelled) setReviews([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!reviews || reviews.length === 0) return null;

  return <ReviewsTrack reviews={reviews} />;
}
