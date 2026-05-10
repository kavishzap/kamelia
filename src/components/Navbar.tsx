"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#packages", label: "Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/** Thin gold X — matches minimal full-screen menu reference */
function MenuCloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 5L27 27M27 5L5 27"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo_white.png"
            alt=""
            width={720}
            height={240}
            decoding="async"
            className="h-9 w-auto shrink-0 object-contain object-left sm:h-10"
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-[family-name:var(--font-display)] text-base font-semibold leading-none tracking-tight text-[#f5f0e8] sm:text-lg">
              Kamelia
            </span>
            <span className="font-[family-name:var(--font-display)] text-[0.625rem] uppercase leading-tight tracking-[0.28em] text-[#e8d9b4] sm:text-xs sm:tracking-[0.4em]">
              The Floral Designer
            </span>
          </span>
        </a>

        <nav className="hidden flex-1 justify-center gap-7 lg:flex xl:gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#9a948a] transition-colors hover:text-[#c9a962]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-[#c9a962] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-sm transition hover:bg-[#d4bc7a] sm:inline-flex"
          >
            Plan Your Event
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#141414] text-[#f5f0e8] lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <motion.span
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-current"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-5 bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-current"
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex min-h-[100dvh] min-w-full flex-col bg-black lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 sm:px-8">
              <a
                href="#home"
                className="flex min-w-0 max-w-[70%] items-center py-1"
                onClick={() => setOpen(false)}
              >
                <img
                  src="/logo_white.png"
                  alt="Kamelia — The Floral Designer"
                  width={720}
                  height={240}
                  decoding="async"
                  className="h-12 w-auto max-h-14 object-contain object-left sm:h-14"
                />
              </a>
              <button
                type="button"
                aria-label="Close menu"
                className="-mr-1 flex shrink-0 items-center justify-center p-2 text-[#c9a962] transition hover:text-[#d4bc7a]"
                onClick={() => setOpen(false)}
              >
                <MenuCloseIcon />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
              <nav className="flex w-full max-w-md flex-col items-center gap-8 sm:gap-10">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-center font-[family-name:var(--font-display)] text-[clamp(1.35rem,4.8vw,2rem)] font-medium leading-snug tracking-tight text-[#f5f0e8] transition hover:text-[#e8d9b4]"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <div className="mt-12 h-px w-14 shrink-0 bg-[#c9a962] sm:mt-14" aria-hidden />

              <p className="mt-8 max-w-xs text-center font-[family-name:var(--font-display)] text-[0.65rem] font-medium uppercase leading-relaxed tracking-[0.42em] text-[#c9a962] sm:text-xs sm:tracking-[0.48em]">
                The Floral Designer
              </p>

              <a
                href="#contact"
                className="mt-10 text-center font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8] underline decoration-[#c9a962]/70 decoration-1 underline-offset-[10px] transition hover:text-[#c9a962] hover:decoration-[#c9a962]"
                onClick={() => setOpen(false)}
              >
                Plan your event
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
