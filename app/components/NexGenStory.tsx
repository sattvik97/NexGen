import {useCallback, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {Product360Viewer} from '~/components/Product360Viewer';

const STORY_IMAGE =
  'https://nexgen.toys/cdn/shop/files/ChatGPTImageMay18_2026_11_27_29AM.png?v=1779087548&width=720';

// Drop 36 angle photos of the Cyber Truck named frame-01.jpg ... frame-36.jpg
// into public/products/cyber-truck-360/ and the viewer becomes interactive.
const FRAME_COUNT = 36;
const CYBER_TRUCK_360_FRAMES = Array.from(
  {length: FRAME_COUNT},
  (_, i) => `/products/cyber-truck-360/frame-${String(i + 1).padStart(2, '0')}.jpg`,
);

type Testimonial = {
  name: string;
  comment: string;
  product: {title: string; handle: string; image: string};
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Aarav S.',
    comment:
      "My 6-year-old hasn't put the Cyber Truck down since it arrived. Build quality feels much sturdier than the cheap RC cars from the local market. LED lights are a huge hit at night.",
    product: {
      title: '1:18 Cyber Truck RC Car',
      handle:
        '1-18-cyber-truck-rc-car-high-speed-remote-control-electric-pickup-truck-with-led-lights-usb-charging',
      image:
        'https://nexgen.toys/cdn/shop/files/ChatGPTImageMay18_2026_11_27_29AM.png?v=1779087548&width=240',
    },
  },
  {
    name: 'Priya K.',
    comment:
      'Ordered the Bubble Gun for my daughter\u2019s birthday party. Worked flawlessly, kids were obsessed. Packaging was thoughtful and shipping was quick to Bengaluru.',
    product: {
      title: 'Pastel Bubble Gun Toy',
      handle: 'pastel-bubble-gun-toy',
      image:
        'https://nexgen.toys/cdn/shop/files/tight_2.jpg?v=1772777507&width=240',
    },
  },
  {
    name: 'Rohan M.',
    comment:
      'Genuine product, real photos, real price. F1 car is fast and the smoke effect is a fun touch. My son and I race it every evening \u2014 worth every rupee.',
    product: {
      title: 'High-Speed F1 Racing Car',
      handle:
        'high-speed-f1-racing-remote-control-car-with-led-smoke-powerful-engine-red-edition-2-4ghz-rc-formula-car-for-kids-adults',
      image:
        'https://nexgen.toys/cdn/shop/files/rccar_1200_clean.jpg?v=1772776885&width=240',
    },
  },
  {
    name: 'Neha R.',
    comment:
      'Bought the dancing robot for my 4-year-old niece. The lights and music had every kid at the party glued to it. Solid build, no rough edges, BIS mark on the box \u2014 exactly what I wanted to see.',
    product: {
      title: 'Dancing Bot Robot Toy',
      handle: 'toyshine-bot-robot-pioneer-colorful-lights-music',
      image:
        'https://nexgen.toys/cdn/shop/files/40339582_1-toyshine-toyshine-bot-robot-pioneer-colorful-lights-and-music-all-direction-movement-dancing-robot-toys-for-boys-and-girls-blue-color.webp?v=1771867566&width=240',
    },
  },
  {
    name: 'Vikram J.',
    comment:
      "Delivered in two days to Hyderabad, packed beautifully. The dinosaur walks, roars and the eyes light up \u2014 my son thinks it's magic. Customer support replied within an hour when I had a question.",
    product: {
      title: 'Walking Dinosaur Toy',
      handle: 'walking-roaring-dinosaur-toy',
      image:
        'https://nexgen.toys/cdn/shop/files/dinosaur_1200_clean.jpg?v=1772777028&width=240',
    },
  },
  {
    name: 'Ananya P.',
    comment:
      'Honestly skeptical about buying scooters online, but this one arrived perfectly assembled. Smooth ride, good brakes, and my 7-year-old gained the confidence to ride to school in a week.',
    product: {
      title: 'Kids Kick Scooter',
      handle: 'kids-kick-scooter',
      image:
        'https://nexgen.toys/cdn/shop/files/scooter_final_1200.jpg?v=1772777120&width=240',
    },
  },
  {
    name: 'Suresh T.',
    comment:
      "Whole family was at the gifting counter for Diwali \u2014 NexGen's hampers saved me. Quality far above the price tag. Will buy again for Rakhi.",
    product: {
      title: 'Birthday Gift Hamper',
      handle: 'kids-gift-hamper',
      image:
        'https://nexgen.toys/cdn/shop/files/71S-4Em2fHL._SL1500.jpg?v=1775907959&width=240',
    },
  },
  {
    name: 'Meera D.',
    comment:
      'What I loved most: the product matched the photo. No exaggeration, no Photoshop. The 1:18 Cyber Truck looks premium in hand and the controls are tight \u2014 even my husband ended up playing.',
    product: {
      title: '1:18 Cyber Truck RC Car',
      handle:
        '1-18-cyber-truck-rc-car-high-speed-remote-control-electric-pickup-truck-with-led-lights-usb-charging',
      image:
        'https://nexgen.toys/cdn/shop/files/ChatGPTImageMay18_2026_11_27_29AM.png?v=1779087548&width=240',
    },
  },
  {
    name: 'Karthik V.',
    comment:
      'Real human picked up the phone when I called about an order change. Resolved in under five minutes. Toys arrived on time. Bookmarked the site.',
    product: {
      title: 'Pastel Bubble Gun Toy',
      handle: 'pastel-bubble-gun-toy',
      image:
        'https://nexgen.toys/cdn/shop/files/tight_2.jpg?v=1772777507&width=240',
    },
  },
];

