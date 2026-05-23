import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs._index';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import type {BlogsQuery} from 'storefrontapi.generated';

type BlogNode = BlogsQuery['blogs']['nodes'][0];

export const meta: Route.MetaFunction = () => {
  return [{title: `Blog | NexGen Toys`}];
};

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
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {blogs};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <section className="relative overflow-hidden bg-gradient-to-br from-nexgen-purple via-nexgen-teal to-nexgen-orange text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Read</p>
          <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">Blogs</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/90">News, guides and stories from the NexGen world.</p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <PaginatedResourceSection<BlogNode> connection={blogs} resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {({node: blog}) => (
            <Link
              key={blog.handle}
              prefetch="intent"
              to={`/blogs/${blog.handle}`}
              className="group block rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition p-6"
            >
              <h2 className="font-display font-black text-xl text-nexgen-night dark:text-white group-hover:text-nexgen-orange transition">{blog.title}</h2>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-nexgen-purple">Read articles →</span>
            </Link>
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;
