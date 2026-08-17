"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  EVENT_TIMES,
  PACKAGE_CUSTOM_BUDGET,
  VENUE_SETTINGS,
} from "@/data/event-questionnaire";
import type { QState } from "@/data/questionnaire-q-state";
import { btnPrimaryClass } from "@/lib/button-classes";
import {
  RequestConfirmModal,
  RequestSuccessModal,
} from "@/components/contact/RequestModals";

export type { QState } from "@/data/questionnaire-q-state";

function emptyQState(): QState {
  return {
    fullName: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venueName: "",
    venueSetting: "",
    packageOption: "",
    customBudget: "",
    specialRequests: "",
  };
}

function isFutureOrToday(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(d.getTime()) && d >= today;
}

function isValidPhone(value: string) {
  const trimmed = value.trim();
  if (!/^[\d\s+\-()]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

type FieldKey = keyof QState;
type FieldErrors = Partial<Record<FieldKey, string>>;

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

const fieldClass = (invalid?: boolean, hasValue?: boolean) =>
  [
    "w-full appearance-none border bg-white px-4 py-3 text-sm text-black outline-none transition focus:ring-1",
    invalid
      ? "border-red-400 focus:border-red-400 focus:ring-red-300/50"
      : "border-black/12 focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]/35",
    hasValue ? "text-black" : "text-black/40",
  ].join(" ");

function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className={`${fieldClass(invalid, Boolean(value))} cursor-pointer pr-11`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

function TextField({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  invalid,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "email" | "tel";
  placeholder?: string;
  invalid?: boolean;
  autoComplete?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
      className={fieldClass(invalid, Boolean(value))}
    />
  );
}

function TextAreaField({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      rows={4}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "w-full resize-y border bg-white px-4 py-3 text-sm text-black outline-none transition focus:ring-1",
        "border-black/12 focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]/35",
        value ? "text-black" : "text-black/40",
      ].join(" ")}
    />
  );
}

function validate(s: QState): FieldErrors {
  const errors: FieldErrors = {};
  if (!s.fullName.trim()) errors.fullName = "Please enter your name.";
  if (!s.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!isValidPhone(s.phone))
    errors.phone = "Enter a valid phone number (digits only, 7–15 numbers).";
  if (s.email.trim() && !isValidEmail(s.email))
    errors.email = "Enter a valid email address.";
  if (!s.eventType.trim()) errors.eventType = "Please select an event type.";
  if (!s.eventDate) errors.eventDate = "Please choose your event date.";
  else if (!isFutureOrToday(s.eventDate))
    errors.eventDate = "Event date must be today or in the future.";
  if (!s.eventTime.trim()) errors.eventTime = "Please select when your event takes place.";
  if (!s.venueName.trim()) errors.venueName = "Please enter your venue location.";
  if (!s.venueSetting.trim()) errors.venueSetting = "Please select indoor, outdoor, or both.";
  if (!s.packageOption.trim()) errors.packageOption = "Please select a package.";
  else if (s.packageOption === PACKAGE_CUSTOM_BUDGET) {
    const budget = s.customBudget.replace(/[^\d]/g, "");
    if (!budget) errors.customBudget = "Please enter your budget.";
    else if (Number(budget) < 1) errors.customBudget = "Please enter a valid budget amount.";
  }
  return errors;
}

function formatPackagePayload(s: QState): string {
  if (s.packageOption === PACKAGE_CUSTOM_BUDGET) {
    const digits = s.customBudget.replace(/[^\d]/g, "");
    const amount = digits ? Number(digits).toLocaleString("en-US") : s.customBudget.trim();
    return `${PACKAGE_CUSTOM_BUDGET} — Rs ${amount}`;
  }
  return s.packageOption.trim();
}

type EventQuestionnaireProps = {
  variant?: "page" | "embedded";
};

export function EventQuestionnaire({ variant = "page" }: EventQuestionnaireProps) {
  const embedded = variant === "embedded";
  const [s, setS] = useState<QState>(emptyQState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const packageOptions = [...packageNames, PACKAGE_CUSTOM_BUDGET];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [packagesRes, typesRes] = await Promise.all([
          fetch("/api/packages"),
          fetch("/api/event-types"),
        ]);
        const packagesPayload = (await packagesRes.json().catch(() => null)) as
          | { packages?: { name: string }[] }
          | null;
        const typesPayload = (await typesRes.json().catch(() => null)) as
          | { eventTypes?: { name: string }[] }
          | null;
        if (cancelled) return;
        setPackageNames(
          Array.isArray(packagesPayload?.packages)
            ? packagesPayload.packages.map((p) => p.name).filter(Boolean)
            : [],
        );
        setEventTypes(
          Array.isArray(typesPayload?.eventTypes)
            ? typesPayload.eventTypes.map((t) => t.name).filter(Boolean)
            : [],
        );
      } catch {
        if (!cancelled) {
          setPackageNames([]);
          setEventTypes([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("eventType");
    if (!raw || !eventTypes.length) return;
    const match = eventTypes.find((t) => t.toLowerCase() === raw.toLowerCase());
    if (!match) return;
    setS((prev) => (prev.eventType ? prev : { ...prev, eventType: match }));
  }, [eventTypes]);

  const patch = useCallback(<K extends FieldKey>(key: K, value: QState[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError(null);
  }, []);

  const handleSendClick = useCallback(() => {
    const nextErrors = validate(s);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFormError("Please complete the required fields before sending.");
      return;
    }
    setFormError(null);
    setSubmitError(null);
    setConfirmOpen(true);
  }, [s]);

  const handleConfirmSend = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/event-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: s.fullName.trim(),
          phone: s.phone.trim(),
          email: s.email.trim(),
          eventType: s.eventType.trim(),
          eventDate: s.eventDate,
          eventTime: s.eventTime.trim(),
          venueLocation: s.venueName.trim(),
          setting: s.venueSetting.trim(),
          packages: formatPackagePayload(s),
          specialRequests: s.specialRequests.trim(),
        }),
      });

      const payload = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!res.ok) {
        throw new Error(payload?.error || "We couldn’t send your request. Please try again.");
      }

      setConfirmOpen(false);
      setSuccessOpen(true);
      setS(emptyQState());
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "We couldn’t send your request.");
    } finally {
      setSubmitting(false);
    }
  }, [s]);

  return (
    <motion.div
      className={
        embedded
          ? "relative"
          : "relative min-h-screen bg-[var(--color-surface)] pb-24 pt-[max(6.5rem,env(safe-area-inset-top)+5.5rem)] sm:pt-[max(7.5rem,env(safe-area-inset-top)+6rem)]"
      }
    >
      <div className={`relative w-full ${embedded ? "" : "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"}`}>
        {!embedded ? (
          <header className="mb-10 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] sm:text-sm">
              Plan your event
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-cream)] sm:text-3xl">
              Event styling brief
            </h1>
          </header>
        ) : null}

        <form onSubmit={(e) => e.preventDefault()} className="min-w-0" noValidate>
          <div className="bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div data-field="fullName">
                <FieldLabel required>Name</FieldLabel>
                <TextField
                  id="full-name"
                  value={s.fullName}
                  onChange={(v) => patch("fullName", v)}
                  placeholder="Your full name"
                  autoComplete="name"
                  invalid={Boolean(errors.fullName)}
                />
                <FieldError message={errors.fullName} />
              </div>

              <div data-field="phone">
                <FieldLabel required>Phone</FieldLabel>
                <TextField
                  id="phone"
                  type="tel"
                  value={s.phone}
                  onChange={(v) => patch("phone", v)}
                  placeholder="Your phone number"
                  autoComplete="tel"
                  invalid={Boolean(errors.phone)}
                />
                <FieldError message={errors.phone} />
              </div>

              <div data-field="email">
                <FieldLabel>Email</FieldLabel>
                <TextField
                  id="email"
                  type="email"
                  value={s.email}
                  onChange={(v) => patch("email", v)}
                  placeholder="Optional"
                  autoComplete="email"
                  invalid={Boolean(errors.email)}
                />
                <FieldError message={errors.email} />
              </div>

              <div data-field="eventType">
                <FieldLabel required>Event type</FieldLabel>
                <SelectField
                  id="event-type"
                  value={s.eventType}
                  onChange={(v) => patch("eventType", v)}
                  options={eventTypes}
                  placeholder="Select event type"
                  invalid={Boolean(errors.eventType)}
                />
                <FieldError message={errors.eventType} />
              </div>

              <div data-field="eventDate">
                <FieldLabel required>Event date</FieldLabel>
                <TextField
                  id="event-date"
                  type="date"
                  value={s.eventDate}
                  onChange={(v) => patch("eventDate", v)}
                  invalid={Boolean(errors.eventDate)}
                />
                <FieldError message={errors.eventDate} />
              </div>

              <div data-field="eventTime">
                <FieldLabel required>Event time</FieldLabel>
                <SelectField
                  id="event-time"
                  value={s.eventTime}
                  onChange={(v) => patch("eventTime", v)}
                  options={EVENT_TIMES}
                  placeholder="Select event time"
                  invalid={Boolean(errors.eventTime)}
                />
                <FieldError message={errors.eventTime} />
              </div>

              <div data-field="venueName">
                <FieldLabel required>Venue location</FieldLabel>
                <TextField
                  id="venue-location"
                  value={s.venueName}
                  onChange={(v) => patch("venueName", v)}
                  placeholder="e.g. hotel, hall, or address"
                  invalid={Boolean(errors.venueName)}
                />
                <FieldError message={errors.venueName} />
              </div>

              <div data-field="venueSetting">
                <FieldLabel required>Setting</FieldLabel>
                <SelectField
                  id="venue-setting"
                  value={s.venueSetting}
                  onChange={(v) => patch("venueSetting", v)}
                  options={VENUE_SETTINGS}
                  placeholder="Select setting"
                  invalid={Boolean(errors.venueSetting)}
                />
                <FieldError message={errors.venueSetting} />
              </div>

              <div data-field="packageOption">
                <FieldLabel required>Packages</FieldLabel>
                <SelectField
                  id="package-option"
                  value={s.packageOption}
                  onChange={(v) => {
                    patch("packageOption", v);
                    if (v !== PACKAGE_CUSTOM_BUDGET) patch("customBudget", "");
                  }}
                  options={packageOptions}
                  placeholder={packageNames.length ? "Select a package" : "Loading packages…"}
                  invalid={Boolean(errors.packageOption)}
                />
                <FieldError message={errors.packageOption} />
              </div>
            </div>

            {s.packageOption === PACKAGE_CUSTOM_BUDGET ? (
              <div className="mt-6" data-field="customBudget">
                <FieldLabel required>Your budget</FieldLabel>
                <TextField
                  id="custom-budget"
                  type="text"
                  value={s.customBudget}
                  onChange={(v) => patch("customBudget", v)}
                  placeholder="e.g. 45000"
                  invalid={Boolean(errors.customBudget)}
                />
                <p className="mt-2 text-sm text-black/45">Enter an amount in Rs.</p>
                <FieldError message={errors.customBudget} />
              </div>
            ) : null}

            <p className="mt-3 text-sm leading-relaxed text-black/55">
              Transport is not included. Prices may vary upon customization and final requirements.
            </p>

            <div className="mt-6" data-field="specialRequests">
              <FieldLabel>Special requests</FieldLabel>
              <TextAreaField
                id="special-requests"
                value={s.specialRequests}
                onChange={(v) => patch("specialRequests", v)}
                placeholder="Colors, must-have florals, cultural notes, or anything else we should know"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <button type="button" onClick={handleSendClick} className={btnPrimaryClass}>
                Send request to Kamellia
              </button>
            </div>

            {formError ? <p className="mt-4 text-sm text-red-600 sm:text-right">{formError}</p> : null}
          </div>
        </form>
      </div>

      <RequestConfirmModal
        open={confirmOpen}
        loading={submitting}
        error={submitError}
        onCancel={() => {
          if (submitting) return;
          setConfirmOpen(false);
          setSubmitError(null);
        }}
        onConfirm={() => void handleConfirmSend()}
      />
      <RequestSuccessModal
        open={successOpen}
        onDone={() => setSuccessOpen(false)}
      />
    </motion.div>
  );
}
