export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNum: number;
  collection: string;
  images: string[];
  specs: {
    temp: string;
    capacity: string;
    coolTime: string;
    dimensions?: string;
    weight?: string;
    material?: string;
  };
  badge?: string;
  inStock: boolean;
  vendor: string;
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  productIds: string[];
}

export const products: Product[] = [
  {
    id: "arctic-pro-100",
    name: "Arctic Pro 100 Cold Plunge Tub",
    description: "Professional-grade cold plunge system with advanced chilling technology. Maintains precise temperatures for consistent cold therapy sessions. Durable stainless steel interior with insulated shell for maximum efficiency.",
    price: "$4,995",
    priceNum: 4995,
    collection: "cold-plunge-tubs",
    images: [],
    specs: { temp: "39–60°F", capacity: "100 gal", coolTime: "2 hr", dimensions: "60\" × 30\" × 28\"", weight: "185 lbs", material: "Stainless Steel" },
    badge: "Best Seller",
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "glacier-elite-120",
    name: "Glacier Elite 120 Cold Plunge",
    description: "Premium cold plunge tub with sleek design and whisper-quiet cooling. Chrome-accented exterior with medical-grade interior surface. Ideal for athletes and wellness enthusiasts seeking top-tier recovery equipment.",
    price: "$6,495",
    priceNum: 6495,
    collection: "cold-plunge-tubs",
    images: [],
    specs: { temp: "37–55°F", capacity: "120 gal", coolTime: "1.5 hr", dimensions: "68\" × 34\" × 30\"", weight: "220 lbs", material: "Acrylic / Stainless" },
    badge: "Premium",
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "polar-compact-60",
    name: "Polar Compact 60 Home Plunge",
    description: "Space-efficient cold plunge designed for home use. Powerful cooling in a smaller footprint without sacrificing performance. Perfect entry point for cold therapy enthusiasts building a home recovery setup.",
    price: "$2,995",
    priceNum: 2995,
    collection: "cold-plunge-tubs",
    images: [],
    specs: { temp: "42–65°F", capacity: "60 gal", coolTime: "3 hr", dimensions: "48\" × 28\" × 26\"", weight: "120 lbs", material: "Reinforced ABS" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "summit-xl-200",
    name: "Summit XL 200 Commercial Plunge",
    description: "High-capacity commercial cold plunge built for gyms, studios, and training facilities. Dual-compressor cooling system ensures rapid temperature recovery between users. Heavy-duty construction for continuous daily operation.",
    price: "$9,995",
    priceNum: 9995,
    collection: "commercial-systems",
    images: [],
    specs: { temp: "35–55°F", capacity: "200 gal", coolTime: "1 hr", dimensions: "84\" × 42\" × 32\"", weight: "380 lbs", material: "Commercial Stainless" },
    badge: "Commercial",
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "apex-dual-zone",
    name: "Apex Dual-Zone Recovery System",
    description: "Innovative dual-zone system offering both cold plunge and contrast therapy in a single unit. Independently controlled temperature zones allow simultaneous hot and cold therapy protocols for optimal athletic recovery.",
    price: "$12,495",
    priceNum: 12495,
    collection: "commercial-systems",
    images: [],
    specs: { temp: "37–104°F", capacity: "160 gal", coolTime: "1.5 hr", dimensions: "96\" × 48\" × 34\"", weight: "450 lbs", material: "Medical-Grade Steel" },
    badge: "Dual Zone",
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "titan-pro-commercial",
    name: "Titan Pro Commercial Cold Plunge",
    description: "Enterprise-grade cold plunge designed for high-traffic wellness facilities. Auto-filtration, UV sanitation, and smart temperature management for hands-free operation. Built for 24/7 facility environments.",
    price: "$14,995",
    priceNum: 14995,
    collection: "commercial-systems",
    images: [],
    specs: { temp: "34–50°F", capacity: "250 gal", coolTime: "45 min", dimensions: "90\" × 44\" × 36\"", weight: "520 lbs", material: "Industrial Stainless" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "chill-cover-universal",
    name: "Insulated Cold Plunge Cover – Universal Fit",
    description: "High-density insulated cover designed to minimize heat exchange and maintain cold plunge temperatures. UV-resistant exterior with reinforced stitching. Fits most standard cold plunge tubs up to 72 inches.",
    price: "$249",
    priceNum: 249,
    collection: "accessories",
    images: [],
    specs: { temp: "N/A", capacity: "Fits up to 72\"", coolTime: "N/A", material: "Marine-Grade Vinyl" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "plunge-thermometer-pro",
    name: "Digital Plunge Thermometer Pro",
    description: "Wireless digital thermometer with real-time temperature display and smartphone connectivity. Submersible sensor with ±0.5°F accuracy. Track your cold therapy sessions with precision.",
    price: "$89",
    priceNum: 89,
    collection: "accessories",
    images: [],
    specs: { temp: "±0.5°F accuracy", capacity: "N/A", coolTime: "N/A", material: "Waterproof ABS" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "plunge-step-platform",
    name: "Non-Slip Entry Step Platform",
    description: "Heavy-duty non-slip step platform for safe entry and exit from cold plunge tubs. Textured surface with drainage channels. Weight capacity of 400 lbs with adjustable height settings.",
    price: "$179",
    priceNum: 179,
    collection: "accessories",
    images: [],
    specs: { temp: "N/A", capacity: "400 lb capacity", coolTime: "N/A", dimensions: "24\" × 16\" × 8\"", material: "Reinforced Polymer" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "recovery-robe",
    name: "Thermal Recovery Robe",
    description: "Quick-dry thermal robe designed for post-plunge warmth. Ultra-absorbent microfiber interior with wind-resistant outer shell. Essential recovery apparel for cold therapy practitioners.",
    price: "$129",
    priceNum: 129,
    collection: "recovery-equipment",
    images: [],
    specs: { temp: "N/A", capacity: "One Size", coolTime: "N/A", material: "Microfiber / Nylon" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "contrast-therapy-kit",
    name: "Contrast Therapy Starter Kit",
    description: "Complete kit for contrast therapy including temperature monitoring, timer, and protocol guide. Everything needed to integrate hot-cold recovery routines into your wellness practice.",
    price: "$349",
    priceNum: 349,
    collection: "recovery-equipment",
    images: [],
    specs: { temp: "N/A", capacity: "Full Kit", coolTime: "N/A", material: "Mixed" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "outdoor-cedar-plunge",
    name: "Cedar Outdoor Cold Plunge Barrel",
    description: "Handcrafted cedar barrel cold plunge designed for outdoor installation. Natural wood insulation with stainless steel hardware. Weather-resistant finish for year-round outdoor cold therapy.",
    price: "$3,795",
    priceNum: 3795,
    collection: "outdoor-units",
    images: [],
    specs: { temp: "40–65°F", capacity: "80 gal", coolTime: "2.5 hr", dimensions: "42\" diameter × 36\"", weight: "160 lbs", material: "Western Red Cedar" },
    badge: "Outdoor",
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "alpine-outdoor-pro",
    name: "Alpine Outdoor Pro Cold Plunge",
    description: "All-weather outdoor cold plunge with integrated chiller and hardcover. Designed to withstand extreme temperatures from -20°F to 110°F. Self-draining base with built-in leveling system.",
    price: "$5,495",
    priceNum: 5495,
    collection: "outdoor-units",
    images: [],
    specs: { temp: "37–60°F", capacity: "110 gal", coolTime: "2 hr", dimensions: "66\" × 32\" × 30\"", weight: "240 lbs", material: "UV-Stable Composite" },
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
  {
    id: "everest-outdoor-xl",
    name: "Everest XL Outdoor Cold Plunge System",
    description: "Premium oversized outdoor cold plunge system with built-in filtration, ozone sanitation, and smart temperature controls. The ultimate backyard recovery installation for serious cold therapy practitioners.",
    price: "$7,995",
    priceNum: 7995,
    collection: "outdoor-units",
    images: [],
    specs: { temp: "35–58°F", capacity: "150 gal", coolTime: "1.5 hr", dimensions: "78\" × 38\" × 32\"", weight: "310 lbs", material: "Composite / Stainless" },
    badge: "Premium",
    inStock: true,
    vendor: "FrostHaven Equipment",
  },
];

export const collections: Collection[] = [
  {
    slug: "cold-plunge-tubs",
    name: "Cold Plunge Tubs",
    description: "Premium cold plunge tubs for home and personal use. Precision-engineered cooling systems with durable construction.",
    productIds: ["arctic-pro-100", "glacier-elite-120", "polar-compact-60"],
  },
  {
    slug: "commercial-systems",
    name: "Commercial Cold Plunge Systems",
    description: "High-capacity cold plunge systems built for gyms, spas, and athletic training facilities.",
    productIds: ["summit-xl-200", "apex-dual-zone", "titan-pro-commercial"],
  },
  {
    slug: "accessories",
    name: "Ice Bath Accessories",
    description: "Essential accessories for your cold plunge setup including covers, thermometers, and entry platforms.",
    productIds: ["chill-cover-universal", "plunge-thermometer-pro", "plunge-step-platform"],
  },
  {
    slug: "recovery-equipment",
    name: "Recovery Equipment",
    description: "Recovery apparel and kits designed to complement your cold therapy practice.",
    productIds: ["recovery-robe", "contrast-therapy-kit"],
  },
  {
    slug: "outdoor-units",
    name: "Outdoor Cold Therapy Units",
    description: "Weather-resistant cold plunge systems designed for outdoor installation and year-round use.",
    productIds: ["outdoor-cedar-plunge", "alpine-outdoor-pro", "everest-outdoor-xl"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getProductsByCollection = (slug: string) => {
  const col = getCollection(slug);
  if (!col) return [];
  return col.productIds.map((id) => getProduct(id)).filter(Boolean) as Product[];
};
