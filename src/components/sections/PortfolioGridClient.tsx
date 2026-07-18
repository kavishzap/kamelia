"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FillImage } from "@/components/FillImage";

type PortfolioImage = {
  src: string;
  alt: string;
};

function PortfolioLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: PortfolioImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 sm:p-8"
      onClick={onClose}
    >
      <p id={titleId} className="sr-only">
        Portfolio image {index + 1} of {images.length}
      </p>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center border border-white/25 bg-black/40 text-white transition hover:border-white/50 hover:bg-black/60 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-black/40 text-white transition hover:border-white/50 hover:bg-black/60 sm:inline-flex lg:left-6"
            aria-label="Previous image"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-black/40 text-white transition hover:border-white/50 hover:bg-black/60 sm:inline-flex lg:right-6"
            aria-label="Next image"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      ) : null}

      <div
        className="relative flex h-full max-h-[min(88vh,920px)] w-full max-w-5xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={image.src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="relative h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs intrinsic sizing */}
            <img
              src={image.src}
              alt={image.alt}
              className="mx-auto h-full max-h-[min(88vh,920px)] w-auto max-w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-[family-name:var(--font-display)] text-sm tracking-wide text-white/80">
        {index + 1} / {images.length}
      </p>
    </motion.div>
  );
}

function Tile({
  image,
  index,
  className,
  sizes,
  onOpen,
}: {
  image: PortfolioImage;
  index: number;
  className?: string;
  sizes: string;
  onOpen: (index: number) => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.04 * Math.min(index, 6),
      }}
      onClick={() => onOpen(index)}
      className={`group relative block w-full overflow-hidden bg-[var(--color-surface-raised)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${className ?? ""}`}
      aria-label={`View portfolio image ${index + 1}`}
    >
      <FillImage
        src={image.src}
        alt={image.alt}
        fill
        loading="lazy"
        sizes={sizes}
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15"
        aria-hidden
      />
    </motion.button>
  );
}

export function PortfolioGridClient({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  const open = useCallback((index: number) => setActive(index), []);
  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    setActive((i) => (i == null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActive((i) => (i == null ? i : (i + 1) % images.length));
  }, [images.length]);

  if (images.length === 0) return null;

  const featured = images[0]!;
  const side = images.slice(1, 3);
  const restStart = side.length === 2 ? 3 : 1;
  const rest = images.slice(restStart);

  return (
    <>
      <div className="mt-8 sm:mt-10">
        {/* Editorial opener: large feature + two stacked */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-12 lg:gap-4">
          <Tile
            image={featured}
            index={0}
            onOpen={open}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={
              side.length === 2
                ? "aspect-[4/5] sm:aspect-[5/4] lg:col-span-7 lg:aspect-auto lg:min-h-[560px]"
                : "aspect-[4/5] sm:aspect-[5/4] lg:col-span-12 lg:aspect-[21/9] lg:min-h-[420px]"
            }
          />

          {side.length === 2 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-5 lg:grid-cols-1 lg:gap-4">
              {side.map((image, i) => (
                <Tile
                  key={image.src}
                  image={image}
                  index={i + 1}
                  onOpen={open}
                  sizes="(min-width: 1024px) 35vw, 50vw"
                  className="aspect-[4/5] lg:aspect-auto lg:min-h-[272px]"
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Remaining work */}
        {rest.length > 0 ? (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:mt-3 sm:gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-4">
            {rest.map((image, i) => {
              const index = restStart + i;
              return (
                <Tile
                  key={image.src}
                  image={image}
                  index={index}
                  onOpen={open}
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="aspect-[4/5]"
                />
              );
            })}
          </div>
        ) : null}
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {active != null ? (
                <PortfolioLightbox
                  images={images}
                  index={active}
                  onClose={close}
                  onPrev={prev}
                  onNext={next}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
