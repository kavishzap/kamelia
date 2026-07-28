"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { btnPrimaryClass } from "@/lib/button-classes";

type FieldErrors = {
  name?: string;
  message?: string;
  rating?: string;
};

function fieldClass(invalid?: boolean, hasValue?: boolean) {
  return [
    "w-full appearance-none border bg-white px-4 py-3 text-sm text-black outline-none transition focus:ring-1",
    invalid
      ? "border-red-400 focus:border-red-400 focus:ring-red-300/50"
      : "border-black/12 focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]/35",
    hasValue ? "text-black" : "text-black/40",
  ].join(" ");
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-black">
      {children}
      {required ? <span className="ml-1 text-[var(--color-gold)]">*</span> : null}
    </label>
  );
}

export function ReviewForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = useCallback((): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!message.trim()) next.message = "Please write a short review.";
    if (rating < 1 || rating > 5) next.rating = "Please choose a star rating.";
    return next;
  }, [name, message, rating]);

  const handleSubmit = useCallback(async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFormError("Please complete the required fields.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          rating,
        }),
      });

      const payload = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!res.ok) {
        throw new Error(payload?.error || "We couldn’t submit your review. Please try again.");
      }

      setSuccess(true);
      setName("");
      setMessage("");
      setRating(0);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "We couldn’t submit your review.");
    } finally {
      setSubmitting(false);
    }
  }, [validate, name, message, rating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mt-8 sm:mt-10"
    >
      <div className="bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
          Share your experience
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] text-[var(--color-cream)]">
          Leave a review
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          We’d love to hear from you. Reviews are checked before they appear on the site.
        </p>

        {success ? (
          <div className="mt-8 border border-[var(--color-gold)]/35 bg-[var(--color-surface-raised)] px-4 py-5 sm:px-5">
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-black">
              Thank you for your review
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              Your message was submitted and is pending approval. Once approved, it may appear in
              our Kind words section.
            </p>
            <button
              type="button"
              className={`${btnPrimaryClass} mt-5`}
              onClick={() => {
                setSuccess(false);
                setFormError(null);
              }}
            >
              Write another review
            </button>
          </div>
        ) : (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
            noValidate
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel required>Name</FieldLabel>
                <input
                  id="review-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                    setFormError(null);
                  }}
                  placeholder="Your name"
                  autoComplete="name"
                  className={fieldClass(Boolean(errors.name), Boolean(name))}
                  aria-invalid={Boolean(errors.name) || undefined}
                />
                {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
              </div>

              <div>
                <FieldLabel required>Rating</FieldLabel>
                <div className="flex min-h-[46px] items-center gap-0.5" role="radiogroup" aria-label="Star rating">
                  {Array.from({ length: 5 }, (_, i) => {
                    const value = i + 1;
                    const active = value <= (hoverRating || rating);
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={rating === value}
                        aria-label={`${value} star${value === 1 ? "" : "s"}`}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => {
                          setRating(value);
                          setErrors((prev) => ({ ...prev, rating: undefined }));
                          setFormError(null);
                        }}
                        className="p-1 transition hover:opacity-90"
                      >
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          aria-hidden
                          className={active ? "text-[var(--color-gold)]" : "text-black/15"}
                        >
                          <path
                            fill="currentColor"
                            d="M12 2.8l2.6 6.4 6.9.6-5.2 4.5 1.6 6.7L12 17.6 6.1 21l1.6-6.7L2.5 9.8l6.9-.6L12 2.8z"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                {errors.rating ? <p className="mt-2 text-sm text-red-600">{errors.rating}</p> : null}
              </div>
            </div>

            <div className="mt-6">
              <FieldLabel required>Your review</FieldLabel>
              <textarea
                id="review-message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrors((prev) => ({ ...prev, message: undefined }));
                  setFormError(null);
                }}
                rows={4}
                placeholder="Tell us about your experience with Kamellia"
                className={[fieldClass(Boolean(errors.message), Boolean(message)), "resize-y"].join(
                  " ",
                )}
                aria-invalid={Boolean(errors.message) || undefined}
              />
              {errors.message ? (
                <p className="mt-2 text-sm text-red-600">{errors.message}</p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {formError ? <p className="text-sm text-red-600 sm:mr-auto">{formError}</p> : null}
              <button type="submit" disabled={submitting} className={btnPrimaryClass}>
                {submitting ? "Submitting…" : "Submit review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
