"use client";

import { motion } from "framer-motion";
import { EventQuestionnaire } from "@/components/contact/EventQuestionnaire";
import { ScrollSection } from "@/components/ScrollSection";
import { KAMELLIA_PHONE_DISPLAY, kamelliaTelHref } from "@/data/contact";

export function ContactSection() {
  return (
    <ScrollSection
      id="contact"
      className="relative scroll-mt-24 bg-transparent px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
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
            Share your date, venue, and inspiration. Our studio replies within two business days with
            next steps and availability. Complete the guided questionnaire below to build your decor
            brief.
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
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-8 sm:mt-10"
        >
          <EventQuestionnaire variant="embedded" />
        </motion.div>
      </div>
    </ScrollSection>
  );
}
