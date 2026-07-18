import path from "node:path";
import fs from "node:fs/promises";
import { ScrollSection } from "@/components/ScrollSection";
import { PortfolioGridClient } from "@/components/sections/PortfolioGridClient";

type PortfolioImage = {
  src: string;
  alt: string;
  filename: string;
};

function isImageFile(name: string) {
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(name);
}

async function getPortfolioImages(): Promise<PortfolioImage[]> {
  const dir = path.join(process.cwd(), "public", "portfolio");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && isImageFile(e.name))
    .map((e) => ({
      filename: e.name,
      src: `/portfolio/${e.name}`,
      alt: "Portfolio image",
    }))
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

export async function PortfolioSection() {
  const images = await getPortfolioImages();

  return (
    <ScrollSection
      id="portfolio"
      className="relative scroll-mt-24 bg-transparent px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
            Gallery of work
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.1] text-[var(--color-cream)]">
            Some of our best work
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-[var(--color-muted)]">
            A selection of stages, installations, and floral moments from recent celebrations.
          </p>
        </div>

        <PortfolioGridClient images={images} />
      </div>
    </ScrollSection>
  );
}
