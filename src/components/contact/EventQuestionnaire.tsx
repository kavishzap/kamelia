"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BUDGET_RANGES,
  COLOR_SWATCHES,
  DECOR_AREAS,
  DECOR_ELEMENTS,
  DECOR_PRIORITY_MAX,
  EVENT_TIMES,
  EVENT_TYPES,
  FLORAL_PREFS,
  GUEST_RANGES,
  THEME_STYLES,
  VENUE_SETTINGS,
} from "@/data/event-questionnaire";
import type { QState } from "@/data/questionnaire-q-state";
import { KAMELIA_PHONE_DISPLAY, kameliaTelHref, kameliaWhatsAppHref } from "@/data/contact";
import { btnPrimaryClass, btnSecondaryClass } from "@/lib/button-classes";
import {
  buildQuestionnairePdfBlob,
  buildWhatsappSendPdfHref,
  defaultPdfFilename,
} from "@/lib/generateQuestionnairePdf";

export type { QState } from "@/data/questionnaire-q-state";

function emptyQState(): QState {
  return {
    eventType: "",
    eventDate: "",
    eventTime: "",
    guestCount: "",
    venueName: "",
    venueSetting: "",
    themeStyle: "",
    colors: [],
    decorAreas: [],
    decorElements: [],
    decorPriorities: [],
    floralPrefs: [],
    budget: "",
    inspirationLinks: "",
    culturalNotes: "",
    memorableMoment: "",
    notes: "",
    fullName: "",
    whatsapp: "",
  };
}

type ArrayFieldKey =
  | "colors"
  | "floralPrefs"
  | "decorAreas"
  | "decorElements"
  | "decorPriorities";

const STEPS = [
  { id: 0, title: "Event & venue", short: "Event" },
  { id: 1, title: "Design & decor", short: "Design" },
  { id: 2, title: "Budget & contact", short: "Contact" },
] as const;

type FieldKey = keyof QState;

/** DOM order for scrolling to the first invalid field on each step */
const STEP_FIELD_ORDER: Record<number, FieldKey[]> = {
  0: [
    "eventType",
    "eventDate",
    "eventTime",
    "guestCount",
    "venueName",
    "venueSetting",
  ],
  1: [
    "themeStyle",
    "colors",
    "decorAreas",
    "decorElements",
    "decorPriorities",
    "floralPrefs",
  ],
  2: ["budget", "fullName", "whatsapp"],
};

type ScrollTarget = "form-top" | FieldKey;

type StepErrors = Partial<Record<FieldKey, string>>;

