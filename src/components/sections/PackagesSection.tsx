"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PackagesSection() {
  const arrangementTiles = [
    {
      title: "Weddings",
      src: "/upscale_focus_on_stage_202605162222.jpeg",
      alt: "Wedding floral styling",
      badge: "Weddings",
    },
    {
      title: "Engagements",
      src: "/main.jpeg",
      alt: "Engagement floral styling",
      badge: "Engagements",
    },
    {
      title: "Events",
      src: "/floral.jpeg",
      alt: "Event floral styling",
      badge: "Events",
    },
    {
      title: "Birthday",
      src: "/upscale_this_too_202605162220.jpeg",
      alt: "Birthday floral styling",
      badge: "Birthday",
    },
    {
      title: "Beach occasions",
      src: "/WhatsApp Image 2026-05-16 at 22.10.22.jpeg",
      alt: "Beach occasion floral styling",
      badge: "Beach occasions",
    },
  ] as const;

  return (
    <section
      id="packages"
      className="relative scroll-mt-24 bg-[var(--color-surface)] px-2 py-24 sm:px-4 lg:px-6"
    >
      <div className="mx-auto max-w-[1520px]">
        <div className="text-center">
          <p
            className="text-[clamp(2rem,4.2vw,3.15rem)] leading-none text-black/80"
            style={{
              fontFamily:
                "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
            }}
          >
            Tell Us Your Occasion
          </p>
          <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-cream)] sm:text-sm">
            We Design, Deliver, and Install
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {arrangementTiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, scale: 0.86, y: 28 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 * Math.min(i, 6),
              }}
              className="relative overflow-hidden bg-white shadow-sm ring-1 ring-black/5 will-change-transform"
              whileHover={{ scale: 1.02 }}
            >
              {tile.badge ? (
                <div className="absolute right-0 top-0 z-10 bg-black px-4 py-3 text-sm font-semibold text-white">
                  {tile.badge}
                </div>
              ) : null}
              <div className="relative aspect-[3/4] w-full">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 30vw, (min-width: 640px) 48vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
