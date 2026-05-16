"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type PortfolioImage = {
  src: string;
  alt: string;
};

export function PortfolioGridClient({ images }: { images: PortfolioImage[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img, i) => (
        <motion.div
          key={img.src}
          initial={{ opacity: 0, scale: 0.86, y: 28 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.95,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.08 * Math.min(i, 8),
          }}
          className="relative overflow-hidden bg-white shadow-sm ring-1 ring-black/5 will-change-transform"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative aspect-square w-full">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

