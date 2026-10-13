export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type StrainType = "sativa" | "indica" | "hybrid";

export type FeaturedProduct = {
  strain: string;
  type: StrainType;
  extraction: string;
};

// Strains that appear on the packaging and strain circle pages.
export const featuredProducts: FeaturedProduct[] = [
  { strain: "Malawi Sunrise", type: "sativa", extraction: "Live Rosin" },
  { strain: "Wasatch Frost", type: "hybrid", extraction: "Live Rosin" },
  { strain: "Hashburger", type: "indica", extraction: "Live Rosin" },
  { strain: "Super Boof", type: "hybrid", extraction: "Live Rosin" },
  { strain: "Black Triangle", type: "indica", extraction: "Live Rosin" },
];

export type Pillar = {
  title: string;
  body: string;
};

// Product formats.
// Placeholder copy.
export const categories: Category[] = [
  {
    slug: "flower",
    name: "Flower",
    description: "Hand trimmed and slow dried to protect the terpenes. Every product starts here.",
  },
  {
    slug: "vapes",
    name: "Vape Pods",
    description: "Solventless live rosin, labeled by strain and extraction so you know what's inside.",
  },
  {
    slug: "concentrates",
    name: "Concentrates",
    description: "Single-source rosin pressed without solvents, for the fullest expression of the cultivar.",
  },
  {
    slug: "edibles",
    name: "Experience Gummies",
    description: "Sleep, Balance, Active, Calm, Recovery and Soothe. Pick by how you want to feel.",
  },
];

// 2.2 Brand Pillars
export const pillars: Pillar[] = [
  {
    title: "The flower-forward philosophy",
    body: "Every Dragonfly product begins and ends with the flower. The flower dictates the product, not the other way around.",
  },
  {
    title: "Craft quality you can see and taste",
    body: "We hand trim every bud. The terpene profile, the flavor and the smoothness matter as much as the numbers on the label.",
  },
  {
    title: "Genuine potency, nothing artificial",
    body: "We pursue potency through superior genetics and meticulous cultivation. We work solventless because every shortcut strips something away.",
  },
  {
    title: "The name is a commitment",
    body: "We don't offer everything. If a product doesn't represent the full potential of its cultivar, it's not Dragonfly.",
  },
  {
    title: "The plant is worth knowing",
    body: "The endocannabinoid system is present in every human body. Every patient deserves to understand what this plant can do.",
  },
];
