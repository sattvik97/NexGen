import {data, redirect} from 'react-router';
import type {Route} from './+types/cart.add.$handle';

/**
 * Resource route: POST /cart/add/:handle
 *
 * Looks up the first available variant of a Shopify product by `handle`
 * (using mock.shop locally or the linked store in production), adds one
 * unit to the cart, and returns JSON so callers using `fetcher.Form`
 * stay on the current page. Used by the "+" quick-add button on the
 * homepage catalog grid, where products come from the static
 * NEXGEN_PRODUCTS catalog and don't carry variant IDs.
 */

const PRODUCT_VARIANT_BY_HANDLE_QUERY = `#graphql
  query ProductFirstVariant($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      variants(first: 1) {
        nodes {
          id
          availableForSale
        }
      }
    }
  }
` as const;

/**
 * Fallback used in local development with mock.shop, where the
 * NEXGEN_PRODUCTS catalog handles don't match the demo store. Grabs
 * a deterministic variant from the demo catalog so each homepage
 * handle maps to a different cart line (instead of every "+" click
 * adding the same product).
 */
const ANY_AVAILABLE_VARIANT_QUERY = `#graphql
  query AnyAvailableVariant($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 20) {
      nodes {
        title
        variants(first: 1) {
          nodes {
            id
            availableForSale
          }
        }
      }
    }
  }
` as const;

function hashHandle(handle: string) {
  let h = 0;
  for (let i = 0; i < handle.length; i++) {
    h = (h * 31 + handle.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export async function action({request, context, params}: Route.ActionArgs) {
  const {cart, storefront} = context;
  const handle = params.handle;

  if (!handle) {
    return data({ok: false, error: 'missing-handle'}, {status: 400});
  }

  let variantId: string | undefined;

  try {
    const result = await storefront.query(PRODUCT_VARIANT_BY_HANDLE_QUERY, {
      variables: {handle},
    });
    variantId = result?.product?.variants?.nodes?.[0]?.id;
  } catch {
    // Storefront query failed — fall through.
  }

  // Local-dev fallback: deterministically map each handle to a different
  // mock.shop variant so every "+" click adds a distinct line.
  if (!variantId) {
    try {
      const fallback = await storefront.query(ANY_AVAILABLE_VARIANT_QUERY);
      const available = (fallback?.products?.nodes ?? []).filter(
        (p: {variants: {nodes: Array<{availableForSale: boolean; id: string}>}}) =>
          p?.variants?.nodes?.[0]?.availableForSale,
      );
      if (available.length > 0) {
        const idx = hashHandle(handle) % available.length;
        variantId = available[idx]?.variants?.nodes?.[0]?.id;
      }
    } catch {
      // ignore
    }
  }

  if (!variantId) {
    return data(
      {ok: false, error: 'variant-not-found', handle},
      {status: 404},
    );
  }

  const addResult = await cart.addLines([
    {merchandiseId: variantId, quantity: 1},
  ]);

  const headers = cart.setCartId(addResult.cart.id);
  return data(
    {ok: true, handle, addedAt: Date.now()},
    {status: 200, headers},
  );
}

export async function loader() {
  return redirect('/cart');
}

export default function Component() {
  return null;
}