function isValidPhone(value: string) {
  const trimmed = value.trim();
  if (!/^[\d\s+\-()]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isFutureOrToday(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(d.getTime()) && d >= today;
}

function validateStep(stepIndex: number, s: QState): StepErrors {
  const errors: StepErrors = {};

  if (stepIndex === 0) {
    if (!s.eventType.trim()) errors.eventType = "Please select an event type.";
    if (!s.eventDate) errors.eventDate = "Please choose your event date.";
    else if (!isFutureOrToday(s.eventDate)) errors.eventDate = "Event date must be today or in the future.";
    if (!s.eventTime) errors.eventTime = "Please select when your event takes place.";
    if (!s.guestCount) errors.guestCount = "Please select an estimated guest count.";
    if (!s.venueName.trim()) errors.venueName = "Please enter your venue name.";
    if (!s.venueSetting) errors.venueSetting = "Please select indoor, outdoor, or both.";
    return errors;
  }

  if (stepIndex === 1) {
    if (!s.themeStyle) errors.themeStyle = "Please choose an overall style.";
    if (s.colors.length === 0) errors.colors = "Select at least one palette tone.";
    if (s.decorAreas.length === 0) errors.decorAreas = "Select at least one area to decorate.";
    if (s.decorElements.length === 0) errors.decorElements = "Select at least one decor element.";
    if (s.decorPriorities.length === 0)
      errors.decorPriorities = `Pick your top ${DECOR_PRIORITY_MAX} priorities (at least one).`;
    if (s.floralPrefs.length === 0) errors.floralPrefs = "Select at least one floral style.";
    return errors;
  }

  if (!s.budget) errors.budget = "Please select a budget range.";
  if (!s.fullName.trim()) errors.fullName = "Full name is required.";
  if (!s.whatsapp.trim()) errors.whatsapp = "WhatsApp number is required.";
  else if (!isValidPhone(s.whatsapp)) errors.whatsapp = "Enter a valid phone number (digits only, 7–15 numbers).";

  return errors;
}

function hasErrors(errors: StepErrors) {
  return Object.keys(errors).length > 0;
}

function firstErrorField(stepIndex: number, stepErrors: StepErrors): FieldKey | null {
  const order = STEP_FIELD_ORDER[stepIndex];
  if (!order) return null;
  return order.find((key) => stepErrors[key]) ?? null;
}

function scrollToFormTarget(
  formRoot: HTMLElement | null,
  fieldsRoot: HTMLElement | null,
  target: ScrollTarget,
) {
  if (typeof window === "undefined") return;

  if (target === "form-top") {
    (fieldsRoot ?? formRoot)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const scope = formRoot ?? document;
  const fieldEl = scope.querySelector(`[data-field="${target}"]`);
  if (fieldEl instanceof HTMLElement) {
    fieldEl.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = fieldEl.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])',
    );
    focusable?.focus({ preventScroll: true });
    return;
  }

  (fieldsRoot ?? formRoot)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function FieldLabel({
  children,
  hint,
  required,
}: {
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/80">
        {children}
        {required ? <span className="ml-1 text-[var(--color-gold)]">*</span> : null}
      </p>
      {hint ? <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">{hint}</p> : null}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

function ChoiceGrid({
  options,
  selected,
  onToggle,
  invalid,
  single = false,
}: {
  options: readonly string[];
  selected: string | string[];
  onToggle: (item: string) => void;
  invalid?: boolean;
  single?: boolean;
}) {
  const isOn = (item: string) =>
    single ? selected === item : Array.isArray(selected) && selected.includes(item);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((item) => (
        <ChoiceCard key={item} selected={isOn(item)} invalid={invalid} onClick={() => onToggle(item)}>
          {item}
        </ChoiceCard>
      ))}
    </div>
  );
}

function ChoiceCard({
  selected,
  onClick,
  invalid,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "border px-4 py-3 text-left text-sm font-medium transition",
        selected
          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/8 text-black ring-1 ring-[var(--color-gold)]/50"
          : invalid
            ? "border-red-300 bg-red-50/60 text-black/70 hover:border-red-400"
            : "border-black/10 bg-white text-black/75 shadow-sm ring-1 ring-black/5 hover:border-black/20 hover:bg-[var(--color-surface-raised)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TextField({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
  rows,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  rows?: number;
}) {
  const base =
    "w-full border bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:ring-1";
  const state = error
    ? "border-red-400 focus:border-red-400 focus:ring-red-300/50"
    : "border-black/12 focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]/35";

  if (rows != null) {
    return (
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`${base} ${state} resize-y ${className}`}
      />
    );
  }

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      className={`${base} ${state} ${className}`}
    />
  );
}

type EventQuestionnaireProps = {
  variant?: "page" | "embedded";
};

