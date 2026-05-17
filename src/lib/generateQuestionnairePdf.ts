import { jsPDF } from "jspdf";
import { KAMELIA_PHONE_DISPLAY, KAMELIA_PHONE_DIGITS } from "@/data/contact";
import { COLOR_SWATCHES, type ColorSwatch } from "@/data/event-questionnaire";
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
  line: [230, 225, 218] as const,
  white: [255, 255, 255] as const,
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
  if (!iso) return "—";
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  if (h.length !== 6) return [200, 200, 200];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function setFill(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function setText(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function ensureSpace(doc: jsPDF, y: number, need: number): number {
  const bottom = MM_PAGE_H - FOOTER_H - 6;
  if (y + need > bottom) {
    doc.addPage();
    return MARGIN + 4;
  }
  return y;
}

function drawBanner(doc: jsPDF, pageW: number, bannerData: string | null) {
  if (bannerData) {
    try {
      doc.addImage(bannerData, "JPEG", 0, 0, pageW, BANNER_H, undefined, "FAST");
      return;
    } catch {
      /* fallback below */
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
  doc.text("Kamelia — The Floral Designer  ·  Client planning document", MARGIN, y);

  return y + LINE * 1.4;
}

function drawSectionTitle(doc: jsPDF, title: string, y: number) {
  y = ensureSpace(doc, y, LINE * 3);
  setFill(doc, THEME.goldLight);
  doc.rect(MARGIN, y - 3.5, CONTENT_W, 7, "F");
  setText(doc, THEME.text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), MARGIN + 2, y + 1.5);
  return y + LINE * 1.35;
}

function drawSubheading(doc: jsPDF, title: string, y: number) {
  y = ensureSpace(doc, y, LINE * 2);
  setText(doc, THEME.muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(title.toUpperCase(), MARGIN, y);
  return y + LINE * 0.9;
}

function drawField(doc: jsPDF, label: string, value: string, y: number, pageW: number) {
  const maxW = pageW - 2 * MARGIN;
  y = ensureSpace(doc, y, LINE * 3);

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
    yy = ensureSpace(doc, yy, LINE);
    doc.text(line, MARGIN, yy);
    yy += LINE * 0.92;
  }
  return yy + LINE * 0.35;
}

function drawFieldPair(
  doc: jsPDF,
  left: { label: string; value: string },
  right: { label: string; value: string },
  y: number,
) {
  const colW = (CONTENT_W - 6) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colW + 6;

  const measureCol = (value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    return doc.splitTextToSize(value || "—", colW).length;
  };

  const leftLines = measureCol(left.value);
  const rightLines = measureCol(right.value);
  const rowCount = Math.max(leftLines, rightLines, 1);
  y = ensureSpace(doc, y, LINE * (2 + rowCount));

  const drawCol = (x: number, col: { label: string; value: string }, lineCount: number) => {
    setText(doc, THEME.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(col.label.toUpperCase(), x, y);
    setText(doc, THEME.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(col.value || "—", colW);
    doc.text(lines, x, y + LINE * 0.95);
    return lineCount;
  };

  drawCol(leftX, left, leftLines);
  drawCol(rightX, right, rightLines);

  return y + LINE * 0.95 + rowCount * LINE * 0.92 + LINE * 0.45;
}

function drawTaggedItems(doc: jsPDF, items: string[], y: number) {
  if (!items.length) {
    return drawField(doc, "Selections", "—", y, MM_PAGE_W);
  }

  const padX = 2.8;
  const chipH = 5.8;
  const gap = 2.2;
  let x = MARGIN;
  let rowY = y;

  rowY = ensureSpace(doc, rowY, chipH + LINE);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  for (const item of items) {
    const w = doc.getTextWidth(item) + padX * 2;
    if (x + w > MARGIN + CONTENT_W && x > MARGIN) {
      x = MARGIN;
      rowY += chipH + gap;
      rowY = ensureSpace(doc, rowY, chipH + LINE);
    }

    setFill(doc, THEME.white);
    doc.setDrawColor(THEME.gold[0], THEME.gold[1], THEME.gold[2]);
    doc.setLineWidth(0.2);
    doc.rect(x, rowY - chipH + 2.2, w, chipH, "FD");

    setText(doc, THEME.text);
    doc.text(item, x + padX, rowY);
    x += w + gap;
  }

  return rowY + chipH + LINE * 0.75;
}

function drawBulletList(doc: jsPDF, items: string[], y: number, pageW: number) {
  if (!items.length) {
    return drawField(doc, "Selections", "—", y, pageW);
  }
  const maxW = pageW - 2 * MARGIN - 4;
  for (const item of items) {
    y = ensureSpace(doc, y, LINE * 2);
    setText(doc, THEME.gold);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("•", MARGIN, y);
    setText(doc, THEME.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(item, maxW);
    doc.text(lines, MARGIN + 4, y);
    y += lines.length * LINE * 0.92 + LINE * 0.25;
  }
  return y;
}

function drawMixedSwatch(doc: jsPDF, cx: number, cy: number, radius: number) {
  const petals: Array<readonly [number, number, number]> = [
    [232, 180, 184],
    [201, 169, 98],
    [156, 175, 136],
    [107, 76, 154],
  ];
  const offsets: Array<[number, number]> = [
    [-1.1, -1.1],
    [1.1, -1.1],
    [-1.1, 1.1],
    [1.1, 1.1],
  ];
  petals.forEach((rgb, i) => {
    setFill(doc, rgb);
    doc.circle(cx + offsets[i][0], cy + offsets[i][1], radius * 0.52, "F");
  });
  doc.setDrawColor(190, 185, 178);
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, radius, "S");
}

function drawSingleSwatch(doc: jsPDF, swatch: ColorSwatch, cx: number, cy: number, radius: number) {
  if (swatch.id === "mixed") {
    drawMixedSwatch(doc, cx, cy, radius);
    return;
  }
  const rgb = hexToRgb(swatch.hex);
  setFill(doc, rgb);
  doc.circle(cx, cy, radius, "F");
  doc.setDrawColor(190, 185, 178);
  doc.setLineWidth(0.25);
  doc.circle(cx, cy, radius, "S");
}

function drawColorPalette(doc: jsPDF, colorIds: string[], y: number, pageW: number) {
  const selected = colorIds
    .map((id) => COLOR_SWATCHES.find((c) => c.id === id))
    .filter((c): c is ColorSwatch => Boolean(c));

  if (!selected.length) {
    return drawField(doc, "Selected tones", "No palette selected", y, pageW);
  }

  const cols = 5;
  const cellW = CONTENT_W / cols;
  const dotR = 3.4;
  const rowH = 20;
  let rowY = y;
  let col = 0;

  y = ensureSpace(doc, y, rowH + LINE);

  for (const swatch of selected) {
    if (col === 0) {
      rowY = ensureSpace(doc, rowY, rowH + LINE);
    }

    const cx = MARGIN + col * cellW + cellW / 2;
    const cy = rowY + dotR + 3;
    drawSingleSwatch(doc, swatch, cx, cy, dotR);

    setText(doc, THEME.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const labelLines = doc.splitTextToSize(swatch.label, cellW - 3);
    doc.text(labelLines, cx, cy + dotR + 3.5, { align: "center" });

    setText(doc, THEME.muted);
    doc.setFont("courier", "normal");
    doc.setFontSize(6);
    const hexLabel = swatch.id === "mixed" ? "Mixed" : swatch.hex.toUpperCase();
    doc.text(hexLabel, cx, cy + dotR + 3.5 + labelLines.length * 3.2, { align: "center" });

    col += 1;
    if (col >= cols) {
      col = 0;
      rowY += rowH;
    }
  }

  return (col === 0 ? rowY : rowY + rowH) + LINE * 0.5;
}

function drawSubheadingAt(doc: jsPDF, title: string, x: number, y: number) {
  y = ensureSpace(doc, y, LINE * 2);
  setText(doc, THEME.muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(title.toUpperCase(), x, y);
  return y + LINE * 0.9;
}

function drawMultilineBlockAt(
  doc: jsPDF,
  label: string,
  body: string,
  x: number,
  y: number,
  width: number,
) {
  y = drawSubheadingAt(doc, label, x, y);
  setText(doc, THEME.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(body.trim() || "—", width);
  for (const line of lines) {
    y = ensureSpace(doc, y, LINE);
    doc.text(line, x, y);
    y += LINE * 0.92;
  }
  return y + LINE * 0.5;
}

function drawBudgetVisionSection(doc: jsPDF, s: QState, y: number, pageW: number) {
  y = drawSectionTitle(doc, "Budget & vision", y);
  y = drawField(doc, "Budget range", s.budget, y, pageW);

  const colW = (CONTENT_W - 6) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colW + 6;

  const left: { label: string; value: string }[] = [];
  const right: { label: string; value: string }[] = [];

  if (s.memorableMoment.trim()) {
    left.push({ label: "Signature moment", value: s.memorableMoment });
  }
  if (s.culturalNotes.trim()) {
    left.push({ label: "Cultural / religious notes", value: s.culturalNotes });
  }
  if (s.inspirationLinks.trim()) {
    right.push({ label: "Inspiration links", value: s.inspirationLinks });
  }
  if (s.notes.trim()) {
    right.push({ label: "Additional notes", value: s.notes });
  }

  if (!left.length && !right.length) {
    return y + LINE * 0.35;
  }

  let yLeft = y;
  let yRight = y;

  for (const block of left) {
    yLeft = drawMultilineBlockAt(doc, block.label, block.value, leftX, yLeft, colW);
  }
  for (const block of right) {
    yRight = drawMultilineBlockAt(doc, block.label, block.value, rightX, yRight, colW);
  }

  return Math.max(yLeft, yRight) + LINE * 0.35;
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
  doc.text(`Kamelia — The Floral Designer  ·  ${KAMELIA_PHONE_DISPLAY}`, MARGIN, y + 8.5);
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

  // —— Step 1: Event & venue ——
  y = drawSectionTitle(doc, "Event & venue", y);
  y = drawField(doc, "Event type", s.eventType, y, pageW);
  y = drawFieldPair(
    doc,
    { label: "Event date", value: s.eventDate ? formatDisplayDate(s.eventDate) : "" },
    { label: "Event time", value: s.eventTime },
    y,
  );
  y = drawFieldPair(
    doc,
    { label: "Guest count", value: s.guestCount },
    { label: "Venue setting", value: s.venueSetting },
    y,
  );
  y = drawField(doc, "Venue name", s.venueName, y, pageW);

  // —— Step 2: Design & decor ——
  y = drawSectionTitle(doc, "Design & decor", y);
  y = drawField(doc, "Theme & style", s.themeStyle, y, pageW);

  y = drawSubheading(doc, "Color palette", y);
  y = drawColorPalette(doc, s.colors, y, pageW);

  y = drawSubheading(doc, "Areas to decorate", y);
  y = drawTaggedItems(doc, s.decorAreas, y);

  y = drawSubheading(doc, "Decor elements", y);
  y = drawTaggedItems(doc, s.decorElements, y);

  if (s.decorPriorities.length) {
    y = drawSubheading(doc, "Top priorities (if budget is tight)", y);
    y = drawTaggedItems(doc, s.decorPriorities, y);
  }

  y = drawSubheading(doc, "Floral preference", y);
  y = drawBulletList(doc, s.floralPrefs, y, pageW);

  // —— Step 3: Budget & vision (2-column notes to save space) ——
  y = drawBudgetVisionSection(doc, s, y, pageW);

  // —— Contact ——
  y = drawSectionTitle(doc, "Contact information", y);
  y = drawFieldPair(
    doc,
    { label: "Full name", value: s.fullName },
    { label: "WhatsApp", value: s.whatsapp },
    y,
  );

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
  return `kamelia-event-brief-${stamp}.pdf`;
}

/** Opens WhatsApp chat with Kamelia (studio number), with a pre-filled message from the client. */
export function buildWhatsappSendPdfHref(s: QState): string {
  const name = s.fullName?.trim() || "Client";
  const clientPhone = s.whatsapp?.trim();
  const text = [
    `Hi Kamelia,`,
    ``,
    `I'm sending my completed *Event Styling Brief* as a PDF.`,
    clientPhone ? `My WhatsApp: ${clientPhone}` : null,
    ``,
    `Please attach your PDF in WhatsApp before sending:`,
    `Mobile: tap + or the paperclip, then Document, and choose ${defaultPdfFilename()}.`,
    `Desktop: click the paperclip, then Document, and select the file from Downloads.`,
    ``,
    name,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  return `https://wa.me/${KAMELIA_PHONE_DIGITS}?text=${encodeURIComponent(text)}`;
}
