import { Navbar } from "@/components/Navbar";
import { HeroScroll } from "@/components/HeroScroll";
import { Footer } from "@/components/Footer";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <HeroScroll />
      <PackagesSection />
      <GallerySection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
