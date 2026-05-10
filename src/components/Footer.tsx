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
    <footer className="border-t border-white/[0.08] bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start lg:gap-8">
          <Link
            href="/#home"
            className="group flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5 lg:justify-start"
          >
            <img
              src="/logo_white.png"
              alt=""
              width={720}
              height={240}
              decoding="async"
              className="h-12 w-auto object-contain opacity-95 transition group-hover:opacity-100 sm:h-14"
            />
            <div className="text-center sm:text-left">
              <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#f5f0e8] sm:text-2xl">
                Kamelia
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.35em] text-[#c9a962]">
                The Floral Designer
              </p>
            </div>
          </Link>

          <nav
            aria-label="Shortcuts"
            className="flex flex-col items-center justify-center border-y border-white/[0.06] py-6 lg:border-y-0 lg:py-0"
          >
            <p className="mb-3 font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.28em] text-[#c9a962]/90">
              Shortcuts
            </p>
            <ul className="flex max-w-sm flex-wrap justify-center gap-x-5 gap-y-2 sm:max-w-none sm:gap-x-6">
              {footerShortcuts.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#9a948a] transition hover:text-[#c9a962]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-center gap-5 lg:items-end">
            <Link
              href="/#contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#c9a962]/40 bg-[#c9a962]/10 px-6 py-2.5 text-sm font-semibold text-[#c9a962] transition hover:border-[#c9a962] hover:bg-[#c9a962]/15 hover:text-[#d4bc7a]"
            >
              Plan Your Event
            </Link>
            <div className="flex flex-col items-center gap-2 lg:items-end">
              <p className="font-[family-name:var(--font-display)] text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#c9a962]/85">
                Follow
              </p>
              <SocialIcons />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/[0.08] pt-8 text-center text-sm text-[#9a948a] md:flex-row md:items-center md:justify-between md:text-left">
          <p className="max-w-md leading-relaxed">
            © {year} Kamelia — The Floral Designer. All rights reserved.
          </p>
          <p className="text-xs leading-relaxed text-[#6b665c] sm:text-sm">
            Designed by{" "}
            <span className="font-medium text-[#8a8478]">Mojhoa Automation Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