export function EventQuestionnaire({ variant = "page" }: EventQuestionnaireProps) {
  const embedded = variant === "embedded";
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [s, setS] = useState<QState>(emptyQState);
  const [errors, setErrors] = useState<StepErrors>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  /** Contact from last successful PDF — kept so WhatsApp still works after the form resets */
  const [submittedContact, setSubmittedContact] = useState<{ fullName: string; whatsapp: string } | null>(
    null,
  );
  const formStepAnchorRef = useRef<HTMLDivElement>(null);
  const formFieldsRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<ScrollTarget | null>(null);

  const queueScroll = useCallback((target: ScrollTarget) => {
    pendingScrollRef.current = target;
  }, []);

  useLayoutEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) return;
    pendingScrollRef.current = null;
    scrollToFormTarget(formStepAnchorRef.current, formFieldsRef.current, target);
  }, [step, errors]);

  const patch = useCallback(<K extends keyof QState>(key: K, value: QState[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as FieldKey]) return prev;
      const next = { ...prev };
      delete next[key as FieldKey];
      return next;
    });
  }, []);

  const toggleArr = useCallback((key: ArrayFieldKey, id: string, max?: number) => {
    setS((prev) => {
      const arr = prev[key];
      const has = arr.includes(id);
      if (has) return { ...prev, [key]: arr.filter((x) => x !== id) };
      if (max != null && arr.length >= max) return prev;
      return { ...prev, [key]: [...arr, id] };
    });
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const goToStep = useCallback(
    (target: number) => {
      if (target === step) return;

      if (target < step) {
        setErrors({});
        setStep(target);
        return;
      }

      if (target > furthestStep) return;

      if (target > step + 1) {
        setErrors({});
        setStep(target);
        return;
      }

      const stepErrors = validateStep(step, s);
      if (hasErrors(stepErrors)) {
        setErrors(stepErrors);
        queueScroll(firstErrorField(step, stepErrors) ?? "form-top");
        return;
      }

      setErrors({});
      setStep(target);
    },
    [step, furthestStep, s, queueScroll],
  );

  const handleContinue = useCallback(() => {
    const stepErrors = validateStep(step, s);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      queueScroll(firstErrorField(step, stepErrors) ?? "form-top");
      return;
    }

    setErrors({});
    const next = Math.min(STEPS.length - 1, step + 1);
    setFurthestStep((prev) => Math.max(prev, next));
    queueScroll("form-top");
    setStep(next);
  }, [step, s, queueScroll]);

  const openWhatsappWithPdf = useCallback(() => {
    if (!pdfReady || !submittedContact) {
      setPdfError("Generate the PDF first, then attach it in WhatsApp.");
      return;
    }
    setPdfError(null);
    window.open(buildWhatsappSendPdfHref({ ...emptyQState(), ...submittedContact }), "_blank", "noopener,noreferrer");
  }, [pdfReady, submittedContact]);

  const handleGenerateVision = useCallback(async () => {
    setPdfError(null);
    setPdfReady(false);
    const stepErrors = validateStep(2, s);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      queueScroll(firstErrorField(2, stepErrors) ?? "form-top");
      setPdfError("Please complete the required fields before generating your brief.");
      return;
    }
    setPdfLoading(true);
    try {
      const blob = await buildQuestionnairePdfBlob(s);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultPdfFilename();
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSubmittedContact({
        fullName: s.fullName.trim(),
        whatsapp: s.whatsapp.trim(),
      });
      setS(emptyQState());
      setStep(0);
      setFurthestStep(0);
      setErrors({});
      setPdfReady(true);
      queueScroll("form-top");
    } catch (err) {
      console.error(err);
      setPdfError("We couldn’t create the PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }, [s, queueScroll]);

  const stepInvalid = Object.keys(errors).length > 0;

  return (
    <motion.div
      className={embedded ? "relative" : "relative min-h-screen bg-[var(--color-surface)] pb-24 pt-[max(6.5rem,env(safe-area-inset-top)+5.5rem)] sm:pt-[max(7.5rem,env(safe-area-inset-top)+6rem)]"}
    >
      <div className={`relative w-full ${embedded ? "" : "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"}`}>
        {!embedded ? (
          <header className="mb-12 text-center md:text-left">
            <p
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-none text-black/80"
              style={{
                fontFamily:
                  "ui-script, 'Brush Script MT', 'Segoe Script', 'Apple Chancery', cursive",
              }}
            >
              Your event brief
            </p>
            <h1 className="mt-3 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-cream)] sm:text-sm">
              Event styling questionnaire
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base md:max-w-2xl">
              Three steps — tell us about your event, decor vision, and how to reach you. We&apos;ll confirm pricing
              after a studio call.
            </p>
          </header>
        ) : null}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="min-w-0"
          noValidate
        >
          <motion.div
            ref={formStepAnchorRef}
            className="scroll-mt-[max(5.75rem,env(safe-area-inset-top)+4.75rem)] lg:scroll-mt-0"
          >
            <nav aria-label="Form steps" className="mb-8">
              <ol className="grid grid-cols-3 gap-0 border border-black/10 bg-white shadow-sm ring-1 ring-black/5">
                {STEPS.map((st, i) => {
                  const done = i < step;
                  const active = i === step;
                  const reachable = i <= furthestStep;
                  return (
                    <li key={st.id} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => goToStep(i)}
                        disabled={!reachable && i > step}
                        aria-current={active ? "step" : undefined}
                        className={[
                          "flex w-full flex-col items-start gap-1 border-r border-black/10 px-3 py-4 text-left transition last:border-r-0 sm:px-5 sm:py-5",
                          active
                            ? "bg-[var(--color-surface-raised)]"
                            : reachable
                              ? "hover:bg-[var(--color-surface-raised)]/70"
                              : "cursor-not-allowed opacity-45",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "text-[0.6rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.65rem]",
                            active ? "text-[var(--color-gold)]" : "text-black/45",
                          ].join(" ")}
                        >
                          Step {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-black/85 sm:text-sm">{st.title}</span>
                        {done ? (
                          <span className="text-[0.65rem] font-medium text-[var(--color-gold)]">Complete</span>
                        ) : active ? (
                          <span className="text-[0.65rem] text-[var(--color-muted)]">In progress</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {pdfError || pdfReady ? (
              <div className="mb-6 space-y-3" role="status" aria-live="polite">
                {pdfError ? (
                  <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {pdfError}
                  </p>
                ) : null}
                {pdfReady ? (
                  <div className="border border-[var(--color-gold)]/35 bg-[var(--color-gold)]/10 px-4 py-4 sm:px-5">
                    <p className="text-sm leading-relaxed text-black/80">
                      PDF downloaded and the form has been cleared. Attach{" "}
                      <span className="font-mono text-black">{defaultPdfFilename()}</span> in WhatsApp, or start a new
                      brief below.
                    </p>
                    {submittedContact ? (
                      <button
                        type="button"
                        onClick={openWhatsappWithPdf}
                        className={`mt-3 ${btnSecondaryClass}`}
                      >
                        Send to Kamelia on WhatsApp
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
              <div className="mb-8 border-b border-black/8 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)]">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-medium text-black sm:text-[1.65rem]">
                  {STEPS[step].title}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  ref={formFieldsRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="scroll-mt-[max(5.75rem,env(safe-area-inset-top)+4.75rem)] space-y-10 lg:scroll-mt-0"
                >
                  {step === 0 && (
                    <>
                      <div data-field="eventType">
                        <FieldLabel hint="What type of event are you planning?" required>
                          Event type
                        </FieldLabel>
                        <ChoiceGrid
                          options={EVENT_TYPES}
                          selected={s.eventType}
                          onToggle={(t) => patch("eventType", t)}
                          invalid={Boolean(errors.eventType)}
                          single
                        />
                        <FieldError message={errors.eventType} />
                      </div>

                      <div data-field="eventDate">
                        <FieldLabel hint="When is your event?" required>
                          Event date
                        </FieldLabel>
                        <TextField
                          id="event-date"
                          type="date"
                          value={s.eventDate}
                          onChange={(v) => patch("eventDate", v)}
                          error={errors.eventDate}
                        />
                        <FieldError message={errors.eventDate} />
                      </div>

                      <div className="grid gap-8 sm:grid-cols-2">
                        <div data-field="eventTime">
                          <FieldLabel required>Event time</FieldLabel>
                          <ChoiceGrid
                            options={EVENT_TIMES}
                            selected={s.eventTime}
                            onToggle={(t) => patch("eventTime", t)}
                            invalid={Boolean(errors.eventTime)}
                            single
                          />
                          <FieldError message={errors.eventTime} />
                        </div>
                        <div data-field="guestCount">
                          <FieldLabel hint="Approximate number of guests" required>
                            Guest count
                          </FieldLabel>
                          <ChoiceGrid
                            options={GUEST_RANGES}
                            selected={s.guestCount}
                            onToggle={(t) => patch("guestCount", t)}
                            invalid={Boolean(errors.guestCount)}
                            single
                          />
                          <FieldError message={errors.guestCount} />
                        </div>
                      </div>

                      <div>
                        <FieldLabel hint="Where will the event take place?" required>
                          Venue
                        </FieldLabel>
                        <div data-field="venueName">
                          <TextField
                            id="venue-name"
                            value={s.venueName}
                            onChange={(v) => patch("venueName", v)}
                            placeholder="Venue name"
                            error={errors.venueName}
                          />
                          <FieldError message={errors.venueName} />
                        </div>
                        <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/70">
                          Setting
                        </p>
                        <div data-field="venueSetting">
                        <div className="flex flex-wrap gap-2">
                          {VENUE_SETTINGS.map((v) => (
                            <ChoiceCard
                              key={v}
                              selected={s.venueSetting === v}
                              invalid={Boolean(errors.venueSetting)}
                              onClick={() => patch("venueSetting", v)}
                            >
                              {v}
                            </ChoiceCard>
                          ))}
                        </div>
                          <FieldError message={errors.venueSetting} />
                        </div>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div data-field="themeStyle">
                        <FieldLabel hint="Overall mood and styling direction" required>
                          Theme & style
                        </FieldLabel>
                        <ChoiceGrid
                          options={THEME_STYLES}
                          selected={s.themeStyle}
                          onToggle={(t) => patch("themeStyle", t)}
                          invalid={Boolean(errors.themeStyle)}
                          single
                        />
                        <FieldError message={errors.themeStyle} />
                      </div>

                      <div data-field="colors">
                        <FieldLabel
                          hint="Choose one or more tones — hex values are shown under each swatch."
                          required
                        >
                          Color palette
                        </FieldLabel>
                        <div className="flex flex-wrap gap-2.5">
                          {COLOR_SWATCHES.map((c) => {
                            const on = s.colors.includes(c.id);
                            const isMixed = c.id === "mixed";
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => toggleArr("colors", c.id)}
                                aria-pressed={on}
                                className={[
                                  "flex flex-col items-center gap-1 border p-2 transition",
                                  on
                                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/8 ring-1 ring-[var(--color-gold)]/45"
                                    : errors.colors
                                      ? "border-red-300 bg-red-50/50 ring-1 ring-red-200"
                                      : "border-black/10 bg-white ring-1 ring-black/5 hover:border-black/20",
                                ].join(" ")}
                              >
                                <span
                                  className="h-10 w-10 rounded-full border border-black/10 shadow-inner sm:h-11 sm:w-11"
                                  style={
                                    isMixed
                                      ? {
                                          background:
                                            "linear-gradient(135deg,#e8b4b8,#c9a962,#6b4c9a,#0d5c4d)",
                                        }
                                      : { backgroundColor: c.hex }
                                  }
                                />
                                <span className="max-w-[5.5rem] text-center text-[0.65rem] font-medium leading-tight text-black/75">
                                  {c.label}
                                </span>
                                <span className="max-w-[5.5rem] text-center font-mono text-[0.55rem] leading-tight text-black/40">
                                  {isMixed ? "—" : c.hex.toUpperCase()}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <FieldError message={errors.colors} />
                      </div>
                      <div data-field="decorAreas">
                        <FieldLabel hint="Which spaces should we style?" required>
                          Areas to decorate
                        </FieldLabel>
                        <ChoiceGrid
                          options={DECOR_AREAS}
                          selected={s.decorAreas}
                          onToggle={(t) => toggleArr("decorAreas", t)}
                          invalid={Boolean(errors.decorAreas)}
                        />
                        <FieldError message={errors.decorAreas} />
                      </div>

                      <div data-field="decorElements">
                        <FieldLabel hint="Props, lighting, and styling elements" required>
                          Decor elements
                        </FieldLabel>
                        <ChoiceGrid
                          options={DECOR_ELEMENTS}
                          selected={s.decorElements}
                          onToggle={(t) => toggleArr("decorElements", t)}
                          invalid={Boolean(errors.decorElements)}
                        />
                        <FieldError message={errors.decorElements} />
                      </div>

                      <div data-field="decorPriorities">
                        <FieldLabel hint={`Choose up to ${DECOR_PRIORITY_MAX} — what matters most if budget is tight?`} required>
                          Top priorities
                        </FieldLabel>
                        <ChoiceGrid
                          options={DECOR_AREAS}
                          selected={s.decorPriorities}
                          onToggle={(t) => toggleArr("decorPriorities", t, DECOR_PRIORITY_MAX)}
                          invalid={Boolean(errors.decorPriorities)}
                        />
                        <FieldError message={errors.decorPriorities} />
                      </div>


                      <div data-field="floralPrefs">
                        <FieldLabel hint="What floral style do you prefer?" required>
                          Floral preference
                        </FieldLabel>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {FLORAL_PREFS.map((f) => (
                            <ChoiceCard
                              key={f}
                              selected={s.floralPrefs.includes(f)}
                              invalid={Boolean(errors.floralPrefs)}
                              onClick={() => toggleArr("floralPrefs", f)}
                            >
                              {f}
                            </ChoiceCard>
                          ))}
                        </div>
                        <FieldError message={errors.floralPrefs} />
                      </div>

                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div data-field="budget">
                        <FieldLabel hint="What is your estimated decor budget?" required>
                          Budget range
                        </FieldLabel>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {BUDGET_RANGES.map((b) => (
                            <ChoiceCard
                              key={b}
                              selected={s.budget === b}
                              invalid={Boolean(errors.budget)}
                              onClick={() => patch("budget", b)}
                            >
                              {b}
                            </ChoiceCard>
                          ))}
                        </div>
                        <FieldError message={errors.budget} />
                      </div>
                      <div>
                        <FieldLabel hint="What should guests remember when they walk in?">
                          Signature moment
                        </FieldLabel>
                        <TextField
                          id="memorable-moment"
                          rows={3}
                          value={s.memorableMoment}
                          onChange={(v) => patch("memorableMoment", v)}
                          placeholder="e.g. A floral tunnel entrance, dramatic ceiling install…"
                        />
                      </div>

                      <div>
                        <FieldLabel hint="Colours, symbols, ceremony traditions…">
                          Cultural or religious notes
                        </FieldLabel>
                        <TextField
                          id="cultural-notes"
                          rows={3}
                          value={s.culturalNotes}
                          onChange={(v) => patch("culturalNotes", v)}
                        />
                      </div>

                      <div>
                        <FieldLabel hint="Paste TikTok, Pinterest, or Instagram links — one per line">
                          Inspiration links
                        </FieldLabel>
                        <TextField
                          id="inspiration-links"
                          rows={4}
                          value={s.inspirationLinks}
                          onChange={(v) => patch("inspirationLinks", v)}
                          placeholder={"https://www.tiktok.com/...\nhttps://pinterest.com/..."}
                        />
                      </div>

                      <div>
                        <FieldLabel hint="Special requests, favourite flowers, cultural notes…">
                          Additional notes
                        </FieldLabel>
                        <TextField
                          id="notes"
                          rows={5}
                          value={s.notes}
                          onChange={(v) => patch("notes", v)}
                          placeholder="Tell us more about your dream setup…"
                        />
                      </div>

                      <div className="space-y-4 border-t border-black/8 pt-8">
                        <FieldLabel required>Contact information</FieldLabel>
                        <div className="space-y-4">
                          <div data-field="fullName">
                            <TextField
                              id="full-name"
                              value={s.fullName}
                              onChange={(v) => patch("fullName", v)}
                              placeholder="Full name"
                              error={errors.fullName}
                            />
                            <FieldError message={errors.fullName} />
                          </div>
                          <div data-field="whatsapp">
                            <FieldLabel
                              hint="Include country code if outside Mauritius (e.g. +230 5xxx xxxx)"
                              required
                            >
                              WhatsApp number
                            </FieldLabel>
                            <TextField
                              id="whatsapp"
                              type="tel"
                              value={s.whatsapp}
                              onChange={(v) => patch("whatsapp", v)}
                              placeholder="+230 5xxx xxxx"
                              error={errors.whatsapp}
                            />
                            <FieldError message={errors.whatsapp} />
                          </div>
                        </div>

                        <div className="border border-black/10 bg-[var(--color-surface-raised)] px-4 py-4 text-sm text-[var(--color-muted)] ring-1 ring-black/5">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/75">
                            Send in 2 steps
                          </p>
                          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
                            <li>Generate the PDF (it downloads to your device).</li>
                            <li>Open WhatsApp and attach the PDF (paperclip → Document).</li>
                          </ol>
                          <p className="mt-4 text-sm leading-relaxed text-black/75">
                            Prefer to reach us directly?{" "}
                            <a
                              href={kameliaTelHref()}
                              className="font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)]/45 underline-offset-2 hover:text-[#a88b4a]"
                            >
                              Call {KAMELIA_PHONE_DISPLAY}
                            </a>
                            {" · "}
                            <a
                              href={kameliaWhatsAppHref()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)]/45 underline-offset-2 hover:text-[#a88b4a]"
                            >
                              WhatsApp
                            </a>
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => goToStep(step - 1)}
                className={`${btnSecondaryClass} disabled:opacity-40`}
              >
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className={btnPrimaryClass}
                >
                  Continue
                </button>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                  <button
                    type="button"
                    disabled={pdfLoading}
                    onClick={() => void handleGenerateVision()}
                    className={btnPrimaryClass}
                  >
                    {pdfLoading ? "Generating…" : "Generate my vision"}
                  </button>
                  <button
                    type="button"
                    disabled={!pdfReady || !submittedContact}
                    onClick={openWhatsappWithPdf}
                    className={`${btnSecondaryClass} px-8`}
                  >
                    Send to Kamelia on WhatsApp
                  </button>
                </div>
              )}
            </div>

            {stepInvalid && step < STEPS.length - 1 ? (
              <p className="mt-4 text-sm text-[var(--color-muted)] md:text-right">
                Please complete the required fields above to continue.
              </p>
            ) : null}
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
