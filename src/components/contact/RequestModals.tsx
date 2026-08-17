"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { btnPrimaryClass, btnSecondaryClass } from "@/lib/button-classes";

type ConfirmModalProps = {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function RequestConfirmModal({
  open,
  loading = false,
  error = null,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || loading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => confirmRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Cancel"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => {
              if (!loading) onCancel();
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[201] w-full max-w-md border border-black/10 bg-white p-6 shadow-xl sm:p-8"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Confirm
            </p>
            <h2
              id={titleId}
              className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-black"
            >
              Send this request to Kamellia?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              We’ll send your details to our studio. A member of the team will be in touch to
              finalise everything with you.
            </p>
            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className={btnSecondaryClass}
              >
                Not yet
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={btnPrimaryClass}
              >
                {loading ? "Sending…" : "Yes, send"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

type SuccessModalProps = {
  open: boolean;
  onDone: () => void;
};

export function RequestSuccessModal({ open, onDone }: SuccessModalProps) {
  const titleId = useId();
  const doneRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => doneRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onDone]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[201] w-full max-w-md border border-black/10 bg-white p-6 shadow-xl sm:p-8"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Request received
            </p>
            <h2
              id={titleId}
              className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-black"
            >
              Thank you — we’ve got your request
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              A member of our studio will contact you within 48 hours to finalise the details of
              your floral styling.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              Please keep your phone nearby so we can reach you easily.
            </p>
            <div className="mt-8 flex justify-end">
              <button ref={doneRef} type="button" onClick={onDone} className={btnPrimaryClass}>
                Okay
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
