import Link from "next/link";
import { SocialIcons } from "@/components/SocialIcons";
import { KAMELIA_PHONE_DISPLAY, kameliaTelHref } from "@/data/contact";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0b0b0b] text-white">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center text-center">
          <div className="max-w-md space-y-5">
            <Link href="/#home" className="inline-flex flex-col items-center gap-4">
              <img
                src="/logo_white.png"
                alt=""
                width={720}
                height={240}
                decoding="async"
                suppressHydrationWarning
                className="h-14 w-auto shrink-0 object-contain sm:h-16"
              />
              <div className="leading-tight">
                <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white sm:text-2xl">
                  Kamelia
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-[0.625rem] font-medium uppercase tracking-[0.28em] text-white sm:text-xs sm:tracking-[0.32em]">
                  The Floral Designer
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white">
              Luxury floral styling for weddings, engagements, and unforgettable events across Mauritius.
            </p>
            <a
              href={kameliaTelHref()}
              className="inline-block text-sm font-semibold tracking-wide text-white transition hover:text-[var(--color-gold)]"
            >
              {KAMELIA_PHONE_DISPLAY}
            </a>
            <SocialIcons variant="white" platforms={["instagram", "tiktok"]} className="justify-center" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-2 text-center text-xs text-white sm:text-sm">
          <p>© {year} Kamelia — The Floral Designer. All rights reserved.</p>
          <p>
            Designed by <span className="font-medium text-white">Mojhoa Automations Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
