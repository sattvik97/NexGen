import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * If the line is a parent line that has child components (like warranties or gift wrapping), they are
 * rendered nested below the parent line.
 */
export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} className="px-5 sm:px-6 py-5 border-b border-nexgen-night/10 dark:border-white/10">
      <div className="flex gap-4">
        {image && (
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => { if (layout === 'aside') close(); }}
            className="shrink-0 block size-20 sm:size-24 overflow-hidden rounded-xl bg-nexgen-cream dark:bg-white/5 ring-1 ring-nexgen-night/5 dark:ring-white/10"
          >
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={96}
              loading="lazy"
              width={96}
              className="w-full h-full object-cover"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => { if (layout === 'aside') close(); }}
            className="block"
          >
            <p className="font-bold text-sm sm:text-base text-nexgen-night dark:text-white line-clamp-2 hover:text-nexgen-orange transition-colors">
              {product.title}
            </p>
          </Link>
          {selectedOptions.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-nexgen-night/60 dark:text-slate-400">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  <span className="font-semibold">{option.name}:</span> {option.value}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-nexgen-night dark:text-white">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="cart-line-children">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="inline-flex items-center gap-1 rounded-full ring-1 ring-nexgen-night/15 dark:ring-white/15 overflow-hidden text-sm">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="size-9 sm:size-8 inline-flex items-center justify-center hover:bg-nexgen-night/5 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          −
        </button>
      </CartLineUpdateButton>
      <span className="min-w-[24px] text-center font-semibold text-nexgen-night dark:text-white tabular-nums">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="size-9 sm:size-8 inline-flex items-center justify-center hover:bg-nexgen-night/5 dark:hover:bg-white/10 disabled:opacity-40 transition"
        >
          +
        </button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        aria-label="Remove line item"
        className="size-9 sm:size-8 inline-flex items-center justify-center text-nexgen-night/60 dark:text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition border-l border-nexgen-night/10 dark:border-white/10"
        title="Remove"
      >
        <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h14M8 6V4h4v2m-6 0v10a1 1 0 001 1h6a1 1 0 001-1V6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
