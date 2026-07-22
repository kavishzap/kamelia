"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { btnPrimaryClass, btnSecondaryClass } from "@/lib/button-classes";

type ConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function RequestConfirmModal({ open, onCancel, onConfirm }: ConfirmModalProps) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onCancel]);

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
            onClick={onCancel}
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
              We’ll submit your details and give you a request ID to keep for your records.
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} className={btnSecondaryClass}>
                Not yet
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                className={btnPrimaryClass}
              >
                Yes, send
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
  requestId: string;
  onDone: () => void;
};

export function RequestSuccessModal({ open, requestId, onDone }: SuccessModalProps) {
  const titleId = useId();
  const copyRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => copyRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onDone]);

  const copyId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = requestId;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
    }
  }, [requestId]);

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
              Request sent
            </p>
            <h2
              id={titleId}
              className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-black"
            >
              Your request has been received
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              Please note your request ID and keep it handy. Our studio will follow up with you soon.
            </p>

            <div className="mt-6 border border-[var(--color-gold)]/35 bg-[var(--color-surface-raised)] px-4 py-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/55">
                Request ID
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-wide text-black">
                {requestId}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                ref={copyRef}
                type="button"
                onClick={() => void copyId()}
                className={btnSecondaryClass}
              >
                {copied ? "Copied" : "Copy ID"}
              </button>
              <button type="button" onClick={onDone} className={btnPrimaryClass}>
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

/** Sequential client-side IDs: #KAM001, #KAM002, … */
export function createRequestId(): string {
  const key = "kamellia-request-seq";
  let n = 1;
  try {
    n = Number(window.localStorage.getItem(key) || "0") + 1;
    window.localStorage.setItem(key, String(n));
  } catch {
    n = Date.now() % 1000 || 1;
  }
  return `#KAM${String(n).padStart(3, "0")}`;
}
