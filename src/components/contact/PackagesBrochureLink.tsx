"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { btnPrimaryClass, btnSecondaryClass } from "@/lib/button-classes";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PDF_URL = "/packages.pdf";
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

function IconBtn({
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

function PackagesPdfModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setPageIndex((i) => Math.min(i + 1, Math.max(pages.length - 1, 0)));
      if (e.key === "ArrowLeft") setPageIndex((i) => Math.max(i - 1, 0));
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
      if (e.key === "-") setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, pages.length]);

  useEffect(() => {
    if (!open) return;
    if (pages.length) return;

    let cancelled = false;
    let loadingTask: ReturnType<typeof getDocument> | null = null;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        loadingTask = getDocument({ url: PDF_URL, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const total = pdf.numPages;
        const next: string[] = [];

        for (let i = 1; i <= total; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(1.6, 1400 / base.width);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas unavailable");
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          next.push(canvas.toDataURL("image/jpeg", 0.88));
          setProgress({ done: i, total });
        }

        if (cancelled) return;
        setPages(next);
        setPageIndex(0);
        setZoom(1);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn’t open the packages brochure. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [open, pages.length]);

  useEffect(() => {
    if (!open) return;
    stageRef.current?.scrollTo({ top: 0, left: 0 });
  }, [pageIndex, open]);

  const pageCount = pages.length;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;
  const zoomLabel = `${Math.round(zoom * 100)}%`;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-[220] flex flex-col bg-[#1a1814]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <header className="relative z-10 flex shrink-0 flex-col gap-3 border-b border-white/10 bg-[#141210] px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="min-w-0">
              <p id={titleId} className="truncate text-sm font-semibold text-white">
                Packages brochure
              </p>
              <p className="text-xs text-white/50">
                {pageCount ? `Page ${pageIndex + 1} of ${pageCount}` : "Loading…"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <IconBtn
                label="Previous page"
                onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </IconBtn>
              <IconBtn
                label="Next page"
                onClick={() => setPageIndex((i) => Math.min(pageCount - 1, i + 1))}
                disabled={!canNext}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </IconBtn>

              <span className="mx-0.5 hidden h-6 w-px bg-white/15 sm:block" aria-hidden />

              <IconBtn
                label="Zoom out"
                onClick={() => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100))}
                disabled={zoom <= ZOOM_MIN}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M8 11h6M21 21l-4.3-4.3" />
                </svg>
              </IconBtn>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="min-w-[3.75rem] border border-black/15 bg-white px-2 py-2 text-xs font-semibold tabular-nums text-black"
                title="Reset zoom"
              >
                {zoomLabel}
              </button>
              <IconBtn
                label="Zoom in"
                onClick={() => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100))}
                disabled={zoom >= ZOOM_MAX}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M11 8v6M8 11h6M21 21l-4.3-4.3" />
                </svg>
              </IconBtn>

              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnSecondaryClass} hidden px-4 sm:inline-flex`}
              >
                Open PDF
              </a>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                aria-label="Close brochure"
              >
                Close
              </button>
            </div>
          </header>

          <div
            ref={stageRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative min-h-0 flex-1 overflow-auto overscroll-contain px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6"
          >
            {error ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-red-300">{error}</p>
                <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className={btnPrimaryClass}>
                  Open PDF instead
                </a>
              </div>
            ) : loading || !pages.length ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <div className="h-1.5 w-48 overflow-hidden bg-white/10">
                  <div
                    className="h-full bg-[var(--color-gold)] transition-[width] duration-300"
                    style={{
                      width:
                        progress.total > 0
                          ? `${Math.round((progress.done / progress.total) * 100)}%`
                          : "14%",
                    }}
                  />
                </div>
                <p className="text-sm text-white/60">
                  {progress.total > 0
                    ? `Preparing page ${progress.done} of ${progress.total}…`
                    : "Opening packages brochure…"}
                </p>
              </div>
            ) : (
              <div className="mx-auto flex justify-center">
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    paddingBottom: zoom > 1 ? `${(zoom - 1) * 40}vh` : undefined,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pages[pageIndex]}
                    alt={`Packages brochure page ${pageIndex + 1}`}
                    className="mx-auto max-w-[min(100%,920px)] select-none shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="shrink-0 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 text-center text-[11px] text-white/40 sm:hidden">
            Pinch-scroll to explore · use zoom controls above · swipe pages with arrows
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function PackagesBrochureLink() {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center md:items-start">
        <button type="button" onClick={openModal} className={btnPrimaryClass}>
          View packages brochure
        </button>
      </div>

      <PackagesPdfModal open={open} onClose={closeModal} />
    </>
  );
}
