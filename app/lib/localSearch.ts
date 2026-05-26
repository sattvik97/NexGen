/**
 * Local fuzzy search over the NexGen catalog.
 *
 * Used as a fallback (and to enrich Shopify Storefront search) so the
 * mock.shop / pre-link development environment still finds real NexGen
 * products by title, handle, category, badge, or even with light typos
 * (e.g. "helicoppter" → RC Helicopters category).
 */

import {
  NEXGEN_PRODUCTS,
  NEXGEN_CATEGORIES,
  type NexGenProduct,
  type NexGenCategoryHandle,
} from '~/data/nexgenCatalog';

/* --------------------------- Token helpers --------------------------- */

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'a',
  'an',
  'of',
  'to',
  'in',
  'on',
  'is',
  'it',
  'me',
  'my',
  'your',
  'best',
  'top',
  'new',
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ');
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[\s\-_/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

/** Levenshtein distance (bounded). */
function editDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost,
      );
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/* ----------------------- Category aliases ---------------------------- */

const CATEGORY_ALIASES: Record<NexGenCategoryHandle, string[]> = {
  'rc-cars': ['rc', 'car', 'cars', 'remote', 'control', 'truck', 'racing', 'drift', 'f1', 'cyber', 'crawler', 'vehicle'],
  'rc-helicopter': ['rc', 'helicopter', 'helicopters', 'chopper', 'copter', 'heli', 'drone', 'flying'],
  'remote-control-toys': ['rc', 'remote', 'control', 'radio'],
  guns: ['gun', 'guns', 'blaster', 'blasters', 'shooter', 'bubble', 'gel', 'bead'],
  'soft-toys': ['soft', 'plush', 'teddy', 'stuffed', 'cuddly'],
  'board-games': ['board', 'game', 'games', 'family', 'tabletop'],
  puzzles: ['puzzle', 'puzzles', 'jigsaw', 'brain', 'spell'],
  'art-and-craft': ['art', 'craft', 'crafts', 'paint', 'painting', 'drawing', 'create'],
  'outdoor-toys': ['outdoor', 'scooter', 'tennis', 'cycle', 'bike', 'sports'],
  'nostalgia-toys': ['retro', 'classic', 'nostalgia', 'vintage'],
  'kid-toys': ['kid', 'kids', 'child', 'children', 'toddler', 'learning', 'educational'],
  'hand-games': ['handheld', 'console', 'gaming', 'retro', 'game'],
  'hot-sellers': ['hot', 'best', 'seller', 'popular', 'trending'],
  'trending-on-instagram': ['trending', 'instagram', 'viral'],
  collectors: ['collector', 'collectors', 'collectible'],
  teens: ['teen', 'teens', 'teenager'],
  'youngster-toys': ['youngster', 'young'],
};

/* --------------------------- Scoring --------------------------------- */

function tokenMatches(queryToken: string, target: string): number {
  if (!target) return 0;
  if (target === queryToken) return 4;
  if (target.startsWith(queryToken) || queryToken.startsWith(target)) return 3;
  if (target.includes(queryToken) || queryToken.includes(target)) return 2;
  const max = queryToken.length >= 6 ? 2 : queryToken.length >= 4 ? 1 : 0;
  if (max > 0) {
    const d = editDistance(queryToken, target, max);
    if (d <= max) return 1;
  }
  return 0;
}

function scoreProduct(product: NexGenProduct, queryTokens: string[]): number {
  if (!queryTokens.length) return 0;
  const titleTokens = tokenize(product.title);
  const handleTokens = tokenize(product.handle);
  const category = NEXGEN_CATEGORIES.find((c) => c.handle === product.category);
  const categoryTokens = category
    ? [
        ...tokenize(category.title),
        ...tokenize(category.handle),
        ...(CATEGORY_ALIASES[product.category] ?? []),
      ]
    : CATEGORY_ALIASES[product.category] ?? [];
  const badgeTokens = product.badge ? [product.badge] : [];

  let score = 0;
  for (const q of queryTokens) {
    let best = 0;
    for (const t of titleTokens) best = Math.max(best, tokenMatches(q, t) * 3);
    for (const t of handleTokens) best = Math.max(best, tokenMatches(q, t) * 2);
    for (const t of categoryTokens) best = Math.max(best, tokenMatches(q, t) * 2);
    for (const t of badgeTokens) best = Math.max(best, tokenMatches(q, t));
    score += best;
  }
  return score;
}

/* ----------------------- Public helpers ------------------------------ */

export function searchLocalCatalog(rawTerm: string): NexGenProduct[] {
  const queryTokens = tokenize(rawTerm);
  if (!queryTokens.length) return [];
  const scored = NEXGEN_PRODUCTS.map((p) => ({p, s: scoreProduct(p, queryTokens)}))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.map((x) => x.p);
}

/* ------------------- Storefront-shaped adapters ---------------------- */

/** Stable, deterministic GID-shaped id for local mock products. */
function localGid(kind: 'Product' | 'ProductVariant', handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) | 0;
  const n = Math.abs(h);
  return `gid://nexgen/${kind}/${n}`;
}

export function toRegularSearchProductNode(p: NexGenProduct) {
  const mrp = p.mrpINR && p.mrpINR > p.priceINR ? p.mrpINR : undefined;
  return {
    __typename: 'Product' as const,
    id: localGid('Product', p.handle),
    handle: p.handle,
    title: p.title,
    publishedAt: '2025-01-01T00:00:00Z',
    trackingParameters: null,
    vendor: 'NexGen Toys',
    selectedOrFirstAvailableVariant: {
      id: localGid('ProductVariant', p.handle),
      image: {
        url: p.image,
        altText: p.title,
        width: 720,
        height: 720,
      },
      price: {amount: String(p.priceINR), currencyCode: 'INR'},
      compareAtPrice: mrp
        ? {amount: String(mrp), currencyCode: 'INR'}
        : null,
      selectedOptions: [],
      product: {handle: p.handle, title: p.title},
    },
  };
}

export function toPredictiveSearchProductNode(p: NexGenProduct) {
  return {
    __typename: 'Product' as const,
    id: localGid('Product', p.handle),
    title: p.title,
    handle: p.handle,
    trackingParameters: null,
    selectedOrFirstAvailableVariant: {
      id: localGid('ProductVariant', p.handle),
      image: {
        url: p.image,
        altText: p.title,
        width: 480,
        height: 480,
      },
      price: {amount: String(p.priceINR), currencyCode: 'INR'},
    },
  };
}
