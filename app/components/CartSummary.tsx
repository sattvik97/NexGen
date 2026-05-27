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
  const subtotal = cart?.cost?.subtotalAmount;
  const total = cart?.cost?.totalAmount;
  const subtotalNum = subtotal?.amount ? parseFloat(subtotal.amount) : 0;
  const totalNum = total?.amount ? parseFloat(total.amount) : 0;
  const savings = Math.max(0, subtotalNum - totalNum);

  return (
    <div
      aria-labelledby="cart-summary"
      className="shrink-0 border-t border-nexgen-night/10 dark:border-white/10 bg-white dark:bg-[#0a1020] px-5 sm:px-6 py-5 space-y-4"
    >
      <div className="flex items-baseline justify-between">
        <h4 id="cart-summary" className="font-display font-black uppercase text-sm tracking-wider text-nexgen-night/60 dark:text-slate-400">Subtotal</h4>
        <span className="text-2xl font-display font-black text-nexgen-night dark:text-white tabular-nums">
          {subtotal?.amount ? (
            <Money data={subtotal} />
          ) : '—'}
        </span>
      </div>

      {savings > 0 && total?.amount && (
        <div className="flex items-baseline justify-between rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-200/70 dark:ring-emerald-400/25">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Discount savings</span>
          <span className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
            -{subtotal?.currencyCode || 'INR'} {savings.toFixed(2)}
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <h5 className="font-display font-black uppercase text-sm tracking-wider text-nexgen-night/70 dark:text-slate-300">Total after discount</h5>
        <span className="text-xl font-display font-black text-nexgen-purple dark:text-nexgen-yellow tabular-nums">
          {total?.amount ? <Money data={total} /> : '—'}
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

  // Track the apply form so we can surface success / error messages.
  const discountFetcher = useFetcher<{
    errors?: Array<{message?: string; code?: string}>;
    warnings?: Array<{message?: string; code?: string}>;
    cart?: CartApiQueryFragment | null;
  }>({key: 'discount-apply'});
  const discountInput = useRef<HTMLInputElement>(null);
  const isApplying = discountFetcher.state !== 'idle';

  const submittedCode = (
    discountFetcher.formData?.get('discountCode') ?? ''
  )
    .toString()
    .trim()
    .toUpperCase();

  // After the action finishes, decide whether the typed code stuck.
  let message: {tone: 'success' | 'error'; text: string} | null = null;
  if (!isApplying && discountFetcher.data && submittedCode) {
    const applied = (discountFetcher.data.cart?.discountCodes ?? []).some(
      (d) => d?.applicable && d?.code?.toUpperCase() === submittedCode,
    );
    const serverMsg =
      discountFetcher.data.errors?.[0]?.message ||
      discountFetcher.data.warnings?.[0]?.message;
    if (applied) {
      message = {tone: 'success', text: `Code "${submittedCode}" applied.`};
    } else {
      message = {
        tone: 'error',
        text:
          serverMsg ||
          `"${submittedCode}" isn't a valid discount code. Please try another.`,
      };
    }
  }

  // Clear the text input after a successful apply.
  useEffect(() => {
    if (message?.tone === 'success' && discountInput.current) {
      discountInput.current.value = '';
    }
  }, [message?.tone]);

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <UpdateDiscountForm>
          <div className="flex items-center justify-between rounded-full bg-nexgen-teal/10 dark:bg-nexgen-teal/15 px-4 py-2 text-sm">
            <span className="font-semibold text-nexgen-teal dark:text-nexgen-teal/90">
              <span aria-hidden>✓</span> {codes.join(', ')}
            </span>
            <button
              type="submit"
              aria-label="Remove discount"
              className="text-xs font-semibold text-nexgen-night/60 dark:text-slate-400 hover:text-nexgen-night dark:hover:text-white underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>
        </UpdateDiscountForm>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes} fetcherKey="discount-apply">
        <div className={codes.length > 0 ? 'mt-2' : ''}>
          <div className="flex items-stretch gap-2">
            <label htmlFor="discount-code-input" className="sr-only">
              Discount code
            </label>
            <input
              id="discount-code-input"
              ref={discountInput}
              type="text"
              name="discountCode"
              placeholder="Discount code"
              autoComplete="off"
              className="flex-1 min-w-0 rounded-full bg-nexgen-mist dark:bg-white/5 ring-1 ring-transparent focus:ring-nexgen-purple/40 focus:bg-white dark:focus:bg-white/10 px-4 py-2 text-sm text-nexgen-night dark:text-white placeholder:text-nexgen-night/45 dark:placeholder:text-slate-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={isApplying}
              aria-label="Apply discount code"
              className="shrink-0 rounded-full bg-nexgen-night dark:bg-white/15 text-white font-semibold px-4 py-2 text-sm hover:bg-nexgen-night/90 dark:hover:bg-white/25 disabled:opacity-50 transition"
            >
              {isApplying ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {message && (
            <p
              role={message.tone === 'error' ? 'alert' : 'status'}
              className={`mt-2 text-xs font-medium ${
                message.tone === 'success'
                  ? 'text-nexgen-teal dark:text-nexgen-teal/90'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
  fetcherKey,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
  fetcherKey?: string;
}) {
  return (
    <CartForm
      route="/cart"
      fetcherKey={fetcherKey}
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
