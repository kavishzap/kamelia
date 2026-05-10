/**
 * TikTok gallery — edit URLs here. Short links (vt.tiktok.com) are resolved server-side
 * via oEmbed for thumbnails and embed IDs when possible.
 *
 * Nine cards reuse the same three links below (A → B → C → A → …). Change A/B/C only.
 */
export type TikTokGalleryItem = {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  videoId?: string;
};

const A = "https://vt.tiktok.com/ZS9cbu3P8/";
const B = "https://vt.tiktok.com/ZS9cbpuJf/";
const C = "https://vt.tiktok.com/ZS9cbw4AQ/";

export const tiktokGalleryItems: TikTokGalleryItem[] = [
  { id: "tt-1", url: A, title: "Floral moment I", subtitle: "Kamelia on TikTok" },
  { id: "tt-2", url: B, title: "Floral moment II", subtitle: "Kamelia on TikTok" },
  { id: "tt-3", url: C, title: "Floral moment III", subtitle: "Kamelia on TikTok" },
  { id: "tt-4", url: A, title: "Floral moment IV", subtitle: "Kamelia on TikTok" },
  { id: "tt-5", url: B, title: "Floral moment V", subtitle: "Kamelia on TikTok" },
  { id: "tt-6", url: C, title: "Floral moment VI", subtitle: "Kamelia on TikTok" },
  { id: "tt-7", url: A, title: "Floral moment VII", subtitle: "Kamelia on TikTok" },
  { id: "tt-8", url: B, title: "Floral moment VIII", subtitle: "Kamelia on TikTok" },
  { id: "tt-9", url: C, title: "Floral moment IX", subtitle: "Kamelia on TikTok" },
];
