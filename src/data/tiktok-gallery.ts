/**
 * TikTok gallery — edit URLs here. Short links (vt.tiktok.com) are resolved server-side
 * via oEmbed for thumbnails and embed IDs when possible.
 *
 * Eight cards — one unique short link per tile (order matches gallery left-to-right / rows).
 */
export type TikTokGalleryItem = {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  videoId?: string;
  /** Top-right rail — small caps label */
  season?: string;
  /** Gold year in both rails */
  year?: string;
  /** Bottom-right rail — short piece name */
  piece?: string;
  /** Copy shown under the card (Lando-style caption) */
  description?: string;
};

export const tiktokGalleryItems: TikTokGalleryItem[] = [
  {
    id: "tt-1",
    url: "https://vt.tiktok.com/ZS9cvux4Q/",
    title: "Floral moment I",
    subtitle: "Kamelia on TikTok",
    season: "Install",
    year: "2025",
    piece: "Arch study",
    description: "Layered arch with garden roses, orchid lines, and soft uplighting for the vow exchange.",
  },
  {
    id: "tt-2",
    url: "https://vt.tiktok.com/ZS9cvuHmT/",
    title: "Floral moment II",
    subtitle: "Kamelia on TikTok",
    season: "Reception",
    year: "2025",
    piece: "Candle aisle",
    description: "Taper corridor with mirrored runners, low florals, and warm candle halos for guest arrival.",
  },
  {
    id: "tt-3",
    url: "https://vt.tiktok.com/ZS9cva86N/",
    title: "Floral moment III",
    subtitle: "Kamelia on TikTok",
    season: "Mandap",
    year: "2024",
    piece: "Gold canopy",
    description: "Traditional mandap frame with marigold density, brass accents, and ceiling jasmine strands.",
  },
  {
    id: "tt-4",
    url: "https://vt.tiktok.com/ZS9cvVuT1/",
    title: "Floral moment IV",
    subtitle: "Kamelia on TikTok",
    season: "Install",
    year: "2025",
    piece: "Entrance",
    description: "Statement entrance tunnel — hydrangea massing, brass lanterns, and directional aisle lighting.",
  },
  {
    id: "tt-5",
    url: "https://vt.tiktok.com/ZS9cv9emW/",
    title: "Floral moment V",
    subtitle: "Kamelia on TikTok",
    season: "Private",
    year: "2025",
    piece: "Tablescape",
    description: "Editorial tablescape: bud vases, torn silk runners, and tonal blush-to-champagne stem palette.",
  },
  {
    id: "tt-6",
    url: "https://vt.tiktok.com/ZS9cvftCt/",
    title: "Floral moment VI",
    subtitle: "Kamelia on TikTok",
    season: "Corporate",
    year: "2024",
    piece: "Lobby",
    description: "Brand-forward lobby moment — structural green lines, white phalaenopsis, and low maintenance strike.",
  },
  {
    id: "tt-7",
    url: "https://vt.tiktok.com/ZS9cvyhyf/",
    title: "Floral moment VII",
    subtitle: "Kamelia on TikTok",
    season: "Install",
    year: "2025",
    piece: "Ceiling",
    description: "Suspended floral ceiling with mixed heights, crystal drops, and controlled weight engineering.",
  },
  {
    id: "tt-8",
    url: "https://vt.tiktok.com/ZS9cv96bS/",
    title: "Floral moment VIII",
    subtitle: "Kamelia on TikTok",
    season: "Bridal",
    year: "2025",
    piece: "Bouquet",
    description: "Hand-tied bridal bouquet — garden roses, sweet pea trails, and silk ribbon finish.",
  },
];
