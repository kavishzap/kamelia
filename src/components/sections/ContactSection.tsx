"use client";

import { motion } from "framer-motion";
import { EventQuestionnaire } from "@/components/contact/EventQuestionnaire";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-[var(--color-surface)] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-center">
            <p
              className="text-[clamp(2rem,4.2vw,3.15rem)] leading-none text-black/80"
              style={{
                fontFamily:
                  "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
              }}
            >
              Begin your floral story
            </p>
            <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-cream)] sm:text-sm">
              Plan your event
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)]">
              Share your date, venue, and inspiration — our studio replies within two business days with next steps and
              availability. Complete the guided questionnaire below to build your decor brief.
            </p>
          </div>
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
