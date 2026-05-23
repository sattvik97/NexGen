import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {NEXGEN_CATEGORIES} from '~/data/nexgenCatalog';
import {MagneticTilt} from '~/components/MagneticTilt';

/**
 * Real category grid mirroring nexgen.toys collections.
 * Each card links to /collections/{handle} — works against linked stores.
 */
export function FeaturedCategories() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          transition={{duration: 0.6}}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-nexgen-purple/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-nexgen-purple">
            <span className="size-1.5 rounded-full bg-nexgen-orange" />
            Shop by Category
          </span>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl tracking-tight text-nexgen-night">
            Curated collections for{' '}
            <span className="text-gradient">every kind of play</span>
          </h2>
          <p className="mt-3 text-nexgen-night/70">
            From speed-demon RC cars to cuddle-ready plush — discover NexGen's
            full toy universe.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7 lg:gap-8">
          {NEXGEN_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.handle}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.2}}
              transition={{delay: (i % 4) * 0.07, duration: 0.5}}
            >
              <MagneticTilt intensity={0.9} scale={1.02} rounded="rounded-3xl">
              <Link
                to={`/collections/${cat.handle}`}
                className="group relative block overflow-hidden rounded-3xl bg-white ring-1 ring-nexgen-night/5 shadow-sm hover:shadow-2xl transition-all duration-300 will-change-transform"
              >
                {/* gradient wash */}
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${cat.tint} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
                />
                {/* glow ring on hover */}
                <div
                  aria-hidden
                  className={`absolute inset-0 ${cat.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative p-5 sm:p-6 flex flex-col gap-3 min-h-[180px] sm:min-h-[200px]">
                  <motion.div
                    className="text-5xl sm:text-6xl leading-none drop-shadow-sm"
                    whileHover={{scale: 1.15, rotate: -6}}
                    transition={{type: 'spring', stiffness: 200}}
                  >
                    {cat.emoji}
                  </motion.div>
                  <div className="mt-auto">
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-nexgen-night">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-nexgen-night/65 line-clamp-2">
                      {cat.blurb}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-nexgen-orange group-hover:gap-2 transition-all">
                      Explore <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
              </MagneticTilt>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 rounded-full bg-nexgen-night text-white px-6 py-3 font-semibold hover:bg-nexgen-night/90 transition"
          >
            View all collections <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
