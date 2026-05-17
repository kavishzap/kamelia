/** Options for Event Styling Questionnaire */

export const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Reception",
  "Mehendi",
  "Birthday",
  "Bridal Shower",
  "Baby Shower",
  "Corporate Event",
  "Religious Ceremony",
  "Private Dinner",
  "Other",
] as const;

export const EVENT_TIMES = ["Morning", "Afternoon", "Evening", "Full day"] as const;

export const GUEST_RANGES = ["0–50", "50–100", "100–200", "200–500", "500+"] as const;

export const VENUE_RESTRICTION_OPTIONS = [
  "Open flame allowed",
  "Hanging / installation allowed",
  "Nails or screws allowed",
  "Confetti allowed",
  "Power available for lighting",
  "None known yet",
] as const;

export const THEME_STYLES = [
  "Luxury Elegant",
  "Royal Traditional",
  "Modern Minimalist",
  "Floral Garden",
  "Boho Chic",
  "Romantic Soft",
  "Rustic",
  "Tropical",
  "White & Gold Luxury",
  "Bollywood Glam",
  "Arabic Luxe",
  "Contemporary Floral",
] as const;

export type ColorSwatch = { id: string; label: string; hex: string };

export const COLOR_SWATCHES: ColorSwatch[] = [
  { id: "white", label: "White", hex: "#f8f6f3" },
  { id: "cream", label: "Cream", hex: "#f0e6d2" },
  { id: "gold", label: "Gold", hex: "#c9a962" },
  { id: "champagne", label: "Champagne", hex: "#e8d4b8" },
  { id: "blush", label: "Blush Pink", hex: "#e8b4b8" },
  { id: "rose-gold", label: "Rose Gold", hex: "#b76e79" },
  { id: "dusty-rose", label: "Dusty Rose", hex: "#d8a7b1" },
  { id: "peach", label: "Peach", hex: "#f5c4a8" },
  { id: "coral", label: "Coral", hex: "#e87a5d" },
  { id: "red", label: "Red", hex: "#b83232" },
  { id: "burgundy", label: "Burgundy", hex: "#6b1c2e" },
  { id: "fuchsia", label: "Fuchsia", hex: "#d81b60" },
  { id: "lavender", label: "Lavender", hex: "#c4b5e0" },
  { id: "purple", label: "Purple", hex: "#6b4c9a" },
  { id: "blue", label: "Blue", hex: "#3d5a80" },
  { id: "navy", label: "Navy", hex: "#1b263b" },
  { id: "teal", label: "Teal", hex: "#1d7373" },
  { id: "emerald", label: "Emerald Green", hex: "#0d5c4d" },
  { id: "sage", label: "Sage Green", hex: "#9caf88" },
  { id: "mint", label: "Mint", hex: "#b7e4c7" },
  { id: "yellow", label: "Yellow", hex: "#e8c547" },
  { id: "orange", label: "Orange", hex: "#e0782e" },
  { id: "silver", label: "Silver", hex: "#c0c0c0" },
  { id: "black", label: "Black", hex: "#1f1f1f" },
  { id: "mixed", label: "Mixed Floral Palette", hex: "linear-gradient(135deg,#e8b4b8,#c9a962,#9caf88)" },
];

export const DECOR_AREAS = [
  "Entrance / welcome",
  "Ceremony / mandap area",
  "Main stage / backdrop",
  "Head table / sweetheart table",
  "Guest tables (centerpieces)",
  "Cake / dessert table",
  "Photo booth / photowall",
  "Walkway / aisle",
  "Ceiling / hanging install",
  "Bar / lounge area",
] as const;

export const FLORAL_PREFS = [
  "Fresh Flowers",
  "Artificial Flowers",
  "Mixed",
  "Heavy Floral Setup",
  "Minimal Floral Touch",
  "Hanging Florals",
  "Floral Ceiling",
  "Floral Tunnel",
  "Floral Wall",
] as const;

export const DECOR_ELEMENTS = [
  "Drapes",
  "Lanterns",
  "Candles",
  "Fairy Lights",
  "Chandeliers",
  "Neon Signs",
  "Floral Ceiling",
  "Hanging Strings",
  "Walkway Decor",
  "Table Centerpieces",
  "Entrance Decor",
  "Umbrellas/Parasols",
  "Golden Decor",
  "Acrylic Decor",
] as const;

export const STAGE_TYPES = [
  "Floral Arch",
  "Circular Arch",
  "Mandap",
  "Royal Sofa Stage",
  "Minimal Stage",
  "LED Backdrop",
  "Green Wall Setup",
  "Hanging Installation",
  "Tunnel Entrance",
] as const;

export const STAGE_COUNTS = ["One main focal point", "Multiple focal points"] as const;

export const STAGE_SIZES = ["Small", "Medium", "Large", "Venue will advise"] as const;

export const STAGE_BACKDROPS = [
  "Florals only",
  "Drapes",
  "LED screen",
  "Mixed florals & drapes",
  "Green wall",
  "Unsure",
] as const;

export const STAGE_SEATING = ["Royal sofa", "Chairs", "None", "Unsure"] as const;

export const GUEST_TABLE_COUNTS = [
  "0–10 tables",
  "11–20 tables",
  "21–40 tables",
  "41–60 tables",
  "60+ tables",
  "Not applicable",
] as const;

export const DECOR_LONGEVITY = [
  "Outdoor / heat — needs hardy decor",
  "Evening only",
  "Climate-controlled indoor",
  "Unsure — advise me",
] as const;

export const BUDGET_RANGES = [
  "Under Rs 15,000",
  "Rs 15,000 – Rs 30,000",
  "Rs 30,000 – Rs 60,000",
  "Rs 60,000+",
] as const;

export const VENUE_SETTINGS = ["Indoor", "Outdoor", "Both"] as const;

/** Max selections for decor priorities (subset of decor areas). */
export const DECOR_PRIORITY_MAX = 3;
