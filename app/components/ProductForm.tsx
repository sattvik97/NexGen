import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="flex flex-col gap-5">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name}>
            <h5 className="font-display font-black uppercase tracking-wider text-xs text-nexgen-night/60 dark:text-slate-400 mb-2">{option.name}</h5>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const pillClass = `inline-flex items-center justify-center min-w-[48px] h-11 px-4 rounded-full text-sm font-semibold transition border-2 ${
                  selected
                    ? 'border-nexgen-purple bg-nexgen-purple/10 text-nexgen-purple dark:bg-nexgen-purple/20 dark:text-white'
                    : 'border-nexgen-night/15 dark:border-white/15 text-nexgen-night dark:text-slate-200 hover:border-nexgen-purple/50 hover:bg-nexgen-purple/5'
                } ${available ? '' : 'opacity-40'} ${exists ? '' : 'cursor-not-allowed opacity-40'}`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className={pillClass}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }
                return (
                  <button
                    type="button"
                    key={option.name + name}
                    className={pillClass}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span>{name}</span>;

  return (
    <span
      aria-label={name}
      className="inline-block size-6 rounded-full ring-1 ring-nexgen-night/15 dark:ring-white/20 overflow-hidden"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </span>
  );
}
