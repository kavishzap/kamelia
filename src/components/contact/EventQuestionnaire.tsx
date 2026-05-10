"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BUDGET_RANGES,
  COLOR_SWATCHES,
  DECOR_ELEMENTS,
  EVENT_TYPES,
  FLORAL_PREFS,
  GUEST_RANGES,
  STAGE_TYPES,
  THEME_STYLES,
  VENUE_SETTINGS,
} from "@/data/event-questionnaire";
import type { QState } from "@/data/questionnaire-q-state";
import {
  buildQuestionnairePdfBlob,
  buildWhatsappSendPdfHref,
  defaultPdfFilename,
} from "@/lib/generateQuestionnairePdf";

export type { QState } from "@/data/questionnaire-q-state";

const initialState: QState = {
  eventType: "",
  eventDate: "",
  eventTime: "",
  venueName: "",
  venueSetting: "",
  city: "",
  guestCount: "",
  themeStyle: "",
  colors: [],
  floralPrefs: [],
  stageType: "",
  decorElements: [],
  budget: "",
  inspirationLinks: "",
  notes: "",
  fullName: "",
  phone: "",
  whatsapp: "",
  email: "",
};

const STEPS = [
  { id: 0, title: "Event & venue", short: "Event" },
  { id: 1, title: "Design style", short: "Design" },
  { id: 2, title: "Stage & decor", short: "Stage" },
  { id: 3, title: "Budget & ideas", short: "Budget" },
  { id: 4, title: "Your details", short: "Contact" },
] as const;

function estimateRs(s: QState): number {
  let n = 22_500;
  if (s.eventType) n += 4_200;
  if (s.guestCount === "50–100") n += 6_500;
  if (s.guestCount === "100–200") n += 14_000;
  if (s.guestCount === "200–500") n += 28_000;
  if (s.guestCount === "500+") n += 48_000;
  if (s.themeStyle) n += 8_800;
  n += s.colors.length * 950;
  n += s.floralPrefs.length * 2_400;
  n += s.decorElements.length * 1_900;
  if (s.stageType) n += 6_200;
  if (s.venueSetting === "Outdoor") n += 5_500;
  if (s.budget.includes("30,000")) n = Math.max(n, 32_000);
  if (s.budget.includes("60,000")) n = Math.max(n, 62_000);
  if (s.budget.includes("15,000")) n = Math.max(n, 18_000);
  return Math.round(n / 500) * 500;
}

function formatRs(n: number) {
  return n.toLocaleString("en-MU");
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold text-[#f5f0e8]">{children}</p>
      {hint ? <p className="mt-0.5 text-xs text-[#9a948a]">{hint}</p> : null}
    </div>
  );
}

function ChoiceCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
        selected
          ? "border-[#c9a962] bg-[#c9a962]/15 text-[#f5f0e8] ring-2 ring-[#c9a962]/40"
          : "border-white/[0.1] bg-[#141414] text-[#c4beb4] hover:border-[#c9a962]/35 hover:bg-[#1a1a1a]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

const MQ_MOBILE_FORM_SCROLL = "(max-width: 1023px)";
/** Same placeholder as ContactSection WhatsApp — update to studio number */
const WHATSAPP_FALLBACK_DIGITS = "15551234567";

type EventQuestionnaireProps = {
  /** Full `/contact` page vs home `#contact` section */
  variant?: "page" | "embedded";
};

