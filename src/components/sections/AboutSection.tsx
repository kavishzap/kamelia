"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 bg-[var(--color-surface)] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <p
              className="text-[clamp(2rem,4.2vw,3.15rem)] leading-none text-black/80"
              style={{
                fontFamily:
                  "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
              }}
            >
              Our Story
            </p>
            <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-cream)] sm:text-sm">
              About Kamelia
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-black/75">
              Kamelia was born from a belief that flowers should feel architectural yet soulful —
              sculptural moments that frame your vows, guide your guests, and photograph like art. We
              partner closely with planners and families across cultures, honoring tradition while
              pushing texture, palette, and scale into something unmistakably yours.
            </p>
            <p className="mt-5 text-[var(--color-muted)]">
              Every installation is led in-house, with obsessive attention to stem quality, climate on
              your day, and the quiet luxury of details you will notice when you walk into the room.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px] justify-self-center overflow-hidden bg-white shadow-sm ring-1 ring-black/5 md:justify-self-end"
          >
            <div className="relative aspect-[5/4] w-full">
              <Image
                src="/wedding.jpg"
                alt="Kamelia wedding floral design"
                fill
                loading="lazy"
                sizes="(min-width: 768px) 420px, 92vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