function StarRow() {
  return (
    <div className="flex items-center justify-center gap-1 text-nexgen-orange" aria-label="5 out of 5 stars">
      {Array.from({length: 5}).map((_, i) => (
        <svg key={i} className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.6l2.92 5.92 6.54.95-4.73 4.61 1.12 6.51L12 17.77l-5.85 3.07 1.12-6.51L2.54 9.47l6.54-.95L12 2.6z" />
        </svg>
      ))}
    </div>
  );
}

export function NexGenStory() {
  return (
    <section className="bg-white dark:bg-[#070b1a] py-16 sm:py-24" aria-labelledby="nexgen-story">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <p
          id="nexgen-story"
          className="text-center text-[11px] sm:text-xs font-bold uppercase tracking-[0.32em] text-nexgen-night/70 dark:text-slate-400"
        >
          The NexGen Story
        </p>

        {/* Story */}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{opacity: 0, x: -24}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.6}}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-nexgen-orange/20 via-nexgen-purple/15 to-nexgen-teal/20 blur-2xl" aria-hidden />
            <Product360Viewer
              frames={CYBER_TRUCK_360_FRAMES}
              fallbackSrc={STORY_IMAGE}
              alt="1:18 Cyber Truck RC car"
              aspectClass="aspect-square"
              silentFallback
              className="relative"
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0, x: 24}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.6, delay: 0.1}}
            className="text-center lg:text-left"
          >
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-nexgen-night dark:text-white">
              We&apos;re parents first.<br className="hidden sm:block" /> A toy store second.
            </h2>
            <p className="mt-5 text-nexgen-night/75 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              NexGen started in a small living room in Delhi, with two tired parents
              and a pile of toys that kept breaking, kept disappointing, or kept
              costing way more than they should. We were done buying things online
              that looked nothing like the photos.
            </p>
            <p className="mt-4 text-nexgen-night/75 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              So we started doing the boring work ourselves &mdash; opening boxes,
              checking BIS marks, dropping cars on tiled floors, letting our own
              kids play with everything for a week before it goes live. If it
              survives our two and a half year old, it earns a spot on the site.
            </p>
            <p className="mt-4 text-nexgen-night/75 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              Honest photos. Honest prices. A real human picks up the phone if
              something&apos;s off. That&apos;s the whole thing.
            </p>
            <div className="mt-7">
              <Link
                to="/pages/about"
                className="inline-flex items-center gap-2 rounded-full border-2 border-nexgen-night dark:border-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-nexgen-night dark:text-white hover:bg-nexgen-night hover:text-white dark:hover:bg-white dark:hover:text-nexgen-night transition"
              >
                Trace the journey that shaped us
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trusted by our community */}
        <div className="mt-20 sm:mt-28">
          <h3 className="text-center font-display italic text-2xl sm:text-3xl text-nexgen-night dark:text-white">
            Trusted by our community
          </h3>

          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>
      </div>
    </section>
  );
}

