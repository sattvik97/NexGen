import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="group/atc relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-nexgen-orange via-nexgen-purple to-nexgen-teal text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 shadow-lg shadow-nexgen-purple/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <span className="text-base" aria-hidden>🛒</span>
            <span>{children}</span>
          </button>
        </>
      )}
    </CartForm>
  );
}
