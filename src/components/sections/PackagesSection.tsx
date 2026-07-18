"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FillImage } from "@/components/FillImage";
import { ScrollSection } from "@/components/ScrollSection";
import { EVENT_TYPES } from "@/data/event-questionnaire";

type EventType = (typeof EVENT_TYPES)[number];

const arrangementTiles: {
  title: string;
  src: string;
  alt: string;
  eventType: EventType;
}[] = [
  {
    title: "Weddings",
    src: "/upscale_focus_on_stage_202605162222.jpeg",
    alt: "Wedding floral styling",
    eventType: "Wedding",
  },
  {
    title: "Engagements",
    src: "/main.jpeg",
    alt: "Engagement floral styling",
    eventType: "Engagement",
  },
  {
    title: "Events",
    src: "/floral.jpeg",
    alt: "Event floral styling",
    eventType: "Other",
  },
  {
    title: "Birthday",
    src: "/upscale_this_too_202605162220.jpeg",
    alt: "Birthday floral styling",
    eventType: "Birthday",
  },
  {
    title: "Beach occasions",
    src: "/WhatsApp Image 2026-05-16 at 22.10.22.jpeg",
    alt: "Beach occasion floral styling",
    eventType: "Other",
  },
];

function contactHref(eventType: EventType) {
  return `/?eventType=${encodeURIComponent(eventType)}#contact`;
}

export function PackagesSection() {
  return (
    <ScrollSection
      id="occasions"
      className="relative scroll-mt-24 bg-transparent px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
            Tell us your occasion
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.1] text-[var(--color-cream)]">
            We design, deliver, and install
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-[var(--color-muted)]">
            Choose an occasion to start your brief. Our studio handles design, delivery, and
            installation from first stem to final place.
          </p>
        </motion.div>

        {/* Mobile: featured wedding + 2x2. Desktop: five equal columns. */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 lg:grid-cols-5 lg:gap-5">
          {arrangementTiles.map((tile, i) => {
            const featuredMobile = i === 0;
            return (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.05 * i,
                }}
                className={featuredMobile ? "col-span-2 lg:col-span-1" : undefined}
              >
                <Link
                  href={contactHref(tile.eventType)}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface-raised)]">
                    <FillImage
                      src={tile.src}
                      alt={tile.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 92vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    {/* Title bar: mobile only */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 px-3 py-3 lg:hidden">
                      <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-white">
                        {tile.title}
                      </span>
                    </div>
                  </div>
                  {/* Caption: desktop only */}
                  <p className="mt-3 hidden font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tracking-wide text-[var(--color-cream)] lg:block">
                    {tile.title}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScrollSection>
  );
}
