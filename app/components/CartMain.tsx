import {useOptimisticCart, type OptimisticCartLine} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <div className={`flex flex-col h-full ${layout === 'page' ? 'mx-auto max-w-3xl px-5 sm:px-6 py-10' : ''}`}>
      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <div className="flex flex-col h-full min-h-0">
          <p id="cart-lines" className="sr-only">Line items</p>
          <ul aria-labelledby="cart-lines" className="flex-1 overflow-y-auto">
            {(cart?.lines?.nodes ?? []).map((line) => {
              if ('parentRelationship' in line && line.parentRelationship?.parent) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
          {cartHasItems && <CartSummary cart={cart} layout={layout} />}
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-4">
      <div className="text-5xl" aria-hidden>🛒</div>
      <h4 className="font-display font-black text-xl text-nexgen-night dark:text-white">Your cart is empty</h4>
      <p className="text-sm text-nexgen-night/70 dark:text-slate-400 max-w-xs">
        Looks like you haven&rsquo;t added anything yet. Let&rsquo;s find something fun!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nexgen-orange to-nexgen-purple text-white font-bold px-6 py-3 text-sm shadow-lg shadow-nexgen-purple/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
