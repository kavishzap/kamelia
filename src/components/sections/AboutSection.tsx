"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FillImage } from "@/components/FillImage";
import { ScrollSection } from "@/components/ScrollSection";
import { btnPrimaryClass } from "@/lib/button-classes";

const stats = [
  {
    value: "200+",
    label: "Clients celebrated with us",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "350+",
    label: "Floral decors installed",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 3c-2.5 3-4 5.5-4 8a4 4 0 1 0 8 0c0-2.5-1.5-5-4-8Z" />
        <path d="M12 11v10" />
        <path d="M8 17h8" />
      </svg>
    ),
  },
  {
    value: "120+",
    label: "Full event setups delivered",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M3 21h18" />
        <path d="M5 21V10l7-5 7 5v11" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
] as const;

export function AboutSection() {
  return (
    <ScrollSection
      id="about"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--color-surface)] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Height is driven by the left column; images fill that same height on desktop */}
        <div className="relative lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-xl text-left lg:max-w-none"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
              About Kamellia
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.2vw,2.85rem)] font-semibold leading-[1.12] text-[var(--color-cream)]">
              We craft a{" "}
              <span className="relative inline-block whitespace-nowrap px-1">
                <span className="relative z-10">full floral world</span>
                <span
                  className="absolute inset-x-0 bottom-[0.2em] -z-0 h-[0.45em] bg-[var(--color-gold)]/40"
                  aria-hidden
                />
              </span>{" "}
              for your day.
            </h2>
            <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
              Architectural yet soulful installations that frame your vows, guide your guests, and
              photograph like art. Led in-house from first stem to final place.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/#contact" className={`${btnPrimaryClass} min-h-[42px] px-6 py-2`}>
                Plan your event
              </Link>
              <Link
                href="/#portfolio"
                className="inline-flex min-h-[42px] items-center gap-2 text-sm font-semibold text-[var(--color-gold)] transition hover:text-[#a88b4a]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-gold)]/50">
                  <svg className="ml-0.5 h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                </span>
                View portfolio
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2.5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.05 }}
                  className="flex items-center gap-2.5 border border-black/5 bg-white px-3 py-2.5 shadow-[0_8px_22px_-12px_rgba(0,0,0,0.22)]"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)] text-white">
                    {stat.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-[family-name:var(--font-display)] text-lg font-semibold leading-none text-[var(--color-cream)]">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[0.65rem] leading-snug text-[var(--color-muted)]">
                      {stat.label}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid h-[min(420px,70vw)] grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[calc(50%-1.25rem)] xl:w-[calc(50%-1.5rem)]"
          >
            <div
              className="relative row-span-2 min-h-0 overflow-hidden bg-[var(--color-surface-raised)]"
              style={{
                borderTopLeftRadius: "3.5rem",
                clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
              }}
            >
              <FillImage
                src="/wedding.jpg"
                alt="Kamellia wedding floral design"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 28vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="relative min-h-0 overflow-hidden bg-[var(--color-surface-raised)]">
              <FillImage
                src="/floral.jpeg"
                alt="Kamellia floral installation"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>

            <div className="relative min-h-0 overflow-hidden bg-[var(--color-surface-raised)]">
              <FillImage
                src="/main.jpeg"
                alt="Kamellia event styling"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </ScrollSection>
  );
}
