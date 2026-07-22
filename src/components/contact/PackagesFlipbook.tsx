"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PDF_URL = "/packages.pdf";
const ZOOM_MIN = 0.75;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

type FlipApi = {
  flipNext: (corner?: "top" | "bottom") => void;
  flipPrev: (corner?: "top" | "bottom") => void;
  getCurrentPageIndex: () => number;
  getPageCount: () => number;
};

type FlipBookHandle = {
  pageFlip: () => FlipApi;
};

const BookPage = forwardRef<HTMLDivElement, { src: string; pageNumber: number }>(
  function BookPage({ src, pageNumber }, ref) {
    return (
      <div
        ref={ref}
        className="overflow-hidden bg-[#f7f4ef]"
        data-density="soft"
        style={{ width: "100%", height: "100%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Packages brochure — page ${pageNumber}`}
          className="h-full w-full select-none object-contain"
          draggable={false}
        />
      </div>
    );
  },
);

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 bg-white text-black transition hover:border-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function computePageSize(
  containerW: number,
  aspect: number,
  opts: { fullscreen: boolean; mobile: boolean },
) {
  const padX = opts.mobile ? 12 : 32;
  const toolbarReserve = opts.fullscreen ? 120 : 96;
  const availW = Math.max(200, containerW - padX * 2);
  const availH = opts.fullscreen
    ? Math.max(280, window.innerHeight - toolbarReserve)
    : Math.max(
        260,
        Math.min(
          opts.mobile ? window.innerHeight * 0.58 : window.innerHeight * 0.62,
          opts.mobile ? 520 : 640,
        ),
      );

  // Single page on phones / narrow widths; spread on comfortable widths
  const isSpread = !opts.mobile && availW >= 720;

  let pageW = isSpread ? Math.floor(availW / 2) : Math.floor(availW);
  let pageH = Math.floor(pageW / aspect);

  if (pageH > availH) {
    pageH = Math.floor(availH);
    pageW = Math.floor(pageH * aspect);
  }

  const maxPageW = opts.fullscreen ? (isSpread ? 520 : 640) : isSpread ? 460 : 420;
  if (pageW > maxPageW) {
    pageW = maxPageW;
    pageH = Math.floor(pageW / aspect);
  }

  return {
    width: Math.max(180, pageW),
    height: Math.max(240, pageH),
    isSpread,
  };
}

type ViewerProps = {
  pages: string[];
  aspect: number;
  pageIndex: number;
  onPageChange: (index: number) => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
};

function FlipbookViewer({
  pages,
  aspect,
  pageIndex,
  onPageChange,
  fullscreen,
  onToggleFullscreen,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ViewerProps) {
  const bookRef = useRef<FlipBookHandle | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 280, height: 400 });
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const update = () => {
      const next = computePageSize(el.clientWidth, aspect, { fullscreen, mobile });
      setSize({ width: next.width, height: next.height });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [aspect, fullscreen, mobile, pages.length]);

  const pageCount = pages.length;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < Math.max(pageCount - 1, 0);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const statusLabel = useMemo(() => {
    if (!pageCount) return "";
    return `${Math.min(pageIndex + 1, pageCount)} / ${pageCount}`;
  }, [pageIndex, pageCount]);

  const zoomLabel = `${Math.round(zoom * 100)}%`;
  const canZoomOut = zoom > ZOOM_MIN + 0.001;
  const canZoomIn = zoom < ZOOM_MAX - 0.001;

  const controls = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <IconButton label="Previous page" onClick={flipPrev} disabled={!canPrev}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </IconButton>

      <p className="min-w-[4.5rem] px-1 text-center text-sm tabular-nums text-[var(--color-muted)]">
        {statusLabel}
      </p>

      <IconButton label="Next page" onClick={flipNext} disabled={!canNext}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </IconButton>

      <span className="mx-1 hidden h-6 w-px bg-black/15 sm:block" aria-hidden />

      <IconButton label="Zoom out" onClick={onZoomOut} disabled={!canZoomOut}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M8 11h6M21 21l-4.3-4.3" />
        </svg>
      </IconButton>

      <button
        type="button"
        onClick={onZoomReset}
        className="min-w-[3.75rem] border border-black/15 bg-white px-2 py-2 text-xs font-semibold tabular-nums text-black transition hover:border-[var(--color-gold)]"
        title="Reset zoom"
      >
        {zoomLabel}
      </button>

      <IconButton label="Zoom in" onClick={onZoomIn} disabled={!canZoomIn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M11 8v6M8 11h6M21 21l-4.3-4.3" />
        </svg>
      </IconButton>

      <IconButton
        label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        onClick={onToggleFullscreen}
      >
        {fullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3H5v4M15 3h4v4M9 21H5v-4M15 21h4v-4" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
          </svg>
        )}
      </IconButton>
    </div>
  );

  return (
    <div
      ref={shellRef}
      className={[
        "relative flex flex-col",
        fullscreen
          ? "h-full min-h-0 bg-[linear-gradient(160deg,#1a1814_0%,#2a2620_100%)]"
          : "overflow-hidden bg-[linear-gradient(160deg,#f3eee6_0%,#ebe4d8_45%,#e4dccf_100%)] ring-1 ring-black/8",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center justify-center gap-3 border-b px-3 py-3",
          fullscreen ? "border-white/10 text-white" : "border-black/8 bg-white/40",
        ].join(" ")}
      >
        {controls}
      </div>

      <div
        className={[
          "min-h-0 flex-1 overflow-auto overscroll-contain",
          fullscreen
            ? "px-2 py-4 sm:px-6 sm:py-6"
            : "max-h-[min(70vh,560px)] px-2 py-4 sm:max-h-[min(72vh,640px)] sm:px-5 sm:py-6",
        ].join(" ")}
      >
        <div
          className="mx-auto flex justify-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            // Extra scroll room when zoomed so pages stay reachable
            paddingBottom: zoom > 1 ? `${(zoom - 1) * size.height}px` : undefined,
            minHeight: size.height * zoom,
          }}
        >
          <HTMLFlipBook
            key={`book-${size.width}x${size.height}-${fullscreen ? "fs" : "n"}`}
            ref={bookRef as never}
            width={size.width}
            height={size.height}
            size="fixed"
            minWidth={160}
            maxWidth={640}
            minHeight={220}
            maxHeight={900}
            drawShadow
            flippingTime={mobile ? 650 : 850}
            usePortrait
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.35}
            showCover={false}
            mobileScrollSupport
            clickEventForward={false}
            useMouseEvents
            swipeDistance={mobile ? 20 : 30}
            showPageCorners={!mobile}
            disableFlipByClick={false}
            className={[
              "packages-flipbook",
              fullscreen
                ? "shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                : "shadow-[0_18px_50px_rgba(40,30,20,0.18)]",
            ].join(" ")}
            style={{}}
            startPage={pageIndex}
            onFlip={(e) => onPageChange(e.data)}
          >
            {pages.map((src, i) => (
              <BookPage key={`page-${i + 1}`} src={src} pageNumber={i + 1} />
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {fullscreen ? (
        <p className="px-4 pb-4 text-center text-xs text-white/55 sm:pb-5">
          Swipe or use arrows to turn pages · Pinch-friendly zoom controls above · Esc to exit
        </p>
      ) : (
        <p className="px-3 pb-3 text-center text-xs text-black/45 sm:hidden">
          Swipe to turn pages · Use zoom & fullscreen for a closer look
        </p>
      )}
    </div>
  );
}

export function PackagesFlipbook() {
  const [pages, setPages] = useState<string[]>([]);
  const [aspect, setAspect] = useState(0.75);
  const [pageIndex, setPageIndex] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: ReturnType<typeof getDocument> | null = null;

    (async () => {
      try {
        loadingTask = getDocument({ url: PDF_URL, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const total = pdf.numPages;
        const nextPages: string[] = [];
        let nextAspect = 0.75;

        for (let i = 1; i <= total; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          if (i === 1) nextAspect = base.width / base.height;

          const scale = Math.min(1.35, 1100 / base.width);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas unavailable");

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          nextPages.push(canvas.toDataURL("image/jpeg", 0.82));
          setProgress({ done: i, total });
        }

        if (cancelled) return;
        setPages(nextPages);
        setAspect(nextAspect);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError("We couldn’t open the packages brochure. Please try again.");
      }
    })();

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
  }, []);

  const zoomReset = useCallback(() => setZoom(1), []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((v) => !v);
    setZoom(1);
  }, []);

  const viewer = pages.length ? (
    <FlipbookViewer
      pages={pages}
      aspect={aspect}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      fullscreen={fullscreen}
      onToggleFullscreen={toggleFullscreen}
      zoom={zoom}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onZoomReset={zoomReset}
    />
  ) : null;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Our packages
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Flip through the brochure like a book.
          </p>
        </div>
        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)]/45 underline-offset-2 hover:text-[#a88b4a]"
        >
          Open PDF
        </a>
      </div>

      {error ? (
        <div className="bg-[#f3eee6] px-4 py-16 text-center ring-1 ring-black/8">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : !pages.length ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 bg-[#f3eee6] py-14 ring-1 ring-black/8 sm:min-h-[280px]">
          <div className="h-1.5 w-40 overflow-hidden bg-black/10 sm:w-48">
            <div
              className="h-full bg-[var(--color-gold)] transition-[width] duration-300"
              style={{
                width:
                  progress.total > 0
                    ? `${Math.round((progress.done / progress.total) * 100)}%`
                    : "12%",
              }}
            />
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            {progress.total > 0
              ? `Preparing page ${progress.done} of ${progress.total}…`
              : "Opening packages brochure…"}
          </p>
        </div>
      ) : fullscreen && typeof document !== "undefined" ? (
        createPortal(
          <div className="fixed inset-0 z-[220] flex flex-col">
            {viewer}
          </div>,
          document.body,
        )
      ) : (
        viewer
      )}
    </div>
  );
}
