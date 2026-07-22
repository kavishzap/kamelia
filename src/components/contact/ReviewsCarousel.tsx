"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { REVIEWS, type Review } from "@/data/reviews";

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

function ReviewSlide({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col">
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = scroller.querySelectorAll<HTMLElement>("[data-review-slide]");
    const target = slides[index];
    if (!target) return;
    const left = target.offsetLeft - (scroller.clientWidth - target.clientWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  }, []);

  const go = useCallback(
    (delta: number) => {
      const next = (active + delta + REVIEWS.length) % REVIEWS.length;
      scrollToIndex(next);
      setActive(next);
    },
    [active, scrollToIndex],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const slides = scroller.querySelectorAll<HTMLElement>("[data-review-slide]");
      if (!slides.length) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const mid = slide.offsetLeft + slide.clientWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % REVIEWS.length;
        scrollToIndex(next);
        return next;
      });
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused, scrollToIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mb-10 sm:mb-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 4000);
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
          Kind words
        </p>
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
      </div>

      <div
        ref={scrollerRef}
        className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-0 sm:gap-5 sm:px-0 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Client reviews"
      >
        {REVIEWS.map((review, index) => (
          <div
            key={review.name}
            data-review-slide
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${REVIEWS.length}`}
            className="w-[min(85vw,22rem)] shrink-0 snap-center sm:w-[min(48%,24rem)] lg:w-[min(32%,26rem)]"
          >
            <div className="h-full border border-black/8 bg-[var(--color-surface-raised)] px-5 py-5 sm:px-6 sm:py-6">
              <ReviewSlide review={review} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Review slides">
        {REVIEWS.map((review, index) => (
          <button
            key={review.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={`Go to review ${index + 1}`}
            onClick={() => {
              scrollToIndex(index);
              setActive(index);
            }}
            className={[
              "h-1.5 transition-all",
              active === index
                ? "w-6 bg-[var(--color-gold)]"
                : "w-1.5 bg-black/20 hover:bg-black/35",
            ].join(" ")}
          />
        ))}
      </div>
    </motion.div>
  );
}
