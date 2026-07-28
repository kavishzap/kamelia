import { KAMELLIA_PHONE_DIGITS, KAMELLIA_PHONE_DISPLAY } from "@/data/contact";
import { SOCIAL_LINKS } from "@/data/social-links";

/** Canonical production domain (include https, no trailing slash) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://kamelliathefloraldesigner.com";

export const SITE_NAME = "Kamellia";
export const SITE_TAGLINE = "The Floral Designer";
export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const SITE_DESCRIPTION =
  "Kamellia — luxury floral styling in Mauritius for weddings, engagements, mandaps, birthdays, and unforgettable events. Plan your floral story with our studio.";

export const SITE_KEYWORDS = [
  "Kamellia",
  "floral designer Mauritius",
  "wedding florist Mauritius",
  "mandap decoration",
  "engagement flowers",
  "event floral styling",
  "luxury florals Mauritius",
  "Kamellia the floral designer",
] as const;

/** Prefer a wide image for social previews */
export const SITE_OG_IMAGE = "/banner.jpeg";

export const SITE_LOCALE = "en_MU";

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "Kamellia The Floral Designer",
  url: SITE_URL,
  phoneDisplay: KAMELLIA_PHONE_DISPLAY,
  phoneE164: `+${KAMELLIA_PHONE_DIGITS}`,
  email: "", // add when you have a public email
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook, SOCIAL_LINKS.tiktok],
  areaServed: "Mauritius",
} as const;
