/** Kamelia studio contact — call or WhatsApp */
export const KAMELIA_PHONE_DISPLAY = "+230 5775 1516";

/** Digits only, no + — for wa.me and tel */
export const KAMELIA_PHONE_DIGITS = "23057751516";

export function kameliaTelHref() {
  return `tel:+${KAMELIA_PHONE_DIGITS}`;
}

export function kameliaWhatsAppHref(prefillText?: string) {
  const base = `https://wa.me/${KAMELIA_PHONE_DIGITS}`;
  if (!prefillText?.trim()) return base;
  return `${base}?text=${encodeURIComponent(prefillText)}`;
}
