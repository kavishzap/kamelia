import type { Metadata } from "next";
import { SiteLoader } from "@/components/SiteLoader";
import { Navbar } from "@/components/Navbar";
import { HeroScroll } from "@/components/HeroScroll";
import { Footer } from "@/components/Footer";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { VideosSection } from "@/components/sections/VideosSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <SiteLoader>
      <main className="min-h-screen snap-y snap-proximity bg-[var(--color-surface)]">
        <Navbar />
        <HeroScroll />
        <PackagesSection />
        <PortfolioSection />
        <VideosSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </SiteLoader>
  );
}
