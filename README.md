# Kamelia — The Floral Designer

Marketing site for **Kamelia**, a luxury floral and event styling studio in Mauritius. Built with **Next.js 15** (App Router), **React 19**, **Tailwind CSS 4**, and **Framer Motion**.

The homepage presents services, a photo portfolio, a TikTok video gallery, brand story, and a multi-step **event questionnaire** that generates a branded PDF brief and links clients to WhatsApp.

## Features

- **Hero** — Full-viewport background video with CTAs to the contact form and gallery
- **Occasions & services** — Packages section with motion reveals
- **Portfolio** — Server-rendered grid from images in `public/portfolio/`
- **TikTok gallery** — Square tiles with oEmbed thumbnails, in-page modal player, and per-card “View on TikTok” links
- **Event questionnaire** — Three-step guided brief (event & venue → design & decor → budget & contact)
- **PDF export** — Client-side brief PDF (`jsPDF`) with studio banner and structured sections
- **WhatsApp handoff** — Deep link to Kamelia’s studio number after PDF download (client attaches the file)
- **Splash loader** — First-visit preload splash; skipped on repeat visits in the same session
- **Responsive nav** — Fixed navbar with animated mobile menu (Escape to close, body scroll lock)

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 15.3 (App Router, Turbopack in dev) |
| UI | React 19, Tailwind CSS 4 |
| Motion | Framer Motion 12 |
| PDF | jsPDF 3 |
| Language | TypeScript 5 |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |

## Getting started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** (or pnpm / yarn)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (`next dev --turbopack`) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

### Path alias

Imports use `@/*` → `src/*` (see `tsconfig.json`).

## Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Homepage (all main sections) |
| `/contact` | `src/app/contact/page.tsx` | Redirect-style page linking to `/#contact` |
| `GET /api/tiktok-oembed?url=…` | `src/app/api/tiktok-oembed/route.ts` | Server proxy for TikTok oEmbed (thumbnails, video IDs) |

## Homepage layout

`src/app/page.tsx` composes the site inside `SiteLoader`:

```
Navbar
HeroScroll
PackagesSection
PortfolioSection
GallerySection
AboutSection
ContactSection
Footer
```

Section IDs match `src/data/site-nav.ts` (`#home`, `#packages`, `#portfolio`, `#gallery`, `#about`, `#contact`).

## Project structure

```
kamelia/
├── public/
│   ├── herovideo.mp4          # Hero background video
│   ├── banner.jpeg            # PDF header image
│   ├── portfolio/             # Portfolio grid images (auto-listed)
│   └── …                      # Brand / marketing stills
├── src/
│   ├── app/                   # App Router pages, layout, API routes
│   ├── components/            # UI components
│   │   ├── contact/           # EventQuestionnaire
│   │   ├── gallery/           # TikTok tiles, modal, types
│   │   └── sections/          # Homepage sections
│   ├── data/                  # Content config (nav, gallery URLs, form options)
│   ├── hooks/                 # useInitialLoad (splash / preload)
│   └── lib/                   # PDF generation, button classes, asset preload
└── package.json
```

## Event questionnaire

**Component:** `src/components/contact/EventQuestionnaire.tsx`  
**State type:** `src/data/questionnaire-q-state.ts` (`QState`)  
**Form options:** `src/data/event-questionnaire.ts`  
**PDF:** `src/lib/generateQuestionnairePdf.ts`

### Steps

1. **Event & venue** — Type, date, time, guest count, venue name, indoor/outdoor
2. **Design & decor** — Theme, colour swatches, areas, elements, floral preferences, priorities
3. **Budget & contact** — Budget range, inspiration links, cultural notes, memorable moment, notes, name, WhatsApp

### Flow

- **Continue** validates the current step and scrolls to the first invalid field if needed.
- **Generate my vision** builds and downloads a PDF, then **clears the form** while keeping contact details for WhatsApp.
- **Send to Kamelia on WhatsApp** opens a chat with the studio number and a pre-filled message (user attaches the downloaded PDF).

### Variants

```tsx
<EventQuestionnaire variant="embedded" />  {/* homepage #contact */}
<EventQuestionnaire variant="page" />      {/* standalone full-page layout */}
```

