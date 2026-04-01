// Maps mega menu category routes to metadata + Shopify search/filter logic

export interface CategoryMapping {
  parentSlug: string;
  slug: string;
  name: string;
  description: string;
  // Keywords to match against Shopify product titles/descriptions for filtering
  filterKeywords: string[];
  // Optional Shopify product_type filter
  productType?: string;
}

export const categoryMappings: CategoryMapping[] = [
  // Cold Plunge Tubs
  {
    parentSlug: "cold-plunge-tubs",
    slug: "residential-units",
    name: "Residential Units",
    description: "Explore cold plunge units designed for home wellness spaces and personal recovery routines.",
    filterKeywords: ["home", "residential", "villa", "homestead", "compact"],
  },
  {
    parentSlug: "cold-plunge-tubs",
    slug: "portable-systems",
    name: "Portable Systems",
    description: "Discover portable cold therapy systems built for flexible setup and efficient recovery.",
    filterKeywords: ["portable", "collapsible", "foldable", "mobile", "travel", "nomad", "trek", "rally"],
  },
  {
    parentSlug: "cold-plunge-tubs",
    slug: "indoor-models",
    name: "Indoor Models",
    description: "View indoor cold plunge options designed for controlled environments and year-round use.",
    filterKeywords: ["indoor", "studio", "arctic", "glacier", "elite", "pro"],
  },
  // Commercial
  {
    parentSlug: "commercial",
    slug: "gym-fitness",
    name: "Gym & Fitness",
    description: "Explore recovery solutions suited for training facilities and performance-focused environments.",
    filterKeywords: ["gym", "fitness", "training", "ironclad", "fitpro", "summit"],
  },
  {
    parentSlug: "commercial",
    slug: "spa-wellness",
    name: "Spa & Wellness",
    description: "Cold therapy equipment designed for wellness studios, spa spaces, and premium recovery settings.",
    filterKeywords: ["spa", "wellness", "serenity", "zen", "dual-zone", "apex"],
  },
  {
    parentSlug: "commercial",
    slug: "sports-recovery",
    name: "Sports Recovery",
    description: "Recovery-focused cold plunge systems for athletes, teams, and performance programs.",
    filterKeywords: ["sports", "recovery", "athlete", "team", "titan", "sprint", "performance"],
  },
  // Accessories
  {
    parentSlug: "accessories",
    slug: "chillers",
    name: "Chillers",
    description: "Browse chilling systems and cooling components for cold plunge performance.",
    filterKeywords: ["chiller", "hp", "compressor", "cooling unit"],
  },
  {
    parentSlug: "accessories",
    slug: "covers-lids",
    name: "Covers & Lids",
    description: "Protective covers and lid options designed for cold plunge maintenance and efficiency.",
    filterKeywords: ["cover", "lid", "insulated cover", "hardtop", "roll-up", "thermal"],
  },
  {
    parentSlug: "accessories",
    slug: "filters-parts",
    name: "Filters & Parts",
    description: "Replacement filters and essential parts for upkeep and performance.",
    filterKeywords: ["filter", "drain", "valve", "replacement", "sediment", "carbon"],
  },
  {
    parentSlug: "accessories",
    slug: "water-treatment",
    name: "Water Treatment",
    description: "Water care solutions to support cleanliness and long-term cold plunge maintenance.",
    filterKeywords: ["water", "ozone", "uv", "purifier", "sanitizer", "test kit"],
  },
];

export const getCategoryMapping = (parentSlug: string, slug: string) =>
  categoryMappings.find((c) => c.parentSlug === parentSlug && c.slug === slug);
