import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Kamelia — The Floral Designer",
  description:
    "Luxury floral styling for weddings, engagements, mandaps, and unforgettable events.",
  icons: {
    icon: [{ url: "/logo_black.png", type: "image/png" }],
    shortcut: "/logo_black.png",
    apple: "/logo_black.png",
  },
};

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
        <link rel="preload" href="/logo_black.png" as="image" type="image/png" />
        <link rel="preload" href="/herovideo.mp4" as="video" type="video/mp4" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