export function EventQuestionnaire({ variant = "page" }: EventQuestionnaireProps) {
  const embedded = variant === "embedded";
  const [step, setStep] = useState(0);
  const [s, setS] = useState<QState>(initialState);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const formStepAnchorRef = useRef<HTMLDivElement>(null);
  const scrollToFormTopAfterContinueRef = useRef(false);

  useLayoutEffect(() => {
    if (!scrollToFormTopAfterContinueRef.current) return;
    scrollToFormTopAfterContinueRef.current = false;
    if (typeof window === "undefined") return;
    if (!window.matchMedia(MQ_MOBILE_FORM_SCROLL).matches) return;
    formStepAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const patch = useCallback(<K extends keyof QState>(key: K, value: QState[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArr = useCallback((key: "colors" | "floralPrefs" | "decorElements", id: string) => {
    setS((prev) => {
      const arr = prev[key];
      const has = arr.includes(id);
      return { ...prev, [key]: has ? arr.filter((x) => x !== id) : [...arr, id] };
    });
  }, []);

  const total = useMemo(() => estimateRs(s), [s]);

  const cartLines = useMemo(() => {
    const lines: { label: string; amount: number }[] = [];
    lines.push({ label: "Studio base & on-site coordination", amount: 22_500 });
    if (s.eventType) lines.push({ label: `Event type · ${s.eventType}`, amount: 4_200 });
    if (s.guestCount === "50–100") lines.push({ label: `Guest scale · ${s.guestCount}`, amount: 6_500 });
    if (s.guestCount === "100–200") lines.push({ label: `Guest scale · ${s.guestCount}`, amount: 14_000 });
    if (s.guestCount === "200–500") lines.push({ label: `Guest scale · ${s.guestCount}`, amount: 28_000 });
    if (s.guestCount === "500+") lines.push({ label: `Guest scale · ${s.guestCount}`, amount: 48_000 });
    if (s.venueSetting === "Outdoor") lines.push({ label: "Outdoor logistics & wind plan", amount: 5_500 });
    if (s.themeStyle) lines.push({ label: `Theme direction · ${s.themeStyle}`, amount: 8_800 });
    if (s.colors.length) lines.push({ label: `Palette (${s.colors.length} tones)`, amount: s.colors.length * 950 });
    if (s.floralPrefs.length) lines.push({ label: `Floral scope (${s.floralPrefs.length})`, amount: s.floralPrefs.length * 2_400 });
    if (s.decorElements.length) lines.push({ label: `Decor pieces (${s.decorElements.length})`, amount: s.decorElements.length * 1_900 });
    if (s.stageType) lines.push({ label: `Stage · ${s.stageType}`, amount: 6_200 });
    const sum = lines.reduce((a, b) => a + b.amount, 0);
    const diff = total - sum;
    if (diff > 0 && lines.length) {
      lines.push({ label: "Budget tier & seasonality alignment", amount: diff });
    }
    return lines;
  }, [s, total]);

  const handleGenerateVision = useCallback(async () => {
    setPdfError(null);
    if (!s.fullName.trim() || !s.email.trim()) {
      setPdfError("Please fill in your full name and email before generating.");
      return;
    }
    setPdfLoading(true);
    try {
      const blob = await buildQuestionnairePdfBlob(s, cartLines, total, formatRs);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultPdfFilename();
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setPdfReady(true);
    } catch (err) {
      console.error(err);
      setPdfError("We couldn’t create the PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }, [s, cartLines, total]);

  return (
    <div
      className={
        embedded
          ? "relative pb-16 pt-2"
          : "relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f0f0f] pb-24 pt-[max(6.5rem,env(safe-area-inset-top)+5.5rem)] sm:pt-[max(7.5rem,env(safe-area-inset-top)+6rem)] lg:pt-[max(8.5rem,env(safe-area-inset-top)+6.5rem)]"
      }
    >
      {!embedded ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(201,169,98,0.1),transparent_45%)]" />
      ) : null}
      <div className={`relative mx-auto max-w-7xl ${embedded ? "" : "px-4 sm:px-6 lg:px-8"}`}>
        {!embedded ? (
          <header className="mb-10 text-center lg:mb-12 lg:mt-2">
            <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[#c9a962]">
              Kamelia
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#f5f0e8] sm:text-4xl">
              Event Styling Questionnaire
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#9a948a] sm:text-base">
              Build your brief like a cart — each choice updates your indicative decor estimate (sample pricing
              only; we&apos;ll confirm after a studio call).
            </p>
          </header>
        ) : null}

        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_min(380px,34%)] lg:items-start lg:gap-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="min-w-0 space-y-8"
          >
            <div
              ref={formStepAnchorRef}
              className="scroll-mt-[max(5.75rem,env(safe-area-inset-top)+4.75rem)] space-y-8 lg:scroll-mt-0"
            >
              <nav className="flex flex-wrap justify-center gap-2 sm:justify-start" aria-label="Steps">
                {STEPS.map((st, i) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStep(i)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition sm:text-sm",
                      step === i
                        ? "bg-[#c9a962] text-[#0a0a0a]"
                        : i < step
                          ? "border border-[#c9a962]/40 text-[#c9a962]"
                          : "border border-white/10 text-[#9a948a] hover:border-white/20",
                    ].join(" ")}
                  >
                    {i + 1}. {st.short}
                  </button>
                ))}
              </nav>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-white/[0.08] bg-[#0f0f0f]/90 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)] sm:p-8"
                >
                {step === 0 && (
                  <div className="space-y-8">
                    <div>
                      <FieldLabel hint="What type of event are you planning?">1. Event type</FieldLabel>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {EVENT_TYPES.map((t) => (
                          <ChoiceCard key={t} selected={s.eventType === t} onClick={() => patch("eventType", t)}>
                            {t}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <FieldLabel hint="When is your event?">2. Event date</FieldLabel>
                        <input
                          type="date"
                          value={s.eventDate}
                          onChange={(e) => patch("eventDate", e.target.value)}
                          className="w-full rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-[#f5f0e8] outline-none focus:ring-2 focus:ring-[#c9a962]/50"
                        />
                      </div>
                      <div>
                        <FieldLabel hint="Start time (approx.)">Time</FieldLabel>
                        <input
                          type="time"
                          value={s.eventTime}
                          onChange={(e) => patch("eventTime", e.target.value)}
                          className="w-full rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-[#f5f0e8] outline-none focus:ring-2 focus:ring-[#c9a962]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel hint="Where will the event take place?">3. Venue information</FieldLabel>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Venue name"
                          value={s.venueName}
                          onChange={(e) => patch("venueName", e.target.value)}
                          className="rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50"
                        />
                        <input
                          type="text"
                          placeholder="City / region"
                          value={s.city}
                          onChange={(e) => patch("city", e.target.value)}
                          className="rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50"
                        />
                      </div>
                      <p className="mt-3 text-xs text-[#9a948a]">Indoor / outdoor</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {VENUE_SETTINGS.map((v) => (
                          <ChoiceCard
                            key={v}
                            selected={s.venueSetting === v}
                            onClick={() => patch("venueSetting", v)}
                          >
                            {v}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                    <div>
                      <FieldLabel hint="How many guests are expected?">4. Estimated guest count</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {GUEST_RANGES.map((g) => (
                          <ChoiceCard key={g} selected={s.guestCount === g} onClick={() => patch("guestCount", g)}>
                            {g}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <FieldLabel hint="What style do you want?">5. Preferred theme style</FieldLabel>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {THEME_STYLES.map((t) => (
                          <ChoiceCard key={t} selected={s.themeStyle === t} onClick={() => patch("themeStyle", t)}>
                            {t}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                    <div>
                      <FieldLabel hint="What colors would you like? Multi-select — hex is shown under each swatch.">
                        6. Color palette
                      </FieldLabel>
                      <div className="flex flex-wrap gap-3">
                        {COLOR_SWATCHES.map((c) => {
                          const on = s.colors.includes(c.id);
                          const isMixed = c.id === "mixed";
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleArr("colors", c.id)}
                              className={[
                                "flex flex-col items-center gap-1 rounded-2xl border p-2 transition",
                                on ? "border-[#c9a962] ring-2 ring-[#c9a962]/40" : "border-white/10 hover:border-[#c9a962]/30",
                              ].join(" ")}
                            >
                              <span
                                className="h-10 w-10 rounded-full border border-white/20 shadow-inner sm:h-11 sm:w-11"
                                style={
                                  isMixed
                                    ? {
                                        background:
                                          "linear-gradient(135deg,#e8b4b8,#c9a962,#6b4c9a,#0d5c4d)",
                                      }
                                    : { backgroundColor: c.hex }
                                }
                              />
                              <span className="max-w-[5.5rem] text-center text-[0.65rem] font-medium leading-tight text-[#c4beb4]">
                                {c.label}
                              </span>
                              <span className="max-w-[5.5rem] text-center font-mono text-[0.55rem] leading-tight text-[#6b665c]">
                                {isMixed ? "—" : c.hex.toUpperCase()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <FieldLabel hint="What floral style do you prefer?">6. Floral preference</FieldLabel>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {FLORAL_PREFS.map((f) => (
                          <ChoiceCard
                            key={f}
                            selected={s.floralPrefs.includes(f)}
                            onClick={() => toggleArr("floralPrefs", f)}
                          >
                            {f}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <FieldLabel hint="What kind of stage setup do you want?">7. Stage type</FieldLabel>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {STAGE_TYPES.map((t) => (
                          <ChoiceCard key={t} selected={s.stageType === t} onClick={() => patch("stageType", t)}>
                            {t}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                    <div>
                      <FieldLabel hint="What elements would you like included?">8. Decor elements</FieldLabel>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {DECOR_ELEMENTS.map((d) => (
                          <ChoiceCard
                            key={d}
                            selected={s.decorElements.includes(d)}
                            onClick={() => toggleArr("decorElements", d)}
                          >
                            {d}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <FieldLabel hint="What is your estimated decor budget?">9. Budget range</FieldLabel>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {BUDGET_RANGES.map((b) => (
                          <ChoiceCard key={b} selected={s.budget === b} onClick={() => patch("budget", b)}>
                            {b}
                          </ChoiceCard>
                        ))}
                      </div>
                    </div>
                    <div>
                      <FieldLabel hint="Paste TikTok, Pinterest, or Instagram links — one per line">
                        10. Inspiration links
                      </FieldLabel>
                      <textarea
                        rows={4}
                        value={s.inspirationLinks}
                        onChange={(e) => patch("inspirationLinks", e.target.value)}
                        placeholder="https://www.tiktok.com/...&#10;https://pinterest.com/..."
                        className="w-full resize-y rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Special requests, favourite flowers, cultural notes…">
                        11. Additional notes
                      </FieldLabel>
                      <textarea
                        rows={5}
                        value={s.notes}
                        onChange={(e) => patch("notes", e.target.value)}
                        className="w-full resize-y rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50"
                        placeholder="Tell us more about your dream setup…"
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <FieldLabel>12. Contact information</FieldLabel>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        required
                        type="text"
                        placeholder="Full name *"
                        value={s.fullName}
                        onChange={(e) => patch("fullName", e.target.value)}
                        className="rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50 sm:col-span-2"
                      />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={s.phone}
                        onChange={(e) => patch("phone", e.target.value)}
                        className="rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp number"
                        value={s.whatsapp}
                        onChange={(e) => patch("whatsapp", e.target.value)}
                        className="rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email *"
                        value={s.email}
                        onChange={(e) => patch("email", e.target.value)}
                        className="rounded-xl border border-white/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] placeholder:text-[#6b665c] focus:ring-2 focus:ring-[#c9a962]/50 sm:col-span-2"
                      />
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-[#141414] px-4 py-3 text-sm text-[#9a948a]">
                      <p className="font-medium text-[#e8d9b4]">Finish in two steps</p>
                      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed sm:text-sm">
                        <li>
                          Tap <span className="text-[#c9a962]">Generate my vision</span> — your answers download as a
                          PDF (check your Downloads folder).
                        </li>
                        <li>
                          Tap <span className="text-[#c9a962]">Send this PDF to Kamelia</span> — WhatsApp opens. Use
                          the <strong className="text-[#f5f0e8]">paperclip</strong> →{" "}
                          <strong className="text-[#f5f0e8]">Document</strong> and choose that PDF before you send.
                        </li>
                      </ol>
                    </div>
                    {pdfError ? (
                      <p className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-2 text-sm text-red-200/90">
                        {pdfError}
                      </p>
                    ) : null}
                    {pdfReady ? (
                      <p className="rounded-xl border border-[#c9a962]/40 bg-[#c9a962]/10 px-4 py-3 text-sm text-[#e8d9b4]">
                        PDF ready — if the download didn&apos;t start, generate again. When you send on WhatsApp,
                        remember to attach <span className="font-mono text-[#f5f0e8]">{defaultPdfFilename()}</span>.
                      </p>
                    ) : null}
                  </div>
                )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((x) => Math.max(0, x - 1))}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#f5f0e8] transition hover:border-[#c9a962]/50 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    scrollToFormTopAfterContinueRef.current = true;
                    setStep((x) => Math.min(STEPS.length - 1, x + 1));
                  }}
                  className="rounded-full bg-[#c9a962] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#d4bc7a]"
                >
                  Continue
                </button>
              ) : (
                <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                  <button
                    type="button"
                    disabled={pdfLoading}
                    onClick={() => void handleGenerateVision()}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-[#c9a962] to-[#a88b4a] px-6 py-3 text-sm font-bold text-[#0a0a0a] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {pdfLoading ? "Generating…" : "Generate my vision"}
                  </button>
                  <button
                    type="button"
                    disabled={!pdfReady}
                    onClick={() => {
                      if (!pdfReady) {
                        setPdfError("Generate the PDF first, then attach it in WhatsApp.");
                        return;
                      }
                      window.open(buildWhatsappSendPdfHref(s, WHATSAPP_FALLBACK_DIGITS), "_blank", "noopener,noreferrer");
                    }}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[#c9a962] bg-transparent px-6 py-3 text-sm font-bold text-[#c9a962] transition hover:bg-[#c9a962]/10 disabled:cursor-not-allowed disabled:border-white/15 disabled:text-[#6b665c]"
                  >
                    Send this PDF to Kamelia
                  </button>
                </div>
              )}
            </div>
          </form>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-[#c9a962]/25 bg-[#121212] p-6 shadow-[0_0_0_1px_rgba(201,169,98,0.06)]">
              <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.28em] text-[#c9a962]">
                Your brief
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[#f5f0e8]">
                Order-style estimate
              </h2>
              <p className="mt-1 text-xs text-[#9a948a]">Indicative decor build from your selections (sample Rs).</p>

              <ul className="mt-5 max-h-[min(42vh,320px)] space-y-2 overflow-y-auto border-t border-white/10 pt-4 text-sm">
                {cartLines.map((line) => (
                  <li key={line.label} className="flex justify-between gap-3 text-[#c4beb4]">
                    <span className="min-w-0 flex-1 leading-snug">{line.label}</span>
                    <span className="shrink-0 font-medium tabular-nums text-[#e8d9b4]">Rs {formatRs(line.amount)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-[#c9a962]/30 pt-4">
                <div className="flex items-end justify-between gap-3">
                  <span className="text-sm font-medium text-[#9a948a]">Estimated total</span>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#c9a962]">
                    Rs {formatRs(total)}
                  </span>
                </div>
                <p className="mt-2 text-[0.65rem] leading-relaxed text-[#6b665c]">
                  Final quotes depend on venue survey, seasonality, and fresh-market stem costs.
                </p>
              </div>

              <div className="mt-6 rounded-xl bg-[#0a0a0a] p-4 text-xs text-[#9a948a]">
                <p className="font-semibold text-[#c9a962]/90">Quick recap</p>
                <p className="mt-2 leading-relaxed">
                  {s.eventType || "—"} · {s.guestCount || "Guests TBD"} · {s.themeStyle || "Theme TBD"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
