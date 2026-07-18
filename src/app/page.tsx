import { SiteLoader } from "@/components/SiteLoader";
import { Navbar } from "@/components/Navbar";
import { HeroScroll } from "@/components/HeroScroll";
import { Footer } from "@/components/Footer";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { VideosSection } from "@/components/sections/VideosSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <SiteLoader>
      <main className="min-h-screen snap-y snap-proximity bg-transparent">
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
