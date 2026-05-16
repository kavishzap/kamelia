"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-white via-[#fffdf9] to-[#f6f3ec] px-4 py-24 text-[var(--color-cream)] sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,169,98,0.12),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[var(--color-gold)]">
          Our story
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold sm:text-4xl">
          About Kamelia
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-black/75">
          Kamelia was born from a belief that flowers should feel architectural yet soulful — sculptural
          moments that frame your vows, guide your guests, and photograph like art. We partner closely
          with planners and families across cultures, honoring tradition while pushing texture, palette,
          and scale into something unmistakably yours.
        </p>
        <p className="mt-5 text-[var(--color-muted)]">
          Every installation is led in-house, with obsessive attention to stem quality, climate on your
          day, and the quiet luxury of details you will notice when you walk into the room.
        </p>
      </motion.div>
    </section>
  );
}
