"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { EventQuestionnaire } from "@/components/contact/EventQuestionnaire";
import { ScrollSection } from "@/components/ScrollSection";
import { KAMELLIA_PHONE_DISPLAY, kamelliaTelHref } from "@/data/contact";
import { REVIEWS } from "@/data/reviews";

const PackagesFlipbook = dynamic(
  () =>
    import("@/components/contact/PackagesFlipbook").then((m) => m.PackagesFlipbook),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center bg-[#f3eee6] ring-1 ring-black/8">
        <p className="text-sm text-[var(--color-muted)]">Opening packages brochure…</p>
      </div>
    ),
  },
);

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

export function ContactSection() {
  return (
    <ScrollSection
      id="contact"
      className="relative scroll-mt-24 bg-[var(--color-surface)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
            Kind words
          </p>
          <ul className="mt-5 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {REVIEWS.map((review, index) => (
              <motion.li
                key={review.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="min-w-0"
              >
                <StarRow rating={review.rating} />
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  “{review.quote}”
                </p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-cream)]">
                  {review.name}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-black/45">
                  {review.role}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-xl text-center md:mx-0 md:max-w-2xl md:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
            Plan your event
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.1] text-[var(--color-cream)]">
            Begin your floral story
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-[var(--color-muted)]">
            Share your details and package preference, then send your request to our studio.
          </p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Call or WhatsApp us on{" "}
            <a
              href={kamelliaTelHref()}
              className="font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)]/45 underline-offset-2 hover:text-[#a88b4a]"
            >
              {KAMELLIA_PHONE_DISPLAY}
            </a>
            .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.04 }}
          className="mt-8 sm:mt-10"
        >
          <PackagesFlipbook />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-8 sm:mt-10"
        >
          <EventQuestionnaire variant="embedded" />
        </motion.div>
      </div>
    </ScrollSection>
  );
}
