"use client";

import { motion } from "framer-motion";
import { EventQuestionnaire } from "@/components/contact/EventQuestionnaire";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
            Begin your floral story
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#f5f0e8] sm:text-4xl">
            Plan your event
          </h2>
          <p className="mt-4 max-w-md text-[#9a948a] sm:max-w-xl">
            Share your date, venue, and inspiration — our studio replies within two business days with next steps and
            availability. Complete the guided questionnaire below to build your decor brief.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-14"
        >
          <EventQuestionnaire variant="embedded" />
        </motion.div>
      </div>
    </section>
  );
}
