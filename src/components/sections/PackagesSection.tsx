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

function ServiceRoseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 22.5v-8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M10.2 14.3c-1.8-.9-3-2.8-3-4.9 0-2.1 1.2-3.9 3-4.8.5-1.5 1.9-2.55 3.5-2.55h.6c1.6 0 3 1.05 3.5 2.55 1.8.9 3 2.7 3 4.8 0 2.1-1.2 4-3 4.9"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5v4.2M9.3 8.4l2.7 2.3M14.7 8.4l-2.7 2.3M10.5 11.2l3 1.1M13.5 11.2l-3 1.1"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M9 17.2c-.8-.4-1.4-1-1.8-1.7M15 17.2c.8-.4 1.4-1 1.8-1.7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PackagesSection() {
  return (
    <section
      id="packages"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,169,98,0.12),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
          <span className="inline underline decoration-[#c9a962] decoration-1 underline-offset-[0.65rem]">
            Curated offerings
          </span>
        </p>
        <h2 className="mt-5 text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-[#f5f0e8] sm:text-4xl">
          <span className="inline underline decoration-[#c9a962] decoration-2 underline-offset-[0.75rem] sm:underline-offset-[0.85rem]">
            Packages
          </span>
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
                <h3 className="w-fit border-b border-[#c9a962]/55 pb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#f5f0e8]">
                  {p.title}
                </h3>
                <p className="mt-3 leading-relaxed text-[#9a948a]">{p.desc}</p>
              </motion.article>
            ))}
          </div>

          <div id="services" className="scroll-mt-24 lg:max-w-xl lg:justify-self-end">
            <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
              <span className="inline underline decoration-[#c9a962] decoration-1 underline-offset-[0.65rem]">
                What we create
              </span>
            </p>
            <h3 className="mt-5 w-fit border-b border-[#c9a962]/55 pb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#f5f0e8] sm:text-3xl">
              Services
            </h3>
            <p className="mt-4 text-[#9a948a]">
              End-to-end floral production — from technical drawings and stem selection to strike and
              on-site finishing touches the morning of your event.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-3 lg:grid-cols-1 lg:gap-y-3 xl:grid-cols-2">
              {services.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.05 * i, duration: 0.45 }}
                  className="flex min-w-0 items-start gap-2 py-0.5 sm:items-center sm:gap-3 sm:py-1"
                >
                  <ServiceRoseIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a962] sm:mt-0 sm:h-7 sm:w-7" />
                  <span className="min-w-0 border-b border-[#c9a962]/40 pb-0.5 text-sm font-medium leading-snug text-[#f5f0e8] sm:text-base">
                    {s}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
