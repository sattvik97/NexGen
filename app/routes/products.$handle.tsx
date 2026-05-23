import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product.title ?? 'Product'} | NexGen Toys`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-nexgen-night/60 dark:text-slate-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><a href="/" className="hover:text-nexgen-orange transition">Home</a></li>
            <li aria-hidden>/</li>
            <li><a href="/collections" className="hover:text-nexgen-orange transition">Catalog</a></li>
            <li aria-hidden>/</li>
            <li className="text-nexgen-night dark:text-white font-semibold truncate max-w-[40ch]">{title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-[180px]">
            <ProductImage image={selectedVariant?.image} />
          </div>

          {/* Info card */}
          <div className="rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-xl shadow-nexgen-night/5 p-6 sm:p-8 lg:p-10">
            {vendor && (
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-nexgen-purple">{vendor}</p>
            )}
            <h1 className="mt-1 font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-nexgen-night dark:text-white">
              {title}
            </h1>
            <div className="mt-4 text-2xl sm:text-3xl font-display font-black text-nexgen-night dark:text-white">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nexgen-teal/10 dark:bg-nexgen-teal/15 text-nexgen-teal px-3 py-1"><span aria-hidden>🛡️</span> BIS Certified</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nexgen-orange/10 dark:bg-nexgen-orange/15 text-nexgen-orange px-3 py-1"><span aria-hidden>🚚</span> Ships in 24h</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nexgen-purple/10 dark:bg-nexgen-purple/15 text-nexgen-purple px-3 py-1"><span aria-hidden>↩️</span> 30-Day Returns</span>
            </div>

            <div className="mt-6">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            {/* Description */}
            <div className="mt-8 pt-6 border-t border-nexgen-night/10 dark:border-white/10">
              <h2 className="font-display font-black uppercase tracking-wider text-sm text-nexgen-night/60 dark:text-slate-400">Description</h2>
              <div
                className="mt-3 prose prose-sm sm:prose-base max-w-none text-nexgen-night/80 dark:text-slate-300 [&_strong]:text-nexgen-night dark:[&_strong]:text-white [&_a]:text-nexgen-orange [&_a]:underline"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
