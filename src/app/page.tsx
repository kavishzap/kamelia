import { SiteLoader } from "@/components/SiteLoader";
import { Navbar } from "@/components/Navbar";
import { HeroScroll } from "@/components/HeroScroll";
import { Footer } from "@/components/Footer";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <SiteLoader>
      <main className="min-h-screen bg-[var(--color-surface)]">
        <Navbar />
        <HeroScroll />
        <PackagesSection />
        <PortfolioSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </SiteLoader>
  );
}
