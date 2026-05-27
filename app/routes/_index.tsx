import {lazy, Suspense} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockShopNotice} from '~/components/MockShopNotice';
import {NexGenHero} from '~/components/NexGenHero';
import {FeaturedCategories} from '~/components/FeaturedCategories';
import {ShopByAge} from '~/components/ShopByAge';

const AllProducts = lazy(async () => {
  const module = await import('~/components/AllProducts');
  return {default: module.AllProducts};
});

const WhyParentsLove = lazy(async () => {
  const module = await import('~/components/WhyParentsLove');
  return {default: module.WhyParentsLove};
});

const NexGenStory = lazy(async () => {
  const module = await import('~/components/NexGenStory');
  return {default: module.NexGenStory};
});

const NewsletterCTA = lazy(async () => {
  const module = await import('~/components/NewsletterCTA');
  return {default: module.NewsletterCTA};
});

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'NexGen Toys — Toys at best price. Buy new.'},
    {
      name: 'description',
      content:
        "India's home for safe, educational, and just-plain-fun toys. RC machines, STEM kits, soft toys, blasters, board games and more — straight from nexgen.toys.",
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  const sectionFallback = (
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
      <div className="h-40 rounded-3xl bg-gradient-to-r from-nexgen-night/5 via-nexgen-orange/10 to-nexgen-teal/10 animate-pulse" />
    </div>
  );

  return (
    <div className="bg-nexgen-mist">
      {data.isShopLinked ? null : (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <MockShopNotice />
        </div>
      )}

      <NexGenHero />
      <ShopByAge />
      <FeaturedCategories />
      <Suspense fallback={sectionFallback}>
        <AllProducts />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <WhyParentsLove />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <NexGenStory />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <NewsletterCTA />
      </Suspense>
    </div>
  );
}
