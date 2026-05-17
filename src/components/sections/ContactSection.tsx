"use client";

import { motion } from "framer-motion";
import { EventQuestionnaire } from "@/components/contact/EventQuestionnaire";
import { KAMELIA_PHONE_DISPLAY, kameliaTelHref, kameliaWhatsAppHref } from "@/data/contact";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-[var(--color-surface)] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
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
          <p className="mt-4 max-w-xl text-[var(--color-muted)] md:max-w-2xl">
            Share your date, venue, and inspiration — our studio replies within two business days with next steps and
            availability. Complete the guided questionnaire below to build your decor brief.
          </p>
          <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)] md:max-w-2xl">
            Call or WhatsApp us on{" "}
            <a
              href={kameliaTelHref()}
              className="font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)]/45 underline-offset-2 hover:text-[#a88b4a]"
            >
              {KAMELIA_PHONE_DISPLAY}
            </a>
            .
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
