import Link from "next/link";
import { SocialIcons } from "@/components/SocialIcons";

const footerShortcuts = [
  { href: "/#home", label: "Home" },
  { href: "/#packages", label: "Packages" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0b0b0b] text-white">
      <div className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <div className="space-y-6">
              <Link href="/#home" className="inline-flex items-center gap-3">
                <img
                  src="/logo_white.png"
                  alt=""
                  width={720}
                  height={240}
                  decoding="async"
                  className="h-11 w-auto object-contain opacity-95"
                />
                <span className="sr-only">Kamelia</span>
              </Link>

              <div>
                <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                  Kamelia
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]/85">
                  The Floral Designer
                </p>
              </div>

              <p className="max-w-xs text-sm leading-relaxed text-white/60">
                Luxury floral styling for weddings, engagements, mandaps, and unforgettable events.
              </p>

              <SocialIcons variant="dark" className="justify-start" />
            </div>

            <div className="space-y-5">
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                Shortcuts
              </p>
              <ul className="space-y-2 text-sm">
                {footerShortcuts.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 transition hover:text-[var(--color-gold)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                Plan Your Event
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-white/60">
                Share your date, venue, and inspiration â€” our studio replies within two business days with next steps
                and availability.
              </p>
              <Link
                href="/#contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--color-gold)]/60 hover:text-[var(--color-gold)]"
              >
                Plan Your Event
              </Link>
            </div>

            <div className="space-y-5">
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                Follow
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-white/60">
                Follow our latest installs and behind-the-scenes on social.
              </p>
              <SocialIcons variant="dark" className="justify-start" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/30 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-sm text-white/60 md:flex-row md:justify-between md:text-left">
          <p className="leading-relaxed">Â© {year} Kamelia â€” The Floral Designer. All rights reserved.</p>
          <p className="text-xs leading-relaxed sm:text-sm">
            Designed by <span className="font-medium text-white/75">Mojhoa Automation Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

