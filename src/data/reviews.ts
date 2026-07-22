export type Review = {
  name: string;
  role: string;
  rating: number;
  quote: string;
};

/** Placeholder testimonials until live reviews are wired */
export const REVIEWS: Review[] = [
  {
    name: "Aisha & Rahul",
    role: "Wedding",
    rating: 5,
    quote:
      "Kamellia turned our mandap into something we still talk about. Every stem felt intentional and so personal.",
  },
  {
    name: "Priya N.",
    role: "Engagement",
    rating: 5,
    quote:
      "From the first mood board to the final setup, they listened closely and delivered beyond what we imagined.",
  },
  {
    name: "Daniel M.",
    role: "Corporate event",
    rating: 5,
    quote:
      "Elegant, on time, and completely seamless. Our guests kept asking who did the florals.",
  },
  {
    name: "Sofia & Mark",
    role: "Anniversary dinner",
    rating: 5,
    quote:
      "Soft, romantic tables that photographed beautifully. The team made the evening feel effortless.",
  },
];
