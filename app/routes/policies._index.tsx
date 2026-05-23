import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <section className="relative overflow-hidden bg-gradient-to-br from-nexgen-night via-nexgen-purple to-nexgen-teal text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Legal</p>
          <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl tracking-tight">Policies</h1>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <ul className="divide-y divide-nexgen-night/10 dark:divide-white/10 rounded-2xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 overflow-hidden">
          {policies.map((policy) => (
            <li key={policy.id}>
              <Link
                to={`/policies/${policy.handle}`}
                className="flex items-center justify-between px-5 sm:px-6 py-4 text-nexgen-night dark:text-slate-100 hover:bg-nexgen-mist dark:hover:bg-white/5 hover:text-nexgen-orange transition"
              >
                <span className="font-display font-bold">{policy.title}</span>
                <span aria-hidden className="text-nexgen-purple">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
