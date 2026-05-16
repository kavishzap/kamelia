# Kamelia (Next.js) — Component Catalog

This repo is a **Next.js 15 (App Router)** site. Most UI in `src/components/**` is reusable and can be copied into other projects.

**Imports**
- Path alias: `@/*` → `src/*` (see `tsconfig.json`)
- Many components are **client components** (`"use client"`), so they can use hooks, `framer-motion`, `window`, etc.

## Pages / Routes
- Home: `src/app/page.tsx`
- Contact page: `src/app/contact/page.tsx`
- API: `GET /api/tiktok-oembed`: `src/app/api/tiktok-oembed/route.ts`

## Layout / Shell

### `Navbar`
- File: `src/components/Navbar.tsx`
- Import: `import { Navbar } from "@/components/Navbar";`
- What it does: fixed top nav with desktop links + animated mobile fullscreen menu (Escape-to-close, body scroll lock).
- Props: none

Usage:
```tsx
import { Navbar } from "@/components/Navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      {/* page content */}
    </>
  );
}
```

### `Footer`
- File: `src/components/Footer.tsx`
- Import: `import { Footer } from "@/components/Footer";`
- What it does: footer brand block, shortcuts, CTA, and social icons.
- Props: none

### `SocialIcons`
- File: `src/components/SocialIcons.tsx`
- Import: `import { SocialIcons } from "@/components/SocialIcons";`
- What it does: Facebook/Instagram/TikTok icon links.
- Props:
  - `className?: string`
  - `onNavigate?: () => void` (handy for “close menu when tapped”)
- Data dependency: `src/data/social-links.ts` (`SOCIAL_LINKS`)

Usage:
```tsx
<SocialIcons className="mt-3" onNavigate={() => setOpen(false)} />
```

## Hero

### `HeroScroll`
- File: `src/components/HeroScroll.tsx`
- Import: `import { HeroScroll } from "@/components/HeroScroll";`
- What it does: scroll-scrubbed hero made from **frame-by-frame JPGs** drawn into a `<canvas>`.
- Props: none
- Data dependency: `src/data/hero-frames.ts` (`HERO_FRAME_COUNT`, `heroFrameUrls`)
- Assets dependency: `public/ezgif-2480cda9ca8a75e6-jpg/ezgif-frame-001.jpg` … etc.

Usage:
```tsx
<HeroScroll />
```

## Section Components (Homepage building blocks)

### `PackagesSection`
- File: `src/components/sections/PackagesSection.tsx`
- Import: `import { PackagesSection } from "@/components/sections/PackagesSection";`
- What it does: “Packages” + “Services” marketing section with motion reveals.
- Props: none

### `GallerySection`
- File: `src/components/sections/GallerySection.tsx`
- Import: `import { GallerySection } from "@/components/sections/GallerySection";`
- What it does:
  - Renders a staggered grid of tiles from `tiktokGalleryItems`
  - Fetches oEmbed metadata via `/api/tiktok-oembed`
  - Opens a modal player (`TikTokGalleryModal`)
- Props: none
- Data dependency: `src/data/tiktok-gallery.ts`
- API dependency: `src/app/api/tiktok-oembed/route.ts`

### `AboutSection`
- File: `src/components/sections/AboutSection.tsx`
- Import: `import { AboutSection } from "@/components/sections/AboutSection";`
- What it does: “Our story” text section with motion.
- Props: none

### `ContactSection`
- File: `src/components/sections/ContactSection.tsx`
- Import: `import { ContactSection } from "@/components/sections/ContactSection";`
- What it does: wrapper section for the questionnaire in embedded mode.
- Props: none
- Uses: `EventQuestionnaire` with `variant="embedded"`

Typical home composition (`src/app/page.tsx`):
```tsx
<Navbar />
<HeroScroll />
<PackagesSection />
<GallerySection />
<AboutSection />
<ContactSection />
<Footer />
```

## Contact / Questionnaire

### `EventQuestionnaire`
- File: `src/components/contact/EventQuestionnaire.tsx`
- Import: `import { EventQuestionnaire } from "@/components/contact/EventQuestionnaire";`
- What it does:
  - Multi-step event questionnaire (“cart-style” estimate)
  - Generates a PDF brief with `jsPDF`
  - Builds a WhatsApp deep-link message (user attaches PDF manually)
- Props:
  - `variant?: "page" | "embedded"` (default `"page"`)
    - `"page"`: full-screen page layout
    - `"embedded"`: section-embed layout (used on home)
- Re-exported type: `QState` (`export type { QState } ...`)
- Data dependency: `src/data/event-questionnaire.ts` (options lists)
- State type: `src/data/questionnaire-q-state.ts` (`QState`)
- PDF/WhatsApp helpers: `src/lib/generateQuestionnairePdf.ts`

Usage (embedded inside a section):
```tsx
<EventQuestionnaire variant="embedded" />
```

Usage (as a full page):
```tsx
<EventQuestionnaire variant="page" />
```

## Gallery Building Blocks

### `NorrisGalleryTile`
- File: `src/components/gallery/NorrisGalleryTile.tsx`
- Import: `import { NorrisGalleryTile } from "@/components/gallery/NorrisGalleryTile";`
- What it does: clickable 9:16 tile with “partial box” frame styling + caption; uses oEmbed thumbnail when available.
- Props:
  - `item: TikTokGalleryItem` (from `src/data/tiktok-gallery.ts`)
  - `index: number`
  - `meta: TikTokOEmbedResult | undefined` (from `src/components/gallery/tiktok-types.ts`)
  - `onOpen: () => void`

### `TikTokGalleryModal`
- File: `src/components/gallery/TikTokGalleryModal.tsx`
- Import: `import { TikTokGalleryModal } from "@/components/gallery/TikTokGalleryModal";`
- What it does: modal dialog with TikTok embed player, Escape-to-close, scroll lock, focus close button.
- Props:
  - `open: boolean`
  - `item: TikTokGalleryItem | null`
  - `meta: TikTokOEmbedResult | null`
  - `onClose: () => void`

### `TikTokVideoCard`
- File: `src/components/gallery/TikTokVideoCard.tsx`
- Import: `import { TikTokVideoCard } from "@/components/gallery/TikTokVideoCard";`
- What it does: alternative “editorial” TikTok card UI (thumbnail + play button).
- Props:
  - `item: TikTokGalleryItem`
  - `index: number`
  - `meta: TikTokOEmbedResult | undefined`
  - `onOpen: () => void`
  - `variant?: "default" | "fan"` (default `"default"`)
  - `className?: string`

### `TikTokOEmbedResult` type
- File: `src/components/gallery/tiktok-types.ts`
- Import: `import type { TikTokOEmbedResult } from "@/components/gallery/tiktok-types";`
- Shape:
  - `videoId: string | null`
  - `thumbnailUrl: string | null`
  - `title: string | null`
  - `authorName: string | null`

## “Paste into Claude” quick context

If you want Claude to reuse a component, give it:
1) the file path(s) from `src/components/**` you want,
2) any dependencies it needs (data files in `src/data/**`, types, and any `public/**` assets),
3) and where you plan to mount it (page/section).

Example prompt snippet:
```
I have a Next.js App Router + Tailwind project.
Please port these components exactly (TypeScript): 
- src/components/Navbar.tsx
- src/components/Footer.tsx
- src/components/SocialIcons.tsx

Keep the same import alias @/* (or rewrite imports if needed).
Also copy: src/data/social-links.ts
```

