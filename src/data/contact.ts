/** Kamellia studio contact — call or WhatsApp */
export const KAMELLIA_PHONE_DISPLAY = "+230 5775 1516";

/** Digits only, no + — for wa.me and tel */
export const KAMELLIA_PHONE_DIGITS = "23057751516";

export function kamelliaTelHref() {
  return `tel:+${KAMELLIA_PHONE_DIGITS}`;
}

export function kamelliaWhatsAppHref(prefillText?: string) {
  const base = `https://wa.me/${KAMELLIA_PHONE_DIGITS}`;
  if (!prefillText?.trim()) return base;
  return `${base}?text=${encodeURIComponent(prefillText)}`;
}
