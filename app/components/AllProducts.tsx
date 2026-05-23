import {useMemo, useState} from 'react';
import {Link} from 'react-router';
import {motion, AnimatePresence} from 'framer-motion';
import {
  NEXGEN_PRODUCTS,
  NEXGEN_CATEGORIES,
  formatINR,
  type NexGenCategoryHandle,
  type NexGenProduct,
} from '~/data/nexgenCatalog';
import {MagneticTilt} from '~/components/MagneticTilt';

type Filter = 'all' | NexGenCategoryHandle;

const FILTER_CHIPS: {key: Filter; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'rc-cars', label: 'RC Cars'},
  {key: 'guns', label: 'Blasters'},
  {key: 'kid-toys', label: 'Kid Toys'},
  {key: 'outdoor-toys', label: 'Outdoor'},
  {key: 'board-games', label: 'Games'},
  {key: 'hand-games', label: 'Consoles'},
  {key: 'puzzles', label: 'Puzzles'},
];

/**
 * Full nexgen.toys catalog — all 18 products with filter chips and
 * scroll-triggered staggered entry.
 */
export function AllProducts() {
  const [filter, setFilter] = useState<Filter>('all');

  const products = useMemo(
    () =>
      filter === 'all'
        ? NEXGEN_PRODUCTS
        : NEXGEN_PRODUCTS.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <section className="relative py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          transition={{duration: 0.6}}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-nexgen-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-nexgen-orange">
              <span className="size-1.5 rounded-full bg-nexgen-orange" />
              The Full Catalog
            </span>
            <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl text-nexgen-night tracking-tight">
              Every toy. <span className="text-gradient">Hand-picked.</span>
            </h2>
            <p className="mt-2 text-nexgen-night/65 max-w-xl">
              {NEXGEN_PRODUCTS.length} products live from nexgen.toys — RC
              machines, blasters, learning kits, outdoor gear & more.
            </p>
          </div>

          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap rounded-full bg-nexgen-night/5 hover:bg-nexgen-night/10 text-nexgen-night px-5 py-2.5 text-sm font-semibold transition"
          >
            Browse all <span aria-hidden>→</span>
          </Link>
        </motion.div>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          {FILTER_CHIPS.map((chip) => {
            const active = filter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => setFilter(chip.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'nexgen-gradient text-white shadow-md shadow-nexgen-orange/30'
                    : 'bg-nexgen-night/5 text-nexgen-night/70 hover:bg-nexgen-night/10'
                }`}
                type="button"
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7 lg:gap-8"
        >
          <AnimatePresence initial={false}>
            {products.map((p, i) => (
              <ProductCard key={p.handle} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({product, index}: {product: NexGenProduct; index: number}) {
  const cat = NEXGEN_CATEGORIES.find((c) => c.handle === product.category);
  return (
    <motion.article
      layout
      initial={{opacity: 0, y: 26}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10, scale: 0.95}}
      transition={{duration: 0.4, delay: (index % 4) * 0.05}}
      className="relative"
    >
      <MagneticTilt intensity={0.8} scale={1.02} rounded="rounded-3xl">
        <div className="group relative flex flex-col rounded-3xl bg-white ring-1 ring-nexgen-night/5 overflow-hidden shadow-sm hover:shadow-2xl hover:ring-nexgen-orange/30 transition-all">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square bg-nexgen-cream overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          {product.badge && <Badge type={product.badge} />}

          {/* Quick add hint */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="m-2 rounded-2xl bg-nexgen-night/85 backdrop-blur text-white text-center text-xs font-semibold py-2.5">
              View details →
            </div>
          </div>
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        {cat && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-nexgen-purple/80">
            {cat.title}
          </span>
        )}
        <Link
          to={`/products/${product.handle}`}
          className="font-semibold text-sm sm:text-[15px] text-nexgen-night leading-snug line-clamp-2 hover:text-nexgen-orange transition"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display font-extrabold text-base sm:text-lg text-nexgen-night">
            {formatINR(product.priceINR)}
          </span>
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            disabled={product.badge === 'sold-out'}
            className="inline-flex size-9 items-center justify-center rounded-full nexgen-gradient text-white shadow-md shadow-nexgen-orange/30 hover:scale-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-50"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
        </div>
      </MagneticTilt>
    </motion.article>
  );
}

function Badge({type}: {type: NonNullable<NexGenProduct['badge']>}) {
  const map: Record<string, {label: string; cls: string}> = {
    hot: {label: '🔥 Hot', cls: 'bg-nexgen-orange text-white'},
    new: {label: '✨ New', cls: 'bg-nexgen-purple text-white'},
    best: {label: '⭐ Best', cls: 'bg-nexgen-yellow text-nexgen-night'},
    'sold-out': {label: 'Sold out', cls: 'bg-nexgen-night text-white'},
  };
  const b = map[type];
  return (
    <span
      className={`absolute top-2 left-2 z-10 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-md ${b.cls}`}
    >
      {b.label}
    </span>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
