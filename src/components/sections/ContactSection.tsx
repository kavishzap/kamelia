"use client";

import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
            Begin your floral story
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#f5f0e8] sm:text-4xl">
            Contact
          </h2>
          <p className="mt-4 max-w-md text-[#9a948a]">
            Share your date, venue, and inspiration — our studio replies within two business days with
            next steps and availability.
          </p>
          <a
            href="https://wa.me/15551234567?text=Hi%20Kamelia%2C%20I%27d%20love%20to%20discuss%20floral%20styling%20for%20my%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message on WhatsApp
          </a>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-2xl border border-white/[0.1] bg-[#121212] p-8 shadow-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-5">
            <label className="grid gap-1.5 text-sm font-medium text-[#f5f0e8]">
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                className="rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3 text-[#f5f0e8] outline-none ring-[#c9a962]/40 transition placeholder:text-[#6b655c] focus:ring-2"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#f5f0e8]">
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3 text-[#f5f0e8] outline-none ring-[#c9a962]/40 transition placeholder:text-[#6b655c] focus:ring-2"
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#f5f0e8]">
              Event date
              <input
                type="text"
                name="date"
                className="rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3 text-[#f5f0e8] outline-none ring-[#c9a962]/40 transition placeholder:text-[#6b655c] focus:ring-2"
                placeholder="Month / year or TBD"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#f5f0e8]">
              Tell us about your event
              <textarea
                name="message"
                rows={4}
                className="resize-none rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3 text-[#f5f0e8] outline-none ring-[#c9a962]/40 transition placeholder:text-[#6b655c] focus:ring-2"
                placeholder="Venue, guest count, cultural elements, Pinterest links…"
              />
            </label>
            <button
              type="button"
              className="mt-2 inline-flex justify-center rounded-full bg-[#c9a962] px-6 py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#d4bc7a]"
            >
              Send inquiry (demo)
            </button>
            <p className="text-center text-xs text-[#9a948a]">
              This form is display-only — connect it to your email or CRM when you are ready.
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
