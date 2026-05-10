/**
 * Hero scroll-frame sequence (public folder).
 * Directory: `public/ezgif-2480cda9ca8a75e6-jpg/`
 * Frames: `ezgif-frame-001.jpg` … `ezgif-frame-210.jpg`
 * Add/remove frames by changing `HERO_FRAME_COUNT` and keeping the same naming pattern.
 */
export const HERO_JPG_DIR = "/ezgif-2480cda9ca8a75e6-jpg";
export const HERO_FRAME_COUNT = 210;

export function getHeroFramePath(frameIndex: number): string {
  const i = Math.max(0, Math.min(HERO_FRAME_COUNT - 1, Math.floor(frameIndex)));
  const n = String(i + 1).padStart(3, "0");
  return `${HERO_JPG_DIR}/ezgif-frame-${n}.jpg`;
}

/** Sorted public URLs for preloading (same order as scroll 0 → end). */
export const heroFrameUrls: string[] = Array.from({ length: HERO_FRAME_COUNT }, (_, i) =>
  getHeroFramePath(i),
);
