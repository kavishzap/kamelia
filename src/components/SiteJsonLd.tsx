import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Server-rendered JSON-LD for Google */
export function SiteJsonLd() {
  const payloads = [organizationJsonLd(), websiteJsonLd()];

  return (
    <>
      {payloads.map((data) => (
        <script
          key={String(data["@id"] ?? data["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
