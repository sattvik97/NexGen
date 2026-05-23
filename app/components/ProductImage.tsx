import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return (
      <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-nexgen-cream via-white to-nexgen-mist dark:from-white/5 dark:via-white/5 dark:to-white/5 ring-1 ring-nexgen-night/5 dark:ring-white/10" />
    );
  }
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white dark:bg-white/5 ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-xl shadow-nexgen-night/5">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="w-full h-full object-contain p-4 sm:p-8"
      />
    </div>
  );
}
