import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a]">
      <section className="relative overflow-hidden bg-gradient-to-br from-nexgen-teal via-nexgen-purple to-nexgen-orange text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_20%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Browse</p>
          <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">Collections</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/90">Shop by curated themes — the perfect way to find something fun.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-nexgen-cream dark:bg-white/5 ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="4/3"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-nexgen-night/80 via-nexgen-night/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-display font-black text-xl sm:text-2xl text-white drop-shadow">{collection.title}</h3>
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-white/85 font-semibold">Shop now →</span>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
