import {useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.page.title ?? 'Page'} | NexGen Toys`}];
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
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  const isContactPage = page.handle === 'contact';

  return (
    <article className="bg-nexgen-mist dark:bg-[#070b1a]">
      <header className="relative overflow-hidden bg-gradient-to-br from-nexgen-purple via-nexgen-orange to-nexgen-teal text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">{page.title}</h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        {isContactPage ? (
          <div className="space-y-6 rounded-3xl bg-white/95 p-6 sm:p-8 shadow-soft ring-1 ring-nexgen-night/10 dark:bg-[#0d1326] dark:ring-white/10">
            <p className="text-base sm:text-lg leading-relaxed text-nexgen-night/80 dark:text-slate-300">
              We are here to help with order updates, product questions, returns, and bulk gifting inquiries.
              Reach out and the NexGen team will get back to you as quickly as possible.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:toys.nexgen@gmail.com"
                className="group flex items-center gap-3 rounded-2xl bg-nexgen-orange/10 px-4 py-3 ring-1 ring-nexgen-orange/30 transition hover:bg-nexgen-orange/15"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-nexgen-orange ring-1 ring-nexgen-orange/20">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 8 8 6 8-6" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-nexgen-night/60 dark:text-slate-400">
                    Email
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-nexgen-night dark:text-white group-hover:underline">
                    toys.nexgen@gmail.com
                  </span>
                </span>
              </a>

              <a
                href="https://www.instagram.com/nexgen_toys?igsh=dGJ4Ynl5ZnZldGM0"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-nexgen-purple/10 px-4 py-3 ring-1 ring-nexgen-purple/25 transition hover:bg-nexgen-purple/15"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-nexgen-purple ring-1 ring-nexgen-purple/20">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-nexgen-night/60 dark:text-slate-400">
                    Instagram
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-nexgen-night dark:text-white group-hover:underline">
                    @nexgen_toys
                  </span>
                </span>
              </a>
            </div>

            <div className="rounded-2xl bg-nexgen-teal/10 px-4 py-4 ring-1 ring-nexgen-teal/30">
              <h2 className="font-display font-black text-xl text-nexgen-night dark:text-white">Support Hours</h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-nexgen-night/80 dark:text-slate-300">
                Monday to Saturday, 10:00 AM to 7:00 PM (IST). We usually respond within one business day.
              </p>
            </div>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{__html: page.body}}
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-nexgen-night/85 dark:text-slate-300 [&_h2]:font-display [&_h2]:font-black [&_h2]:text-nexgen-night dark:[&_h2]:text-white [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-nexgen-night dark:[&_h3]:text-white [&_a]:text-nexgen-orange [&_a]:underline [&_strong]:text-nexgen-night dark:[&_strong]:text-white"
          />
        )}
      </div>
    </article>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
