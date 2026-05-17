export type LoadTask = {
  id: string;
  weight: number;
  run: () => Promise<void>;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => window.setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}

export function preloadImage(src: string, timeoutMs = 6_000): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);
    img.onload = finish;
    img.onerror = finish;
    img.src = src;
  });
}

/** Warm hero video cache — does not block long; resolves on first usable frame or timeout. */
export function preloadVideo(src: string, timeoutMs = 6_000): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      video.onloadeddata = null;
      video.oncanplay = null;
      video.oncanplaythrough = null;
      video.onerror = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);
    video.onloadeddata = finish;
    video.oncanplay = finish;
    video.oncanplaythrough = finish;
    video.onerror = finish;
    video.src = src;
    video.load();
  });
}

export function waitForFonts(timeoutMs = 4_000): Promise<void> {
  if (typeof document === "undefined" || !document.fonts?.ready) {
    return Promise.resolve();
  }

  return withTimeout(document.fonts.ready.then(() => undefined), timeoutMs, undefined);
}

export function waitForDocumentReady(timeoutMs = 3_000): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (document.readyState === "complete" || document.readyState === "interactive") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      document.removeEventListener("DOMContentLoaded", finish);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    document.addEventListener("DOMContentLoaded", finish, { once: true });
  });
}

export const CRITICAL_ASSETS = {
  logo: "/logo_black.png",
  heroVideo: "/herovideo.mp4",
} as const;

export async function runWeightedLoad(
  tasks: LoadTask[],
  onProgress: (ratio: number) => void,
): Promise<void> {
  const total = tasks.reduce((sum, t) => sum + t.weight, 0);
  let completed = 0;

  const tick = () => {
    onProgress(total > 0 ? Math.min(1, completed / total) : 1);
  };

  tick();

  await Promise.all(
    tasks.map(async (task) => {
      try {
        await task.run();
      } catch {
        /* never block on a single task */
      } finally {
        completed += task.weight;
        tick();
      }
    }),
  );

  onProgress(1);
}

export function buildInitialLoadTasks(): LoadTask[] {
  return [
    { id: "fonts", weight: 20, run: () => waitForFonts() },
    { id: "logo", weight: 25, run: () => preloadImage(CRITICAL_ASSETS.logo) },
    { id: "hero-video", weight: 35, run: () => preloadVideo(CRITICAL_ASSETS.heroVideo) },
    { id: "document", weight: 20, run: () => waitForDocumentReady() },
  ];
}

export const MAX_INITIAL_LOAD_MS = 8_000;

export async function runInitialLoad(onProgress: (ratio: number) => void): Promise<void> {
  await withTimeout(runWeightedLoad(buildInitialLoadTasks(), onProgress), MAX_INITIAL_LOAD_MS, undefined);
  onProgress(1);
}
