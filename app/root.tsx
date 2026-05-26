import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {lazy, Suspense, useEffect, useState} from 'react';
const CursorParticles = lazy(() =>
  import('./components/hero/CursorParticles').then((m) => ({default: m.CursorParticles})),
);
import {themeNoFlashScript} from './components/ThemeToggle';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NexGen Toys',
    url: 'https://nexgen.toys',
    logo: 'https://nexgen.toys/cdn/shop/files/nexgen-logo.png',
    sameAs: [
      'https://www.facebook.com/nexgentoys',
      'https://www.instagram.com/nexgentoys',
    ],
  };
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NexGen Toys',
    url: 'https://nexgen.toys',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nexgen.toys/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* No-FOUC theme bootstrap — must run before stylesheets & React */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{__html: themeNoFlashScript}}
        />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ff6b35" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b1020" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NexGen Toys" />
        <meta
          name="description"
          content="NexGen Toys — premium RC cars, helicopters, drones, soft toys, board games and outdoor fun. Toys at best price. Buy new."
        />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NexGen Toys" />
        <meta property="og:title" content="NexGen Toys — Toys at best price. Buy new." />
        <meta
          property="og:description"
          content="Premium RC cars, helicopters, drones, soft toys, board games and outdoor fun for every age."
        />
        <meta property="og:image" content="https://nexgen.toys/cdn/shop/files/nexgen-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NexGen Toys — Toys at best price. Buy new." />
        <meta
          name="twitter:description"
          content="Premium RC cars, helicopters, drones, soft toys, board games and outdoor fun for every age."
        />
        <meta name="twitter:image" content="https://nexgen.toys/cdn/shop/files/nexgen-og.jpg" />
        {/* Load global resets first, app overrides next, then Tailwind utilities last
            so utility classes (text-white, bg-*, etc.) always win the cascade. */}
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={tailwindCss}></link>
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{__html: JSON.stringify(orgJsonLd)}}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{__html: JSON.stringify(siteJsonLd)}}
        />
      </head>
      <body>
        {/* ADA / WCAG — skip-to-content link visible only when focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-nexgen-orange focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function DeferredCursorParticles() {
  // Only mount the cursor canvas after the browser is idle + on hover-capable
  // pointer devices. This removes ~all initial JS work on phones and keeps the
  // hero paint fast on desktop too.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduce) return;
    const w = window as Window & {requestIdleCallback?: (cb: () => void, opts?: {timeout: number}) => number};
    const ric = w.requestIdleCallback;
    const id = ric
      ? ric(() => setReady(true), {timeout: 2000})
      : window.setTimeout(() => setReady(true), 1200);
    return () => {
      if (ric && typeof id === 'number') (window as unknown as {cancelIdleCallback: (n: number) => void}).cancelIdleCallback?.(id);
      else window.clearTimeout(id as number);
    };
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <CursorParticles />
    </Suspense>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
      {/* Site-wide signature cursor sparkle trail (auto-skips on touch + prefers-reduced-motion + deferred to idle) */}
      <DeferredCursorParticles />
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRouteLoaderData<RootLoader>('root');
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const isNotFound = errorStatus === 404;
  const heading = isNotFound ? 'Page not found' : 'Something went wrong';
  const subheading = isNotFound
    ? "We couldn't find what you were looking for. It might have moved, or never existed."
    : "Our team has been notified. Please try again in a moment.";

  const content = (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]"
    >
      <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-nexgen-purple">
          Error {errorStatus}
        </p>
        <h1 className="mt-3 font-display font-black text-4xl sm:text-5xl text-nexgen-night dark:text-white tracking-tight">
          {heading}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-nexgen-night/70 dark:text-slate-300">
          {subheading}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full nexgen-gradient text-white px-6 py-3 text-sm font-bold uppercase tracking-wider shadow-lg shadow-nexgen-orange/30 hover:-translate-y-0.5 transition"
          >
            Go to homepage
          </a>
          <a
            href="/collections/all"
            className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-white/10 ring-1 ring-nexgen-night/15 dark:ring-white/20 text-nexgen-night dark:text-white px-6 py-3 text-sm font-semibold hover:bg-nexgen-mist dark:hover:bg-white/15 transition"
          >
            Browse all toys
          </a>
        </div>
        {!isNotFound && errorMessage && (
          <details className="mt-10 text-left rounded-2xl bg-white dark:bg-white/5 ring-1 ring-nexgen-night/10 dark:ring-white/10 p-4 text-xs text-nexgen-night/70 dark:text-slate-300">
            <summary className="cursor-pointer font-semibold">
              Technical details
            </summary>
            <pre className="mt-3 whitespace-pre-wrap break-words font-mono">
              {errorMessage}
            </pre>
          </details>
        )}
      </div>
    </main>
  );

  // When root loader data is available, wrap the error page in the full
  // site chrome (header + footer + asides) so 404s and runtime errors
  // still feel like the rest of the site.
  if (rootData) {
    return (
      <Analytics.Provider
        cart={rootData.cart}
        shop={rootData.shop}
        consent={rootData.consent}
      >
        <PageLayout {...rootData}>{content}</PageLayout>
      </Analytics.Provider>
    );
  }

  return content;
}
