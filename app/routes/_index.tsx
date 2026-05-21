import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {MockShopNotice} from '~/components/MockShopNotice';
import {NexGenHero} from '~/components/NexGenHero';
import {FeaturedCategories} from '~/components/FeaturedCategories';
import {WhyParentsLove} from '~/components/WhyParentsLove';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'NexGen Toys — Where Imagination Comes to Life'},
    {
      name: 'description',
      content:
        'Premium, safe, educational toys for every age. RC, STEM, plush, puzzles and more — loved by thousands of families.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="bg-nexgen-mist">
      {data.isShopLinked ? null : (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <MockShopNotice />
        </div>
      )}

      <NexGenHero />
      <FeaturedCategories />
      <BestSellers products={data.recommendedProducts} />
      <WhyParentsLove />
      <FeaturedSpotlight collection={data.featuredCollection} />
      <NewsletterCTA />
    </div>
  );
}

/* -------------------- Best sellers carousel-ish grid -------------------- */

function BestSellers({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-nexgen-teal">
              Best Sellers
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl">
              Trending in <span className="text-gradient">play rooms</span>
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 rounded-full bg-nexgen-ink text-white px-5 py-2.5 text-sm font-semibold hover:-translate-y-0.5 transition-transform"
          >
            View all →
          </Link>
        </div>

        <Suspense fallback={<BestSellersSkeleton />}>
          <Await resolve={products}>
            {(response) => (
              <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {response?.products.nodes.map((p, i) => (
                  <motion.li
                    key={p.id}
                    initial={{opacity: 0, y: 24}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: '-80px'}}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.05,
                      ease: 'easeOut',
                    }}
                  >
                    <Link
                      to={`/products/${p.handle}`}
                      className="group block rounded-3xl bg-white ring-1 ring-nexgen-ink/5 shadow-soft overflow-hidden hover:-translate-y-1 transition-transform"
                    >
                      <div className="aspect-square bg-nexgen-cloud overflow-hidden">
                        {p.featuredImage ? (
                          <Image
                            data={p.featuredImage}
                            aspectRatio="1/1"
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold line-clamp-2 min-h-[2.8em]">
                          {p.title}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-extrabold text-nexgen-orange">
                            <Money data={p.priceRange.minVariantPrice} />
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-nexgen-purple opacity-0 group-hover:opacity-100 transition-opacity">
                            Quick add +
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function BestSellersSkeleton() {
  return (
    <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({length: 4}).map((_, i) => (
        <li
          key={i}
          className="rounded-3xl bg-white ring-1 ring-nexgen-ink/5 overflow-hidden"
        >
          <div className="aspect-square bg-nexgen-cloud animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-nexgen-cloud animate-pulse rounded" />
            <div className="h-4 w-1/3 bg-nexgen-cloud animate-pulse rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------- Featured collection spotlight -------------------- */

function FeaturedSpotlight({
  collection,
}: {
  collection: FeaturedCollectionFragment | undefined;
}) {
  if (!collection) return null;
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link
          to={`/collections/${collection.handle}`}
          className="group relative block overflow-hidden rounded-[2.5rem] nexgen-gradient text-white p-10 lg:p-16 min-h-[24rem] shadow-soft"
        >
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            {collection.image ? (
              <Image
                data={collection.image}
                sizes="100vw"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
              Featured Collection
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl text-white">
              {collection.title}
            </h2>
            <p className="mt-4 text-white/85 text-lg max-w-md">
              A hand-picked drop your kids will obsess over. Tap in before it&apos;s
              gone.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-nexgen-ink px-6 py-3 text-sm font-bold group-hover:-translate-y-0.5 transition-transform">
              Shop the collection →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* -------------------- Newsletter -------------------- */

function NewsletterCTA() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-nexgen-ink text-white p-10 lg:p-16 text-center">
          <div
            aria-hidden
            className="absolute -top-20 -left-20 size-72 rounded-full bg-nexgen-orange/40 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-20 size-72 rounded-full bg-nexgen-purple/40 blur-3xl"
          />
          <span className="relative text-xs font-semibold uppercase tracking-widest text-nexgen-yellow">
            NexGen Adventure Club
          </span>
          <h2 className="relative mt-3 text-4xl sm:text-5xl">
            Join the club, unlock the <span className="text-gradient">magic</span>
          </h2>
          <p className="relative mt-4 text-white/75 max-w-xl mx-auto">
            Exclusive discounts, new drops, parenting tips and educational
            activities — straight to your inbox. No spam, promise.
          </p>
          <form
            className="relative mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="parent@example.com"
              className="flex-1 rounded-full bg-white/10 ring-1 ring-white/20 px-5 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-nexgen-orange"
            />
            <button
              type="submit"
              className="rounded-full nexgen-gradient px-6 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Join free
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Storefront queries -------------------- */

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
