import { jsPDF } from "jspdf";
import { KAMELLIA_PHONE_DISPLAY, KAMELLIA_PHONE_DIGITS } from "@/data/contact";
import type { QState } from "@/data/questionnaire-q-state";

const MM_PAGE_W = 210;
const MM_PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = MM_PAGE_W - MARGIN * 2;
const BANNER_H = 50;
const FOOTER_H = 14;
const LINE = 5.2;

const BANNER_PATH = "/banner.jpeg";

const THEME = {
  gold: [201, 169, 98] as const,
  goldLight: [252, 248, 240] as const,
  text: [35, 35, 35] as const,
  muted: [120, 115, 108] as const,
};

async function fetchDataUrl(path: string): Promise<string | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function briefRef() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const seq = String(d.getTime()).slice(-5);
  return `KB-${y}${m}${day}-${seq}`;
}

function formatDisplayDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function setText(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setFill(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function drawBanner(doc: jsPDF, pageW: number, dataUrl: string | null) {
  if (dataUrl) {
    try {
      doc.addImage(dataUrl, "JPEG", 0, 0, pageW, BANNER_H);
      return;
    } catch {
      /* fall through */
    }
  }
  setFill(doc, THEME.goldLight);
  doc.rect(0, 0, pageW, BANNER_H, "F");
}

function drawDocumentMeta(doc: jsPDF, pageW: number, y: number, briefNo: string, issued: string) {
  setText(doc, THEME.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`BRIEF NO: ${briefNo}`, MARGIN, y);
  doc.text(`ISSUED: ${issued}`, pageW - MARGIN, y, { align: "right" });
  return y + LINE * 1.1;
}

function drawDocTitle(doc: jsPDF, pageW: number, y: number) {
  doc.setDrawColor(THEME.gold[0], THEME.gold[1], THEME.gold[2]);
  doc.setLineWidth(0.35);
  doc.line(MARGIN, y, pageW - MARGIN, y);
  y += LINE * 1.2;

  setText(doc, THEME.text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Event Styling Brief", MARGIN, y);
  y += LINE * 1.15;

  setText(doc, THEME.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Kamellia — The Floral Designer  ·  Client planning document", MARGIN, y);

  return y + LINE * 1.4;
}

function drawSectionTitle(doc: jsPDF, title: string, y: number) {
  setFill(doc, THEME.goldLight);
  doc.rect(MARGIN, y - 3.5, CONTENT_W, 7, "F");
  setText(doc, THEME.text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), MARGIN + 2, y + 1.5);
  return y + LINE * 1.35;
}

function drawField(doc: jsPDF, label: string, value: string, y: number, pageW: number) {
  const maxW = pageW - 2 * MARGIN;

  setText(doc, THEME.muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(label.toUpperCase(), MARGIN, y);

  setText(doc, THEME.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const lines = doc.splitTextToSize(value || "—", maxW);
  let yy = y + LINE * 0.95;
  for (const line of lines) {
    doc.text(line, MARGIN, yy);
    yy += LINE * 0.92;
  }
  return yy + LINE * 0.35;
}

function drawPageFooter(doc: jsPDF, pageW: number, pageNum: number, totalPages: number) {
  const y = MM_PAGE_H - FOOTER_H;
  setFill(doc, THEME.goldLight);
  doc.rect(0, y, pageW, FOOTER_H, "F");
  doc.setDrawColor(THEME.gold[0], THEME.gold[1], THEME.gold[2]);
  doc.setLineWidth(0.3);
  doc.line(0, y, pageW, y);

  setText(doc, THEME.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Kamellia — The Floral Designer  ·  ${KAMELLIA_PHONE_DISPLAY}`, MARGIN, y + 8.5);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - MARGIN, y + 8.5, { align: "right" });
}

/** Build event planning brief PDF (no pricing). */
export async function buildQuestionnairePdfBlob(s: QState): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const briefNo = briefRef();
  const issued = formatDisplayDate(new Date().toISOString().slice(0, 10));

  const bannerData = await fetchDataUrl(BANNER_PATH);
  drawBanner(doc, pageW, bannerData);

  let y = BANNER_H + 8;
  y = drawDocumentMeta(doc, pageW, y, briefNo, issued);
  y = drawDocTitle(doc, pageW, y);

  y = drawSectionTitle(doc, "Event details", y);
  y = drawField(doc, "Event type", s.eventType, y, pageW);
  y = drawField(doc, "Event date", formatDisplayDate(s.eventDate), y, pageW);
  y = drawField(doc, "Event time", s.eventTime, y, pageW);
  y = drawField(doc, "Venue location", s.venueName, y, pageW);
  y = drawField(doc, "Setting", s.venueSetting, y, pageW);
  y = drawField(doc, "Package", s.packageOption, y, pageW);
  if (s.specialRequests.trim()) {
    y = drawField(doc, "Special requests", s.specialRequests, y, pageW);
  }
  y = drawField(
    doc,
    "Note",
    "Transport not included. Prices may vary upon customization.",
    y,
    pageW,
  );

  y = drawSectionTitle(doc, "Contact", y);
  y = drawField(doc, "Name", s.fullName, y, pageW);
  y = drawField(doc, "Phone", s.phone, y, pageW);
  if (s.email.trim()) {
    drawField(doc, "Email", s.email, y, pageW);
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc, pageW, p, totalPages);
  }

  return doc.output("blob");
}

export function defaultPdfFilename() {
  const d = new Date();
  const stamp = d.toISOString().slice(0, 10);
  return `kamellia-event-brief-${stamp}.pdf`;
}

/** Opens WhatsApp chat with Kamellia (studio number), with a pre-filled message from the client. */
export function buildWhatsappSendPdfHref(s: QState, requestId?: string): string {
  const lines = [
    `Hi Kamellia,`,
    ``,
    ...(requestId ? [`Request ID: ${requestId}`, ``] : []),
    `I'd like to plan an event:`,
    `• Name: ${s.fullName || "—"}`,
    `• Phone: ${s.phone || "—"}`,
  ];
  if (s.email.trim()) lines.push(`• Email: ${s.email.trim()}`);
  lines.push(
    `• Type: ${s.eventType || "—"}`,
    `• Date: ${s.eventDate ? formatDisplayDate(s.eventDate) : "—"}`,
    `• Time: ${s.eventTime || "—"}`,
    `• Venue: ${s.venueName || "—"}`,
    `• Setting: ${s.venueSetting || "—"}`,
    `• Package: ${s.packageOption || "—"}`,
  );
  if (s.specialRequests.trim()) {
    lines.push(`• Special requests: ${s.specialRequests.trim()}`);
  }
  return `https://wa.me/${KAMELLIA_PHONE_DIGITS}?text=${encodeURIComponent(lines.join("\n"))}`;
}
