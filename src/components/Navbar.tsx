"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { SocialIcons } from "@/components/SocialIcons";
import { siteNavLinks } from "@/data/site-nav";

const sectionPadding = "px-4 sm:px-6 lg:px-8";
const contentMax = "mx-auto max-w-[1400px]";

const easeOut = [0.22, 1, 0.36, 1] as const;

const menuBackdrop = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const menuPanel = {
  closed: { opacity: 0, y: -12 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: easeOut, staggerChildren: 0.07, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: easeOut } },
};

const menuItem = {
  closed: { opacity: 0, y: 14 },
  open: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeOut } },
};

function BrandLockup() {
  return (
    <div className="flex min-w-0 flex-col justify-center leading-tight">
      <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-black sm:text-xl">
        Kamelia
      </span>
      <span className="mt-1 font-[family-name:var(--font-display)] text-[0.625rem] font-medium uppercase tracking-[0.28em] text-black sm:text-xs sm:tracking-[0.32em]">
        The Floral Designer
      </span>
    </div>
  );
}

function HamburgerIcon({ open, reduceMotion }: { open: boolean; reduceMotion: boolean | null }) {
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: easeOut };

  return (
    <div className="relative flex h-6 w-6 items-center justify-center" aria-hidden>
      <motion.span
        className="absolute h-[2px] w-6 rounded-full bg-black"
        initial={false}
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -7 }}
        transition={transition}
      />
      <motion.span
        className="absolute h-[2px] w-6 rounded-full bg-black"
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: easeOut }}
      />
      <motion.span
        className="absolute h-[2px] w-6 rounded-full bg-black"
        initial={false}
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 7 }}
        transition={transition}
      />
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-[120] border-b transition-[background-color,box-shadow,border-color] duration-300 lg:border-black/[0.08]",
          open
            ? "border-transparent bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]"
            : "border-black/[0.08] bg-white/85 backdrop-blur-md",
        ].join(" ")}
      >
        <div className={`${contentMax} ${sectionPadding}`}>
          <div className="flex items-center gap-4 py-3.5">
            <Link
              href="/#home"
              className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-3.5"
              onClick={closeMenu}
            >
              <img
                src="/logo_black.png"
                alt=""
                width={720}
                height={240}
                decoding="async"
                suppressHydrationWarning
                className="h-11 w-auto shrink-0 object-contain object-left sm:h-12"
              />
              <BrandLockup />
            </Link>

            <nav className="ml-auto hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main">
              {siteNavLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="relative z-[130] ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:border-black/20 hover:bg-[var(--color-surface-raised)] lg:hidden"
              onClick={toggleMenu}
            >
              <HamburgerIcon open={open} reduceMotion={reduceMotion} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[100] bg-black/25 lg:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuBackdrop}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: easeOut }}
              onClick={closeMenu}
            />

            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed inset-x-0 bottom-0 top-[4.35rem] z-[110] flex flex-col overflow-hidden bg-white lg:hidden"
              initial="closed"
              animate="open"
              exit="exit"
              variants={menuPanel}
            >
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
                <nav className="flex w-full max-w-md flex-col items-center gap-7 sm:gap-9" aria-label="Main">
                  {siteNavLinks.map((l) => (
                    <motion.div key={l.href} variants={menuItem}>
                      <Link
                        href={l.href}
                        className="block text-center font-[family-name:var(--font-display)] text-[clamp(1.35rem,4.8vw,2rem)] font-medium leading-snug tracking-tight text-black transition hover:text-[var(--color-gold)]"
                        onClick={closeMenu}
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div variants={menuItem} className="mt-12 h-px w-14 shrink-0 bg-[var(--color-gold)] sm:mt-14" aria-hidden />

                <motion.p
                  variants={menuItem}
                  className="mt-10 font-[family-name:var(--font-display)] text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--color-gold)]"
                >
                  Follow
                </motion.p>
                <motion.div variants={menuItem}>
                  <SocialIcons
                    className="mt-3"
                    onNavigate={closeMenu}
                    platforms={["instagram", "tiktok"]}
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
