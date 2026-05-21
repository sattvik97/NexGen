import {motion} from 'framer-motion';

const PROMISES = [
  {
    title: 'Child Safe Materials',
    body: 'Non-toxic, BIS / ASTM certified. Every toy is tested before it ships.',
    icon: '🛡️',
    tint: 'bg-nexgen-teal/10 text-nexgen-teal',
  },
  {
    title: 'Real Educational Value',
    body: 'Curated by educators to build creativity, motor skills, and STEM thinking.',
    icon: '🎓',
    tint: 'bg-nexgen-purple/10 text-nexgen-purple',
  },
  {
    title: 'Quality Tested',
    body: 'Every batch passes drop, durability, and play-time stress tests.',
    icon: '✅',
    tint: 'bg-nexgen-orange/10 text-nexgen-orange',
  },
  {
    title: 'Fair, Honest Pricing',
    body: 'No inflated MRPs. The price you see is the price that makes sense.',
    icon: '💛',
    tint: 'bg-nexgen-yellow/30 text-nexgen-ink',
  },
  {
    title: 'Fast Delivery',
    body: 'Pan-India dispatch within 24 hours. COD available everywhere.',
    icon: '🚚',
    tint: 'bg-nexgen-teal/10 text-nexgen-teal',
  },
  {
    title: 'Easy Returns',
    body: 'Changed your mind? 30-day no-questions-asked returns. Period.',
    icon: '↩️',
    tint: 'bg-nexgen-purple/10 text-nexgen-purple',
  },
];

export function WhyParentsLove() {
  return (
    <section className="relative py-24 lg:py-32 bg-nexgen-cloud">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-nexgen-orange">
            Why Parents Love NexGen
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Six promises we keep, every order.
          </h2>
          <p className="mt-4 text-nexgen-slate text-lg">
            We obsess over the small things so you don&apos;t have to.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMISES.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-80px'}}
              transition={{duration: 0.45, delay: i * 0.05, ease: 'easeOut'}}
              className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-nexgen-ink/5"
            >
              <span
                className={`inline-flex size-12 items-center justify-center rounded-2xl text-2xl ${p.tint}`}
                aria-hidden
              >
                {p.icon}
              </span>
              <h3 className="mt-5 text-xl font-extrabold">{p.title}</h3>
              <p className="mt-2 text-nexgen-slate leading-relaxed">{p.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
