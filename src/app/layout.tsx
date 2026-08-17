import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { DeviceVisitTracker } from "@/components/DeviceVisitTracker";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`bg-[var(--color-surface)] ${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        <SiteJsonLd />
        <link rel="preload" href="/logo_black.png" as="image" type="image/png" />
        <link rel="preload" href="/herovideo.mp4" as="video" type="video/mp4" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <DeviceVisitTracker />
        {children}
      </body>
    </html>
  );
}
