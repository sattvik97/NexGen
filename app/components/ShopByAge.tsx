import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {NEXGEN_AGES} from '~/data/nexgenCatalog';
import {MagneticTilt} from '~/components/MagneticTilt';

/**
 * "Shop by Age" — six age-band tiles mirroring the live nexgen.toys homepage.
 */
export function ShopByAge() {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-nexgen-cream to-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          transition={{duration: 0.6}}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-nexgen-teal/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-nexgen-teal">
              <span className="size-1.5 rounded-full bg-nexgen-teal" />
              Shop by Age
            </span>
            <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl text-nexgen-night">
              The right toy, at every stage.
            </h2>
          </div>
          <p className="text-nexgen-night/65 max-w-md">
            From first rattles to pre-teen kits — age-perfect picks vetted by
            parents and educators.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6 lg:gap-7">
          {NEXGEN_AGES.map((age, i) => (
            <motion.div
              key={age.handle}
              initial={{opacity: 0, scale: 0.92}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true, amount: 0.2}}
              transition={{delay: i * 0.06, duration: 0.45}}
            >
              <MagneticTilt intensity={1} scale={1.03} rounded="rounded-2xl">
              <Link
                to={`/collections/${age.handle}`}
                className="group relative block aspect-square rounded-2xl overflow-hidden ring-1 ring-nexgen-night/5 hover:ring-nexgen-orange/40 transition will-change-transform"
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${age.tint} opacity-90 group-hover:opacity-100`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                  <motion.span
                    className="text-4xl sm:text-5xl drop-shadow"
                    whileHover={{y: -4, rotate: 6, scale: 1.1}}
                    transition={{type: 'spring', stiffness: 220}}
                  >
                    {age.emoji}
                  </motion.span>
                  <span className="mt-2 text-sm sm:text-base font-display font-extrabold text-nexgen-night">
                    {age.label}
                  </span>
                </div>
              </Link>
              </MagneticTilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
