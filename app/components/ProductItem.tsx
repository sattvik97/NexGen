import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {FavoriteButton} from '~/components/FavoriteButton';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const shopifyCompareAt =
    'compareAtPriceRange' in product
      ? product.compareAtPriceRange?.minVariantPrice
      : undefined;
  const priceAmount = parseFloat(price.amount);
  // Every product shows a 50–52% discount. If Shopify already has a higher
  // compare-at price, use it; otherwise derive an MRP from the selling price
  // with a deterministic per-handle percentage so it stays stable.
  const handleHash = (product.handle || '')
    .split('')
    .reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
  const pct = 50 + (handleHash % 3); // 50 | 51 | 52
  const derivedAmount =
    Math.round((priceAmount / (1 - pct / 100)) / 10) * 10;
  const useShopifyMrp =
    shopifyCompareAt &&
    parseFloat(shopifyCompareAt.amount) > priceAmount;
  const compareAt = useShopifyMrp
    ? shopifyCompareAt
    : {amount: String(derivedAmount), currencyCode: price.currencyCode};
  const compareAmount = parseFloat(compareAt.amount);
  const hasMrp = compareAmount > priceAmount;
  const pctOff = hasMrp
    ? Math.round(((compareAmount - priceAmount) / compareAmount) * 100)
    : 0;
  return (
    <Link
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      className="group block rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
    >
      <div className="relative aspect-square w-full bg-nexgen-cream dark:bg-white/5 overflow-hidden">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
          />
        )}
        {hasMrp && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-nexgen-orange text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow">
            {pctOff}% OFF
          </span>
        )}
        <FavoriteButton
          floating
          handle={product.handle}
          title={product.title}
          image={image?.url || ''}
          priceINR={Math.round(priceAmount)}
        />
      </div>
      <div className="p-4 sm:p-5">
        <h4 className="font-display font-bold text-sm sm:text-base text-nexgen-night dark:text-white line-clamp-2 group-hover:text-nexgen-orange transition">
          {product.title}
        </h4>
        <div className="mt-2 inline-flex flex-wrap items-baseline gap-2 tabular-nums">
          <span className="text-base font-display font-black text-nexgen-purple dark:text-nexgen-yellow">
            <Money data={price} />
          </span>
          {hasMrp && (
            <s className="text-xs font-semibold text-nexgen-night/45 dark:text-slate-500">
              <Money data={compareAt} />
            </s>
          )}
        </div>
        <p className="mt-0.5 text-[10px] font-medium text-nexgen-night/55 dark:text-slate-400 tabular-nums">
          excluding GST
        </p>
      </div>
    </Link>
  );
}
