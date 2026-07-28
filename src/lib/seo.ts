import type { Metadata } from "next";
import {
  ORGANIZATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_URL,
} from "@/data/site";

export function buildRootMetadata(): Metadata {
  const ogImage = `${SITE_URL}${SITE_OG_IMAGE}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_TITLE,
      template: `%s · ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [...SITE_KEYWORDS],
    applicationName: SITE_NAME,
    authors: [{ name: ORGANIZATION.legalName, url: SITE_URL }],
    creator: ORGANIZATION.legalName,
    publisher: ORGANIZATION.legalName,
    category: "Floral design",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: SITE_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} floral design`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/logo_black.png", type: "image/png" }],
      shortcut: "/logo_black.png",
      apple: "/logo_black.png",
    },
    verification: {
      google: "7aTlYNJu7AvkYi7_gsAjDiqoQdfn3rpFvbyCHOpA-UU",
    },
  };
}

/** LocalBusiness / Florist schema for Google rich results */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Florist", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    image: `${SITE_URL}${SITE_OG_IMAGE}`,
    logo: `${SITE_URL}/logo_black.png`,
    description: SITE_DESCRIPTION,
    telephone: ORGANIZATION.phoneE164,
    areaServed: {
      "@type": "Country",
      name: ORGANIZATION.areaServed,
    },
    sameAs: [...ORGANIZATION.sameAs],
    priceRange: "$$",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: ORGANIZATION.phoneE164,
        contactType: "customer service",
        areaServed: ORGANIZATION.areaServed,
        availableLanguage: ["English", "French"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}
