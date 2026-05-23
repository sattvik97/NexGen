/* ============================================================== */
/*  REAL NEXGEN TOYS CATALOG                                       */
/*  Source: https://nexgen.toys (mirrored 2026-05-21)              */
/*  All handles + image URLs map to the live store; once the       */
/*  Hydrogen storefront is linked, links resolve to real PDPs.     */
/* ============================================================== */

export type NexGenProduct = {
  handle: string;
  title: string;
  priceINR: number;
  image: string;
  category: NexGenCategoryHandle;
  badge?: 'hot' | 'new' | 'sold-out' | 'best';
};

export type NexGenCategoryHandle =
  | 'rc-cars'
  | 'rc-helicopter'
  | 'remote-control-toys'
  | 'guns'
  | 'soft-toys'
  | 'board-games'
  | 'puzzles'
  | 'art-and-craft'
  | 'outdoor-toys'
  | 'nostalgia-toys'
  | 'kid-toys'
  | 'hand-games'
  | 'hot-sellers'
  | 'trending-on-instagram'
  | 'collectors'
  | 'teens'
  | 'youngster-toys';

export type NexGenCategory = {
  handle: NexGenCategoryHandle;
  title: string;
  emoji: string;
  blurb: string;
  tint: string; // tailwind gradient classes
  glow: 'glow-orange' | 'glow-teal' | 'glow-purple';
};

export type NexGenAgeBand = {
  handle: string;
  label: string;
  emoji: string;
  tint: string;
};

/* ----------------------------- Categories ----------------------------- */
export const NEXGEN_CATEGORIES: NexGenCategory[] = [
  {
    handle: 'rc-cars',
    title: 'RC Cars',
    emoji: '🏎️',
    blurb: 'Drift, crawl, and race — Cyber Truck, F1 & more.',
    tint: 'from-orange-400/30 via-orange-300/15 to-transparent',
    glow: 'glow-orange',
  },
  {
    handle: 'rc-helicopter',
    title: 'RC Helicopters',
    emoji: '🚁',
    blurb: 'Soar with stable, kid-friendly rotor-craft.',
    tint: 'from-teal-400/30 via-teal-300/15 to-transparent',
    glow: 'glow-teal',
  },
  {
    handle: 'remote-control-toys',
    title: 'Remote Control',
    emoji: '🎮',
    blurb: 'Cars, copters, robots — all radio-controlled fun.',
    tint: 'from-purple-400/30 via-purple-300/15 to-transparent',
    glow: 'glow-purple',
  },
  {
    handle: 'guns',
    title: 'Blasters & Guns',
    emoji: '🔫',
    blurb: 'Soft-bead and bubble blasters for safe play battles.',
    tint: 'from-amber-400/30 via-amber-300/15 to-transparent',
    glow: 'glow-orange',
  },
  {
    handle: 'soft-toys',
    title: 'Soft Toys',
    emoji: '🧸',
    blurb: 'Huggable plush companions for every cuddle.',
    tint: 'from-pink-400/30 via-pink-300/15 to-transparent',
    glow: 'glow-orange',
  },
  {
    handle: 'board-games',
    title: 'Board Games',
    emoji: '🎲',
    blurb: 'Family game nights that beat any screen.',
    tint: 'from-indigo-400/30 via-indigo-300/15 to-transparent',
    glow: 'glow-purple',
  },
  {
    handle: 'puzzles',
    title: 'Puzzles',
    emoji: '🧩',
    blurb: 'Spell, solve, build — brain-boosting fun.',
    tint: 'from-emerald-400/30 via-emerald-300/15 to-transparent',
    glow: 'glow-teal',
  },
  {
    handle: 'art-and-craft',
    title: 'Art & Craft',
    emoji: '🎨',
    blurb: 'Spark creativity with kits & supplies.',
    tint: 'from-rose-400/30 via-rose-300/15 to-transparent',
    glow: 'glow-orange',
  },
  {
    handle: 'outdoor-toys',
    title: 'Outdoor Toys',
    emoji: '🛴',
    blurb: 'Scooters, tennis sets & active outdoor play.',
    tint: 'from-lime-400/30 via-lime-300/15 to-transparent',
    glow: 'glow-teal',
  },
  {
    handle: 'nostalgia-toys',
    title: 'Nostalgia Toys',
    emoji: '🕹️',
    blurb: 'Retro classics for grown-up kids.',
    tint: 'from-yellow-400/30 via-yellow-300/15 to-transparent',
    glow: 'glow-orange',
  },
  {
    handle: 'hand-games',
    title: 'Consoles',
    emoji: '🎮',
    blurb: 'Handheld gaming, RetroPlay & more.',
    tint: 'from-cyan-400/30 via-cyan-300/15 to-transparent',
    glow: 'glow-teal',
  },
  {
    handle: 'hot-sellers',
    title: 'Hot Sellers',
    emoji: '🔥',
    blurb: 'What everyone is loving right now.',
    tint: 'from-red-400/30 via-red-300/15 to-transparent',
    glow: 'glow-orange',
  },
];

