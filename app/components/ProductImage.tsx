import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {Product360Viewer} from '~/components/Product360Viewer';

/** How many evenly-spaced angle frames per product. */
const FRAME_COUNT = 36;

/**
 * Build the candidate frame URL list for a product handle.
 * Expected location: `public/products/<handle>-360/frame-01.jpg` …
 * The viewer falls back to the static image automatically if any frame
 * 404s.
 */
function framesForHandle(handle: string): string[] {
  return Array.from(
    {length: FRAME_COUNT},
    (_, i) => `/products/${handle}-360/frame-${String(i + 1).padStart(2, '0')}.jpg`,
  );
}

export function ProductImage({
  image,
  handle,
}: {
  image: ProductVariantFragment['image'];
  /** Product handle — used to look up 360° frames. */
  handle?: string;
}) {
  if (!image) {
    return (
      <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-nexgen-cream via-white to-nexgen-mist dark:from-white/5 dark:via-white/5 dark:to-white/5 ring-1 ring-nexgen-night/5 dark:ring-white/10" />
    );
  }

  // If we know the product handle, try the 360° viewer. It silently
  // degrades to a normal image if frames are not yet available.
  if (handle && image.url) {
    return (
      <Product360Viewer
        frames={framesForHandle(handle)}
        fallbackSrc={image.url}
        alt={image.altText || 'Product image'}
        aspectClass="aspect-square"
        silentFallback
        className="bg-white dark:bg-white/5 shadow-xl shadow-nexgen-night/5"
      />
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
