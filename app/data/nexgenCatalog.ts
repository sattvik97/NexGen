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
  /** MRP shown struck-through next to the selling price. */
  mrpINR?: number;
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
/**
 * Branded SVG placeholder used until product photos are uploaded.
 * Deterministic per product (hash of handle picks colour & shape) so the
 * same product always renders the same image across reloads.
 */
const PLACEHOLDER_PALETTES: Array<{bg: string; accent: string; fg: string}> = [
  {bg: '#FF6B35', accent: '#FFE66D', fg: '#0f172a'},
  {bg: '#6C63FF', accent: '#4ECDC4', fg: '#ffffff'},
  {bg: '#4ECDC4', accent: '#FFE66D', fg: '#0f172a'},
  {bg: '#0f172a', accent: '#FF6B35', fg: '#ffffff'},
  {bg: '#FFE66D', accent: '#FF6B35', fg: '#0f172a'},
  {bg: '#fff8ee', accent: '#6C63FF', fg: '#0f172a'},
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function placeholderImage(handle: string, title: string): string {
  const palette = PLACEHOLDER_PALETTES[hashString(handle) % PLACEHOLDER_PALETTES.length];
  const short = title.length > 38 ? title.slice(0, 36).trimEnd() + '\u2026' : title;
  // Split the label into up to three lines (~22 chars each) so long titles wrap.
  const words = short.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > 22) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
    if (lines.length === 2) break;
  }
  if (current && lines.length < 3) lines.push(current);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bg}" />
        <stop offset="100%" stop-color="${palette.accent}" />
      </linearGradient>
    </defs>
    <rect width="720" height="720" fill="url(#g)" />
    <circle cx="560" cy="160" r="180" fill="${palette.accent}" opacity="0.35" />
    <circle cx="140" cy="600" r="220" fill="${palette.bg}" opacity="0.35" />
    <g font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" fill="${palette.fg}" text-anchor="middle">
      <text x="360" y="${360 - (lines.length - 1) * 28}" font-size="46" font-weight="800">${lines
    .map(
      (line, i) =>
        `<tspan x="360" dy="${i === 0 ? 0 : 56}">${escapeXml(line)}</tspan>`,
    )
    .join('')}</text>
      <text x="360" y="660" font-size="22" font-weight="700" letter-spacing="6" opacity="0.85">NEXGEN TOYS</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SHOPIFY_FILE_BASE = 'https://cdn.shopify.com/s/files/1/0721/9704/6361/files';

export function shopifyImage(
  fileName: string,
  version: number | string,
  width = 720,
): string {
  return `${SHOPIFY_FILE_BASE}/${fileName}?v=${version}&width=${width}`;
}

