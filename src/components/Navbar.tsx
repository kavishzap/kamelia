"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SocialIcons } from "@/components/SocialIcons";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#packages", label: "Packages" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Plan your event" },
];

function BrandLockup() {
  return (
    <div className="flex min-w-0 flex-col leading-tight">
      <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-cream)] sm:text-lg">
        Kamelia
      </span>
      <span className="mt-0.5 font-[family-name:var(--font-display)] text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[var(--color-gold)]/85 sm:text-[0.6875rem] sm:tracking-[0.24em]">
        The Floral Designer
      </span>
    </div>
  );
}

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.08] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/#home"
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo_black.png"
            alt=""
            width={720}
            height={240}
            decoding="async"
            className="h-9 w-auto shrink-0 object-contain object-left sm:h-10"
          />
          <BrandLockup />
        </Link>

        <nav className="hidden flex-1 justify-center gap-7 lg:flex xl:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-[var(--color-surface-raised)] text-[var(--color-cream)] lg:hidden"
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
            className="fixed inset-0 z-[110] flex min-h-[100dvh] min-w-full flex-col bg-white lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 sm:px-8">
              <Link
                href="/#home"
                className="flex min-w-0 flex-1 items-center gap-3 py-1"
                onClick={() => setOpen(false)}
              >
                <img
                  src="/logo_black.png"
                  alt=""
                  width={720}
                  height={240}
                  decoding="async"
                  className="h-11 w-auto shrink-0 object-contain object-left sm:h-12"
                />
                <BrandLockup />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                className="-mr-1 flex shrink-0 items-center justify-center p-2 text-[var(--color-gold)] transition hover:text-[var(--color-gold-soft)]"
                onClick={() => setOpen(false)}
              >
                <MenuCloseIcon />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2">
              <nav className="flex w-full max-w-md flex-col items-center gap-8 sm:gap-10">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-center font-[family-name:var(--font-display)] text-[clamp(1.35rem,4.8vw,2rem)] font-medium leading-snug tracking-tight text-[var(--color-cream)] transition hover:text-[var(--color-gold)]"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-12 h-px w-14 shrink-0 bg-[var(--color-gold)] sm:mt-14" aria-hidden />

              <p className="mt-10 font-[family-name:var(--font-display)] text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--color-gold)]/90">
                Follow
              </p>
              <SocialIcons className="mt-3" onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