function TestimonialsCarousel({testimonials}: {testimonials: Testimonial[]}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const pages = Math.max(
      1,
      Math.round(el.scrollWidth / Math.max(el.clientWidth, 1)),
    );
    setPageCount(pages);
    const current = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
    setActivePage(Math.min(Math.max(current, 0), pages - 1));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    measure();
    const onScroll = () => {
      const current = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
      setActivePage(current);
    };
    el.addEventListener('scroll', onScroll, {passive: true});
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [measure]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({left: dir * el.clientWidth, behavior: 'smooth'});
  };

  const goToPage = (page: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({left: page * el.clientWidth, behavior: 'smooth'});
  };

  const canPrev = activePage > 0;
  const canNext = activePage < pageCount - 1;

  return (
    <div className="relative mt-10">
      {/* Prev / Next buttons — visible from sm+, overlay-style */}
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        aria-label="Previous testimonials"
        className="hidden sm:flex absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 size-11 items-center justify-center rounded-full bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/10 dark:ring-white/15 shadow-lg text-nexgen-night dark:text-white hover:bg-nexgen-orange hover:text-white hover:ring-nexgen-orange transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-[#0d1326] disabled:hover:text-nexgen-night dark:disabled:hover:text-white"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        aria-label="Next testimonials"
        className="hidden sm:flex absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 size-11 items-center justify-center rounded-full bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/10 dark:ring-white/15 shadow-lg text-nexgen-night dark:text-white hover:bg-nexgen-orange hover:text-white hover:ring-nexgen-orange transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-[#0d1326] disabled:hover:text-nexgen-night dark:disabled:hover:text-white"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-6 sm:gap-8 pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
        tabIndex={0}
      >
        {testimonials.map((t, idx) => (
          <motion.figure
            key={`${t.name}-${idx}`}
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-60px'}}
            transition={{duration: 0.4}}
            className="snap-start shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 flex flex-col items-center text-center px-1"
          >
            <StarRow />
            <figcaption className="mt-3 font-display font-bold text-nexgen-night dark:text-white">
              {t.name}
            </figcaption>
            <blockquote className="mt-3 max-w-xs text-sm leading-relaxed text-nexgen-night/75 dark:text-slate-300">
              {t.comment}
            </blockquote>
            <Link
              to={`/products/${t.product.handle}`}
              prefetch="intent"
              className="mt-5 flex w-full max-w-xs items-center gap-3 rounded-xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/10 dark:ring-white/10 p-3 hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-nexgen-cream dark:bg-white/5 flex items-center justify-center">
                <img
                  src={t.product.image}
                  alt={t.product.title}
                  loading="lazy"
                  className="w-full h-full object-contain p-1"
                />
              </span>
              <span className="text-sm font-semibold text-nexgen-night dark:text-white underline decoration-nexgen-night/30 dark:decoration-white/40 underline-offset-4 text-left">
                {t.product.title}
              </span>
            </Link>
          </motion.figure>
        ))}
      </div>

      {/* Pagination dots */}
      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({length: pageCount}).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`Go to testimonials page ${i + 1}`}
              aria-current={i === activePage ? 'true' : undefined}
              className={`h-2 rounded-full transition-all ${
                i === activePage
                  ? 'w-6 bg-nexgen-orange'
                  : 'w-2 bg-nexgen-night/20 dark:bg-white/25 hover:bg-nexgen-night/40 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
