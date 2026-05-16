import path from "node:path";
import fs from "node:fs/promises";
import { SocialIcons } from "@/components/SocialIcons";
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
    <section
      id="portfolio"
      className="relative scroll-mt-24 bg-[var(--color-surface)] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <p
            className="text-[clamp(2rem,4.2vw,3.15rem)] leading-none text-black/80"
            style={{
              fontFamily:
                "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
            }}
          >
            Some of our best work
          </p>
          <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-cream)] sm:text-sm">
            Gallery of work
          </h2>
        </div>

        <PortfolioGridClient images={images} />

        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p
            className="text-[clamp(1.4rem,3vw,2.15rem)] leading-none text-black/85"
            style={{
              fontFamily:
                "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
            }}
          >
            Stalk us for more on TikTok and Instagram
          </p>
          <SocialIcons platforms={["instagram", "tiktok"]} variant="light" />
        </div>
      </div>
    </section>
  );
}
