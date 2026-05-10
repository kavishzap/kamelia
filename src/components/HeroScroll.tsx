"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HERO_FRAME_COUNT, heroFrameUrls } from "@/data/hero-frames";

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = cw / ch;
  let dw: number;
  let dh: number;
  let ox: number;
  let oy: number;
  if (ir > cr) {
    dh = ch;
    dw = ch * ir;
    ox = (cw - dw) / 2;
    oy = 0;
  } else {
    dw = cw;
    dh = cw / ir;
    ox = 0;
    oy = (ch - dh) / 2;
  }
  ctx.clearRect(0, 0, cw, ch);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, iw, ih, ox, oy, dw, dh);
}

/**
 * Scroll-scrubbed hero: JPG frames drawn to a canvas (no `<img>` src flicker).
 * Frame index follows raw scroll progress; text/glow use a light spring for polish.
 */
export function HeroScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastIdxRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [framesReady, setFramesReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 320 : 140,
    damping: reduceMotion ? 42 : 32,
    mass: reduceMotion ? 0.12 : 0.28,
  });

  const glowOpacity = useTransform(smoothProgress, [0, 0.45, 1], [0.12, 0.38, 0.24]);

  const paintFrame = useCallback((progress01: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const imgs = framesRef.current;
    if (!canvas || !ctx || imgs.length !== HERO_FRAME_COUNT) return;

    const max = HERO_FRAME_COUNT - 1;
    const idx = Math.min(max, Math.max(0, Math.round(progress01 * max)));
    if (idx === lastIdxRef.current) return;
    const img = imgs[idx];
    if (!img?.complete || !(img.naturalWidth || img.width)) return;
    lastIdxRef.current = idx;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w < 1 || h < 1) return;
    drawCover(ctx, img, w, h);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastIdxRef.current = -1;
    paintFrame(scrollYProgress.get());
  }, [paintFrame, scrollYProgress]);

  const schedulePaint = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      paintFrame(scrollYProgress.get());
    });
  }, [paintFrame, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", schedulePaint);

  useLayoutEffect(() => {
    schedulePaint();
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [schedulePaint]);

  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(HERO_FRAME_COUNT);
    const BATCH = 24;

    (async () => {
      for (let i = 0; i < heroFrameUrls.length; i += BATCH) {
        if (cancelled) return;
        const slice = heroFrameUrls.slice(i, i + BATCH);
        await Promise.all(
          slice.map(
            (src, j) =>
              new Promise<void>((resolve) => {
                const idx = i + j;
                const im = new Image();
                im.decoding = "async";
                im.onload = () => {
                  imgs[idx] = im;
                  resolve();
                };
                im.onerror = () => {
                  imgs[idx] = im;
                  resolve();
                };
                im.src = src;
              }),
          ),
        );
      }
      if (cancelled) return;
      framesRef.current = imgs;
      setFramesReady(true);
      queueMicrotask(() => {
        resizeCanvas();
        schedulePaint();
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [resizeCanvas, schedulePaint]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(wrap);
    window.addEventListener("orientationchange", resizeCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, [framesReady, resizeCanvas]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[300vh] bg-[#0a0a0a]"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-[-10%] h-[120%] w-[120%] min-h-[100dvh] min-w-full">
            <div
              ref={wrapRef}
              className="relative h-full w-full bg-[#0a0a0a]"
              style={{ opacity: framesReady ? 1 : 0.4 }}
            >
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full touch-pan-y"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-black/45"
                aria-hidden
              />
              <motion.div
                style={{ opacity: glowOpacity }}
                className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,169,98,0.22),transparent_50%)]"
              />
              {!framesReady ? (
                <div
                  className="absolute inset-0 z-[3] flex items-center justify-center bg-black/40 text-sm uppercase tracking-[0.25em] text-[#c9a962]/90"
                  aria-live="polite"
                >
                  Preparing frames…
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[11] bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.48),transparent_70%)]" />

        <div className="absolute inset-0 z-[12] flex min-h-[100dvh] flex-col">
          <div className="flex flex-1 items-center justify-center px-5 py-16 pt-24 sm:px-8 sm:pt-28 sm:pb-8">
            <article className="pointer-events-auto w-full max-w-xl px-2 text-center sm:max-w-2xl sm:px-4">
              <img
                src="/logo_white.png"
                alt=""
                width={720}
                height={240}
                decoding="async"
                fetchPriority="high"
                className="mx-auto mb-6 block h-[clamp(3.25rem,14vw,5.5rem)] w-auto max-w-[min(280px,72vw)] object-contain object-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] sm:mb-8 sm:h-24 sm:max-w-[min(360px,85vw)]"
              />
              <p className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-none tracking-tight text-[#fffdf9] [text-shadow:0_2px_28px_rgba(0,0,0,0.75),0_1px_2px_rgba(0,0,0,0.9)] sm:text-6xl">
                Kamelia
              </p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.4em] text-[#e8d9b4] [text-shadow:0_2px_16px_rgba(0,0,0,0.75)] sm:text-sm">
                The Floral Designer
              </p>
              <h1 className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug text-[#fffdf9] [text-shadow:0_2px_24px_rgba(0,0,0,0.75),0_1px_2px_rgba(0,0,0,0.85)] sm:max-w-2xl sm:text-3xl sm:leading-tight lg:text-[2.35rem]">
                Luxury Floral Styling for Unforgettable Events
              </h1>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#f0ebe8] [text-shadow:0_2px_18px_rgba(0,0,0,0.8)] sm:max-w-lg sm:text-base">
                Wedding stages, floral arches, mandaps, engagement decor, and premium event styling —
                scroll to see the stage transform frame by frame.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a
                  href="#contact"
                  className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-full bg-[#c9a962] px-8 py-3 text-sm font-semibold text-[#0a0a0a] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.55)] transition hover:bg-[#d4bc7a] hover:shadow-lg"
                >
                  Plan Your Event
                </a>
                <a
                  href="#gallery"
                  className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-full border border-white/30 bg-black/45 px-8 py-3 text-sm font-semibold text-[#fffdf9] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] transition hover:border-[#c9a962]/60 hover:bg-black/55"
                >
                  View Gallery
                </a>
              </div>
            </article>
          </div>

          <div className="pointer-events-none flex shrink-0 flex-col items-center gap-2 pb-6 pt-2">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#f0ebe3] drop-shadow-md">
              Scroll the story
            </span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="flex h-10 w-6 items-start justify-center rounded-full border border-[#c9a962]/50 bg-black/25 pt-2"
            >
              <span className="block h-2 w-1 rounded-full bg-[#c9a962]" />
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