/* ------------------------------- Ages -------------------------------- */
export const NEXGEN_AGES: NexGenAgeBand[] = [
  {handle: '0-18-months', label: '0–18 Months', emoji: '👶', tint: 'from-pink-300 to-rose-200'},
  {handle: '18-36-months', label: '18–36 Months', emoji: '🍼', tint: 'from-amber-300 to-yellow-200'},
  {handle: '3-5-years', label: '3–5 Years', emoji: '🧒', tint: 'from-orange-300 to-amber-200'},
  {handle: '5-7-years', label: '5–7 Years', emoji: '🚲', tint: 'from-teal-300 to-cyan-200'},
  {handle: '7-10-years', label: '7–10 Years', emoji: '🔬', tint: 'from-indigo-300 to-purple-200'},
  {handle: '10-12', label: '10–12 Years', emoji: '🎮', tint: 'from-violet-300 to-fuchsia-200'},
];

/* ------------------------------ Products ----------------------------- */
export const NEXGEN_PRODUCTS: NexGenProduct[] = [
  {
    handle:
      '1-18-cyber-truck-rc-car-high-speed-remote-control-electric-pickup-truck-with-led-lights-usb-charging',
    title: '1:18 Cyber Truck RC Car — LED Lights & USB Charging',
    priceINR: 1500,
    image:
      'https://nexgen.toys/cdn/shop/files/ChatGPTImageMay18_2026_11_27_29AM.png?v=1779087548&width=720',
    category: 'rc-cars',
    badge: 'new',
  },
  {
    handle:
      '1-64-rc-drift-car-with-led-lights-2-4ghz-remote-control-rechargeable-mini-racing-car-toy-for-kids',
    title: '1:64 RC Drift Car with LED Lights & 2.4 GHz Remote',
    priceINR: 1999,
    image:
      'https://nexgen.toys/cdn/shop/files/ChatGPTImageMay18_2026_12_48_56PM.png?v=1779102118&width=720',
    category: 'rc-cars',
    badge: 'hot',
  },
  {
    handle: '2-wheel-kick-scooter',
    title: '2-Wheel Kick Scooter',
    priceINR: 3999,
    image: 'https://nexgen.toys/cdn/shop/files/scooter_final_1200.jpg?v=1772777120&width=720',
    category: 'outdoor-toys',
  },
  {
    handle: 'pastel-bubble-gun-toy',
    title: 'Pastel Bubble Gun Toy',
    priceINR: 750,
    image: 'https://nexgen.toys/cdn/shop/files/tight_2.jpg?v=1772777507&width=720',
    category: 'guns',
    badge: 'hot',
  },
  {
    handle: 'dancing-robot-toy',
    title: 'Dancing Robot Toy with Lights & Music',
    priceINR: 750,
    image:
      'https://nexgen.toys/cdn/shop/files/40339582_1-toyshine-toyshine-bot-robot-pioneer-colorful-lights-and-music-all-direction-movement-dancing-robot-toys-for-boys-and-girls-blue-color.webp?v=1771867566&width=720',
    category: 'kid-toys',
  },
  {
    handle: 'dinosaur-self-spell-box',
    title: 'Dinosaur Self-Spell Box',
    priceINR: 750,
    image: 'https://nexgen.toys/cdn/shop/files/dinosaur_1200_clean.jpg?v=1772777028&width=720',
    category: 'puzzles',
  },
  {
    handle: 'drift-car',
    title: 'Drift Car',
    priceINR: 1100,
    image: 'https://nexgen.toys/cdn/shop/files/71S-4Em2fHL._SL1500.jpg?v=1775907959&width=720',
    category: 'rc-cars',
  },
  {
    handle: 'fish-catching',
    title: 'Fish Catching Game',
    priceINR: 450,
    image: 'https://nexgen.toys/cdn/shop/files/tight_5.jpg?v=1772777186&width=720',
    category: 'board-games',
  },
  {
    handle:
      'high-speed-f1-racing-remote-control-car-with-led-smoke-powerful-engine-red-edition-2-4ghz-rc-formula-car-for-kids-adults',
    title: 'High-Speed F1 Racing Car — LED Smoke, Red Edition',
    priceINR: 1149,
    image: 'https://nexgen.toys/cdn/shop/files/rccar_1200_clean.jpg?v=1772776885&width=720',
    category: 'rc-cars',
    badge: 'best',
  },
  {
    handle: 'hungry-frog-game-for-kids',
    title: 'Hungry Frog Game for Kids',
    priceINR: 730,
    image:
      'https://nexgen.toys/cdn/shop/files/ChatGPTImageSep19_2025_10_55_59PM.png?v=1771859701&width=720',
    category: 'board-games',
  },
  {
    handle: 'kids-studybook',
    title: 'Kids StudyBook — Early Learning',
    priceINR: 399,
    image: 'https://nexgen.toys/cdn/shop/files/learning_book_1200_clean.jpg?v=1772777451&width=720',
    category: 'kid-toys',
  },
  {
    handle: 'musical-cactus-toy',
    title: 'Musical Cactus Toy',
    priceINR: 350,
    image: 'https://nexgen.toys/cdn/shop/files/converted_9.jpg?v=1772777253&width=720',
    category: 'kid-toys',
  },
  {
    handle: 'musical-play-foot-piano-mat',
    title: 'Musical Play Foot Piano Mat',
    priceINR: 2500,
    image: 'https://nexgen.toys/cdn/shop/files/converted_10.jpg?v=1772777096&width=720',
    category: 'kid-toys',
  },
  {
    handle: 'retroplay-520-handheld-gaming-console',
    title: 'RetroPlay 520 Handheld Gaming Console',
    priceINR: 749,
    image: 'https://nexgen.toys/cdn/shop/files/game_console_1200_clean.jpg?v=1772777483&width=720',
    category: 'hand-games',
    badge: 'hot',
  },
  {
    handle: 'rock-crawler-car',
    title: 'Rock Crawler Car',
    priceINR: 999,
    image: 'https://nexgen.toys/cdn/shop/files/tight_12.jpg?v=1772777285&width=720',
    category: 'rc-cars',
  },
  {
    handle: 'soft-gel-bead-shooter-with-colorful-camouflage-design',
    title: 'Soft Gel Bead Shooter — Camouflage',
    priceINR: 1499,
    image: 'https://nexgen.toys/cdn/shop/files/tight_14.jpg?v=1772777539&width=720',
    category: 'guns',
    badge: 'sold-out',
  },
  {
    handle: 'tethered-tennis',
    title: 'Tethered Tennis',
    priceINR: 550,
    image: 'https://nexgen.toys/cdn/shop/files/tight_15.jpg?v=1772777165&width=720',
    category: 'outdoor-toys',
  },
  {
    handle: 'young-scientist-educational-science-kit',
    title: 'Young Scientist Educational Science Kit',
    priceINR: 750,
    image:
      'https://nexgen.toys/cdn/shop/files/young_scientist_1200_clean.jpg?v=1772777318&width=720',
    category: 'kid-toys',
    badge: 'best',
  },
];

export const NEXGEN_STORE_URL = 'https://nexgen.toys';

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
