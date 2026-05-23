import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div
      aria-labelledby="cart-summary"
      className="shrink-0 border-t border-nexgen-night/10 dark:border-white/10 bg-white dark:bg-[#0a1020] px-5 sm:px-6 py-5 space-y-4"
    >
      <div className="flex items-baseline justify-between">
        <h4 id="cart-summary" className="font-display font-black uppercase text-sm tracking-wider text-nexgen-night/60 dark:text-slate-400">Subtotal</h4>
        <span className="text-2xl font-display font-black text-nexgen-night dark:text-white tabular-nums">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : '—'}
        </span>
      </div>
      <p className="text-[11px] text-nexgen-night/55 dark:text-slate-500">
        Taxes and shipping calculated at checkout.
      </p>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;
  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="block w-full text-center rounded-full bg-gradient-to-r from-nexgen-orange via-nexgen-purple to-nexgen-teal text-white font-bold py-3.5 text-sm sm:text-base shadow-lg shadow-nexgen-purple/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition"
    >
      Continue to Checkout →
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-stretch gap-2">
          <label htmlFor="discount-code-input" className="sr-only">Discount code</label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="flex-1 min-w-0 rounded-full bg-nexgen-mist dark:bg-white/5 ring-1 ring-transparent focus:ring-nexgen-purple/40 focus:bg-white dark:focus:bg-white/10 px-4 py-2 text-sm text-nexgen-night dark:text-white placeholder:text-nexgen-night/45 dark:placeholder:text-slate-500 outline-none transition"
          />
          <button
            type="submit"
            aria-label="Apply discount code"
            className="shrink-0 rounded-full bg-nexgen-night dark:bg-white/15 text-white font-semibold px-4 py-2 text-sm hover:bg-nexgen-night/90 dark:hover:bg-white/25 transition"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex items-stretch gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="flex-1 min-w-0 rounded-full bg-nexgen-mist dark:bg-white/5 ring-1 ring-transparent focus:ring-nexgen-purple/40 focus:bg-white dark:focus:bg-white/10 px-4 py-2 text-sm text-nexgen-night dark:text-white placeholder:text-nexgen-night/45 dark:placeholder:text-slate-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="shrink-0 rounded-full bg-nexgen-night dark:bg-white/15 text-white font-semibold px-4 py-2 text-sm hover:bg-nexgen-night/90 dark:hover:bg-white/25 disabled:opacity-50 transition"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
