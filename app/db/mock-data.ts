export interface MockProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: string;
  reviewsCount: number;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
}

export const INITIAL_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: "CYBER-01 Heavyweight Oversized Hoodie",
    slug: "cyber-01-heavyweight-oversized-hoodie",
    description: "Constructed with 500 GSM French Terry cotton. Engineered dropped-shoulder silhouette with reflective neon tonal typography on the spine, reinforced kangaroo pocket with concealed headphone routing, and custom gunmetal hardware.",
    price: "135.00",
    compareAtPrice: "160.00",
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pitch Black", "Volt Lime", "Ghost Grey"],
    stock: 14,
    rating: "4.9",
    reviewsCount: 48,
    isFeatured: true,
    tags: ["Drop 04", "Best Seller", "Heavyweight 500GSM"],
    createdAt: new Date("2026-03-01"),
  },
  {
    id: 2,
    name: "PHANTOM V2 Tactical Modular Cargo",
    slug: "phantom-v2-tactical-modular-cargo",
    description: "Triple-weave ripstop nylon coated with water-repellent DWR finish. Features 8 magnetic Fidlock-compatible utility pockets, adjustable ankle cinch cords, and articulated knee darting for unrestricted movement.",
    price: "165.00",
    compareAtPrice: "195.00",
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["30", "32", "34", "36"],
    colors: ["Stealth Black", "Desert Sand", "Olive Shadow"],
    stock: 8,
    rating: "4.8",
    reviewsCount: 32,
    isFeatured: true,
    tags: ["Tactical", "Water Repellent", "Fidlock Pockets"],
    createdAt: new Date("2026-03-05"),
  },
  {
    id: 3,
    name: "Z-PULSE Runner Exoskeleton Sneaker",
    slug: "z-pulse-runner-exoskeleton-sneaker",
    description: "Futuristic 3D-sculpted thermoplastic exoskeleton housing ultra-responsive nitrogen-infused foam sole. Breathable engineered mesh upper with speed-lacing cord system and Vibram megagrip outsole.",
    price: "240.00",
    compareAtPrice: "280.00",
    category: "footwear",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Triple Obsidian", "Neon Cyberpunk", "Pure Bone"],
    stock: 5,
    rating: "5.0",
    reviewsCount: 74,
    isFeatured: true,
    tags: ["Exoskeleton", "Limited 200 Pairs", "Nitrogen Foam"],
    createdAt: new Date("2026-03-10"),
  },
  {
    id: 4,
    name: "NEXUS Techwear Shell Bomber",
    slug: "nexus-techwear-shell-bomber",
    description: "3-layer seam-sealed GORE membrane with thermal Primaloft insulation. Removable internal cross-body carry sling, waterproof YKK Aquaguard zippers, and modular hood system.",
    price: "285.00",
    compareAtPrice: "340.00",
    category: "outerwear",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Matte Carbon", "Deep Space Navy"],
    stock: 9,
    rating: "4.9",
    reviewsCount: 29,
    isFeatured: true,
    tags: ["Waterproof", "Primaloft", "Carry Sling"],
    createdAt: new Date("2026-03-12"),
  },
  {
    id: 5,
    name: "KINETIC Graphic Raw-Edge Tee",
    slug: "kinetic-graphic-raw-edge-tee",
    description: "Heavy 280 GSM combed organic cotton with enzyme wash for vintage hand-feel. Distressed raw-cut hems, micro-ribbed collar, and high-density silkscreen Japanese brutalist graphics.",
    price: "65.00",
    compareAtPrice: "75.00",
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Acid Washed Black", "Off-White Chalk"],
    stock: 22,
    rating: "4.7",
    reviewsCount: 61,
    isFeatured: false,
    tags: ["Organic Cotton", "Raw Edge", "280 GSM"],
    createdAt: new Date("2026-03-15"),
  },
  {
    id: 6,
    name: "AERO-GRID Sling Utility Chest Rig",
    slug: "aero-grid-sling-utility-chest-rig",
    description: "Ballistic Cordura 1000D fabric with laser-cut MOLLE webbing. Waterproof stash compartments for passport, phone, and power bank. Quick-release magnetic sternum buckle.",
    price: "85.00",
    compareAtPrice: "105.00",
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size"],
    colors: ["Black Ops", "Desert Coyote"],
    stock: 19,
    rating: "4.8",
    reviewsCount: 38,
    isFeatured: false,
    tags: ["Cordura 1000D", "MOLLE System"],
    createdAt: new Date("2026-03-18"),
  }
];

export const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Hoodies & Sweats",
    slug: "hoodies",
    description: "Heavyweight 450-500 GSM French Terry essentials and oversized silhouettes.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Footwear & Runners",
    slug: "footwear",
    description: "Futuristic footwear, exoskeleton soles, and nitrogen-cushioned comfort.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Tactical Outerwear",
    slug: "outerwear",
    description: "Weatherproof 3-layer GORE shells, technical bombers, and modular parkas.",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Cargo & Pants",
    slug: "pants",
    description: "Multi-pocket technical cargo pants engineered with articulated mobility.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Utility Accessories",
    slug: "accessories",
    description: "Laser-cut ballistic bags, chest rigs, hardware caps, and tactical jewelry.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  }
];
