import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockShopNotice} from '~/components/MockShopNotice';
import {NexGenHero} from '~/components/NexGenHero';
import {FeaturedCategories} from '~/components/FeaturedCategories';
import {ShopByAge} from '~/components/ShopByAge';
import {AllProducts} from '~/components/AllProducts';
import {WhyParentsLove} from '~/components/WhyParentsLove';
import {NewsletterCTA} from '~/components/NewsletterCTA';

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
      <AllProducts />
      <WhyParentsLove />
      <NewsletterCTA />
    </div>
  );
}
