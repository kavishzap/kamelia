"use client";

import { motion } from "framer-motion";

const packages = [
  {
    title: "Wedding Stage Design",
    desc: "Statement backdrops, layered florals, and lighting-aware compositions for your ceremony and reception.",
  },
  {
    title: "Engagement Decor",
    desc: "Intimate arches, lounge vignettes, and photo-ready floral moments tailored to your story.",
  },
  {
    title: "Birthday & Private Events",
    desc: "Elevated tablescapes, ceiling treatments, and bespoke color stories for milestone celebrations.",
  },
  {
    title: "Corporate Floral Styling",
    desc: "Refined brand experiences — launches, galas, and hospitality florals with a polished editorial edge.",
  },
];

const services = [
  "Floral arches",
  "Mandap styling",
  "Table centerpieces",
  "Entrance decor",
  "Bridal floral styling",
  "Full event setup",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function PackagesSection() {
  return (
    <section
      id="packages"
      className="relative scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
          Curated offerings
        </p>
        <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-[#f5f0e8] sm:text-4xl">
          Packages
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#9a948a]">
          Select a foundation — each package is customized with seasonal blooms, palette direction, and
          on-site installation by our lead stylists.
        </p>

        <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14">
            {packages.map((p, i) => (
              <motion.article
                key={p.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="max-w-xl sm:max-w-none"
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#f5f0e8]">
                  {p.title}
                </h3>
                <p className="mt-3 leading-relaxed text-[#9a948a]">{p.desc}</p>
              </motion.article>
            ))}
          </div>

          <div id="services" className="scroll-mt-24 lg:max-w-xl lg:justify-self-end">
            <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
              What we create
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#f5f0e8] sm:text-3xl">
              Services
            </h3>
            <p className="mt-4 text-[#9a948a]">
              End-to-end floral production — from technical drawings and stem selection to strike and
              on-site finishing touches the morning of your event.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-1 xl:grid-cols-2">
              {services.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.05 * i, duration: 0.45 }}
                  className="flex items-center gap-3 py-1"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9a962]/15 text-sm text-[#c9a962]">
                    ✦
                  </span>
                  <span className="font-medium text-[#f5f0e8]">{s}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
