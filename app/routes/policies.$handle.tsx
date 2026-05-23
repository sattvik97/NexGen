import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.policy.title ?? 'Policy'} | NexGen Toys`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <article className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <header className="relative overflow-hidden bg-gradient-to-br from-nexgen-night via-nexgen-purple to-nexgen-orange text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
          <Link to="/policies" className="inline-flex items-center gap-1 text-sm font-semibold text-white/85 hover:text-white transition">← Back to Policies</Link>
          <h1 className="mt-3 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">{policy.title}</h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div
          dangerouslySetInnerHTML={{__html: policy.body}}
          className="prose prose-sm sm:prose-base max-w-none text-nexgen-night/85 dark:text-slate-300 [&_h2]:font-display [&_h2]:font-black [&_h2]:text-nexgen-night dark:[&_h2]:text-white [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-nexgen-night dark:[&_h3]:text-white [&_a]:text-nexgen-orange [&_a]:underline [&_strong]:text-nexgen-night dark:[&_strong]:text-white"
        />
      </div>
    </article>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