export const NEXGEN_PRODUCTS: NexGenProduct[] = [
  {
    handle: '1-18-cyber-truck-rc-car-high-speed-remote-control-electric-pickup-truck-with-led-lights-usb-charging',
    title: '1:18 Cyber Truck RC Car — LED Lights & USB Charging',
    priceINR: 1499,
    image: shopifyImage('ChatGPTImageMay18_2026_11_27_29AM.png', 1779087548),
    category: 'rc-cars',
    badge: 'new',
  },
  {
    handle: '1-64-rc-drift-car-with-led-lights-2-4ghz-remote-control-rechargeable-mini-racing-car-toy-for-kids',
    title: '1:64 RC Drift Car with LED Lights & 2.4 GHz Remote',
    priceINR: 1999,
    image: shopifyImage('ChatGPTImageMay18_2026_12_48_56PM.png', 1779102118),
    category: 'rc-cars',
    badge: 'hot',
  },
  {
    handle: '2-wheel-kick-scooter',
    title: '2-Wheel Kick Scooter',
    priceINR: 3999,
    image: shopifyImage('scooter_final_1200.jpg', 1772777120),
    category: 'outdoor-toys',
  },
  {
    handle: 'pastel-bubble-gun-toy',
    title: 'Pastel Bubble Gun Toy',
    priceINR: 750,
    image: shopifyImage('tight_2.jpg', 1772777507),
    category: 'guns',
    badge: 'hot',
  },
  {
    handle: 'dancing-robot-toy',
    title: 'Dancing Robot Toy with Lights & Music',
    priceINR: 750,
    image: shopifyImage(
      '40339582_1-toyshine-toyshine-bot-robot-pioneer-colorful-lights-and-music-all-direction-movement-dancing-robot-toys-for-boys-and-girls-blue-color.webp',
      1771867566,
    ),
    category: 'kid-toys',
  },
  {
    handle: 'dinosaur-self-spell-box',
    title: 'Dinosaur Self-Spell Box',
    priceINR: 750,
    image: shopifyImage('dinosaur_1200_clean.jpg', 1772777028),
    category: 'puzzles',
  },
  {
    handle: 'drift-car',
    title: 'Drift Car',
    priceINR: 1100,
    image: shopifyImage('71S-4Em2fHL._SL1500.jpg', 1775907959),
    category: 'rc-cars',
  },
  {
    handle: 'fish-catching',
    title: 'Fish Catching Game',
    priceINR: 450,
    image: shopifyImage('tight_5.jpg', 1772777186),
    category: 'board-games',
  },
  {
    handle: 'high-speed-f1-racing-remote-control-car-with-led-smoke-powerful-engine-red-edition-2-4ghz-rc-formula-car-for-kids-adults',
    title: 'High-Speed F1 Racing Car — LED Smoke, Red Edition',
    priceINR: 1499,
    image: shopifyImage('rccar_1200_clean.jpg', 1772776885),
    category: 'rc-cars',
    badge: 'best',
  },
  {
    handle: 'hungry-frog-game-for-kids',
    title: 'Hungry Frog Game for Kids',
    priceINR: 730,
    image: shopifyImage('ChatGPTImageSep19_2025_10_55_59PM.png', 1771859701),
    category: 'board-games',
  },
  {
    handle: 'kids-studybook',
    title: 'Kids StudyBook — Early Learning',
    priceINR: 399,
    image: shopifyImage('learning_book_1200_clean.jpg', 1772777451),
    category: 'kid-toys',
  },
  {
    handle: 'musical-cactus-toy',
    title: 'Musical Cactus Toy',
    priceINR: 350,
    image: shopifyImage('converted_9.jpg', 1772777253),
    category: 'kid-toys',
  },
  {
    handle: 'musical-play-foot-piano-mat',
    title: 'Musical Play Foot Piano Mat',
    priceINR: 2500,
    image: shopifyImage('converted_10.jpg', 1772777096),
    category: 'kid-toys',
  },
  {
    handle: 'retroplay-520-handheld-gaming-console',
    title: 'RetroPlay 520 Handheld Gaming Console',
    priceINR: 749,
    image: shopifyImage('game_console_1200_clean.jpg', 1772777483),
    category: 'hand-games',
    badge: 'hot',
  },
  {
    handle: 'rock-crawler-car',
    title: 'Rock Crawler Car',
    priceINR: 999,
    image: shopifyImage('tight_12.jpg', 1772777285),
    category: 'rc-cars',
  },
  {
    handle: 'soft-gel-bead-shooter-with-colorful-camouflage-design',
    title: 'Soft Gel Bead Shooter — Camouflage',
    priceINR: 1499,
    image: shopifyImage('tight_14.jpg', 1772777539),
    category: 'guns',
    badge: 'sold-out',
  },
  {
    handle: 'tethered-tennis',
    title: 'Tethered Tennis',
    priceINR: 550,
    image: shopifyImage('tight_15.jpg', 1772777165),
    category: 'outdoor-toys',
  },
  {
    handle: 'young-scientist-educational-science-kit',
    title: 'Young Scientist Educational Science Kit',
    priceINR: 750,
    image: shopifyImage('young_scientist_1200_clean.jpg', 1772777318),
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
