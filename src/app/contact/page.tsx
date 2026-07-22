import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { btnPrimaryClass } from "@/lib/button-classes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan your event — Kamellia",
  description: "Plan your event with Kamellia. The event questionnaire lives on our homepage.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <Navbar />
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 py-28 text-center sm:py-36">
        <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-[var(--color-gold)]">
          Kamellia
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-cream)] sm:text-3xl">
          Plan your event
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          The full event styling questionnaire is on our homepage under{" "}
          <span className="text-[var(--color-gold)]/90">Plan your event</span>. Build your brief, see
          indicative pricing, and send your details in one flow.
        </p>
        <Link href="/#contact" className={`mt-2 ${btnPrimaryClass}`}>
          Open questionnaire
        </Link>
      </div>
      <Footer />
    </main>
  );
}
