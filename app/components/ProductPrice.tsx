import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  if (compareAtPrice && price) {
    return (
      <div className="inline-flex flex-wrap items-baseline gap-3">
        <span><Money data={price} /></span>
        <s className="text-base font-semibold text-nexgen-night/45 dark:text-slate-500"><Money data={compareAtPrice} /></s>
      </div>
    );
  }
  if (price) return <Money data={price} />;
  return <span>&nbsp;</span>;
}
