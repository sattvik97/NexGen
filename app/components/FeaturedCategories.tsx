import {motion} from 'framer-motion';
import {Link} from 'react-router';

type Category = {
  title: string;
  handle: string;
  emoji: string;
  tint: string; // tailwind bg tint
  glow: string; // hover glow class
  blurb: string;
};

const CATEGORIES: Category[] = [
  {
    title: 'RC Toys',
    handle: 'rc-toys',
    emoji: '🏎️',
    tint: 'from-nexgen-orange/20 to-nexgen-orange/5',
    glow: 'hover:glow-orange',
    blurb: 'Speed, control, full-throttle fun',
  },
  {
    title: 'Educational',
    handle: 'educational',
    emoji: '📚',
    tint: 'from-nexgen-purple/20 to-nexgen-purple/5',
    glow: 'hover:glow-purple',
    blurb: 'Learn while you play',
  },
  {
    title: 'Plush Toys',
    handle: 'plush',
    emoji: '🧸',
    tint: 'from-nexgen-yellow/30 to-nexgen-yellow/5',
    glow: 'hover:glow-orange',
    blurb: 'Soft cuddles, big smiles',
  },
  {
    title: 'STEM Learning',
    handle: 'stem',
    emoji: '🔬',
    tint: 'from-nexgen-teal/20 to-nexgen-teal/5',
    glow: 'hover:glow-teal',
    blurb: 'Build, code, experiment',
  },
  {
    title: 'Outdoor',
    handle: 'outdoor',
    emoji: '🛴',
    tint: 'from-nexgen-orange/20 to-nexgen-purple/10',
    glow: 'hover:glow-purple',
    blurb: 'Run, ride, explore',
  },
  {
    title: 'Games & Puzzles',
    handle: 'games',
    emoji: '🧩',
    tint: 'from-nexgen-purple/20 to-nexgen-teal/10',
    glow: 'hover:glow-teal',
    blurb: 'Think it through together',
  },
];

const card = {
  hidden: {opacity: 0, y: 28},
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, delay: i * 0.06, ease: 'easeOut'},
  }),
};

export function FeaturedCategories() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-nexgen-purple">
            Featured Categories
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Pick a world to <span className="text-gradient">explore</span>
          </h2>
          <p className="mt-4 text-nexgen-slate text-lg">
            Curated by parents, loved by kids. Every category is hand-tested for
            safety, joy, and a touch of magic.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.li
              key={cat.handle}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{once: true, margin: '-80px'}}
              variants={card}
            >
              <Link
                to={`/collections/${cat.handle}`}
                className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${cat.tint} ring-1 ring-nexgen-ink/5 p-8 h-64 transition-transform duration-300 hover:-translate-y-2 ${cat.glow}`}
              >
                <div className="absolute -bottom-6 -right-4 text-[10rem] leading-none opacity-90 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {cat.emoji}
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-extrabold">{cat.title}</h3>
                  <p className="mt-2 text-sm font-medium text-nexgen-slate max-w-[60%]">
                    {cat.blurb}
                  </p>
                </div>

                <div className="absolute bottom-6 left-8 inline-flex items-center gap-2 text-sm font-semibold text-nexgen-ink/80">
                  Shop {cat.title}
                  <span
                    className="inline-block transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
