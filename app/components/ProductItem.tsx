import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      className="group block rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
    >
      <div className="aspect-square w-full bg-nexgen-cream dark:bg-white/5 overflow-hidden">
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
      </div>
      <div className="p-4 sm:p-5">
        <h4 className="font-display font-bold text-sm sm:text-base text-nexgen-night dark:text-white line-clamp-2 group-hover:text-nexgen-orange transition">
          {product.title}
        </h4>
        <div className="mt-2 text-base font-display font-black text-nexgen-purple dark:text-nexgen-yellow tabular-nums">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}