## Contact details

Centralised in `src/data/contact.ts`:

- Display: **+230 5775 1516**
- `kameliaTelHref()` — `tel:` link
- `kameliaWhatsAppHref(text?)` — `wa.me` link with optional prefill
- `buildWhatsappSendPdfHref(state)` — questionnaire success handoff (in PDF module)

Update the phone constants here to change footer, contact section, and WhatsApp targets site-wide.

## TikTok gallery

**Data:** `src/data/tiktok-gallery.ts` — edit `tiktokGalleryItems` (URL, title, caption rails, description).

**UI:**

- `GallerySection` — grid, fetches oEmbed per URL, opens modal
- `NorrisGalleryTile` — square portfolio-style card + “View on TikTok”
- `TikTokGalleryModal` — 9:16 embed player (Escape to close)

**API:** `GET /api/tiktok-oembed?url=<encoded-tiktok-url>` returns `videoId`, `thumbnailUrl`, `title`, `authorName`. If TikTok blocks the request, tiles still work via external links and placeholders.

## Portfolio

`PortfolioSection` reads every image file in `public/portfolio/` at build/request time and renders `PortfolioGridClient`. Add or remove files in that folder to update the grid—no code change required.

## Styling

- Global tokens and base styles: `src/app/globals.css` (`--color-gold`, `--color-surface`, etc.)
- Shared CTA classes: `src/lib/button-classes.ts` (`btnPrimaryClass`, `btnSecondaryClass`) — square gold buttons with white labels, matching form chrome
- Most interactive UI uses **client components** (`"use client"`) for hooks, Framer Motion, and browser APIs

## Key components

| Component | Path | Role |
|-----------|------|------|
| `SiteLoader` | `src/components/SiteLoader.tsx` | Splash + fade-in wrapper |
| `SplashScreen` | `src/components/SplashScreen.tsx` | Branded loading screen |
| `Navbar` | `src/components/Navbar.tsx` | Fixed nav, mobile drawer |
| `HeroScroll` | `src/components/HeroScroll.tsx` | Video hero + CTAs |
| `Footer` | `src/components/Footer.tsx` | Links, phone, social |
| `SocialIcons` | `src/components/SocialIcons.tsx` | Social links from `src/data/social-links.ts` |
| `PackagesSection` | `src/components/sections/PackagesSection.tsx` | Occasions / services |
| `PortfolioSection` | `src/components/sections/PortfolioSection.tsx` | Image portfolio |
| `GallerySection` | `src/components/sections/GallerySection.tsx` | TikTok gallery |
| `AboutSection` | `src/components/sections/AboutSection.tsx` | Brand story |
| `ContactSection` | `src/components/sections/ContactSection.tsx` | Questionnaire embed |
| `EventQuestionnaire` | `src/components/contact/EventQuestionnaire.tsx` | Multi-step form + PDF |

## Configuration files

| File | What to edit |
|------|----------------|
| `src/data/site-nav.ts` | Navbar / footer link labels and hashes |
| `src/data/social-links.ts` | Facebook, Instagram, TikTok URLs |
| `src/data/contact.ts` | Studio phone and WhatsApp helpers |
| `src/data/tiktok-gallery.ts` | Gallery video URLs and copy |
| `src/data/event-questionnaire.ts` | Dropdowns, swatches, budget ranges |
| `src/data/questionnaire-q-state.ts` | `QState` shape (keep in sync with form + PDF) |

## Assets

| Asset | Used by |
|-------|---------|
| `public/herovideo.mp4` | Hero background |
| `public/banner.jpeg` | PDF header |
| `public/portfolio/*` | Portfolio section |
| `public/logo_black.png` | Favicon / metadata (`layout.tsx`) |

Large media files are not committed in all environments—ensure required assets exist under `public/` before deploying.

## Deployment

1. `npm run build`
2. `npm run start` (or deploy to Vercel / any Node host that supports Next.js 15)

No environment variables are required for core functionality. TikTok oEmbed may be rate-limited or blocked by TikTok from some hosts; the gallery degrades gracefully.

## License

Private project — all rights reserved unless otherwise specified by the repository owner.
