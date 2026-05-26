import {Link, useFetcher} from 'react-router';
import {useFavorites} from '~/lib/favorites';
import {FavoriteButton} from '~/components/FavoriteButton';
import {useAside} from '~/components/Aside';
import {formatINR} from '~/data/nexgenCatalog';

export const meta = () => [{title: 'Your Favorites | NexGen Toys'}];

export default function FavoritesPage() {
  const {items, clear} = useFavorites();
  const empty = items.length === 0;

  return (
    <div className="bg-nexgen-mist dark:bg-[#070b1a] min-h-[60vh]">
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-nexgen-purple to-nexgen-orange text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,white_0%,transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Favorites</p>
          <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl tracking-tight">
            {empty ? 'No favorites yet' : `Your favorites (${items.length})`}
          </h1>
          <p className="mt-3 text-white/85 text-sm sm:text-base max-w-xl">
            {empty
              ? 'Tap the heart on any product to save it here for later.'
              : 'Saved on this device. Add to cart whenever you’re ready.'}
          </p>
          {!empty && (
            <button
              type="button"
              onClick={() => {
                if (
                  typeof window !== 'undefined' &&
                  window.confirm('Remove all favorites?')
                ) {
                  clear();
                }
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-nexgen-night transition"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        {empty ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <FavoriteCard key={item.handle} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FavoriteCard({
  item,
}: {
  item: ReturnType<typeof useFavorites>['items'][number];
}) {
  const fetcher = useFetcher<{ok?: boolean}>();
  const {open} = useAside();
  const isAdding = fetcher.state !== 'idle';
  const justAdded = fetcher.state === 'idle' && fetcher.data?.ok === true;

  if (justAdded) {
    // Pop the drawer on successful add.
    if (typeof window !== 'undefined') {
      queueMicrotask(() => open('cart'));
    }
  }

  return (
    <li>
      <article className="group relative flex flex-col rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10 shadow-sm hover:shadow-xl transition overflow-hidden">
        <Link to={`/products/${item.handle}`} className="block">
          <div className="relative aspect-square bg-nexgen-cream dark:bg-white/5 overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🎁</div>
            )}
            <FavoriteButton
              floating
              handle={item.handle}
              title={item.title}
              image={item.image}
              priceINR={item.priceINR}
              mrpINR={item.mrpINR}
            />
          </div>
        </Link>

        <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
          <Link
            to={`/products/${item.handle}`}
            className="font-semibold text-sm sm:text-[15px] text-nexgen-night dark:text-white leading-snug line-clamp-2 hover:text-nexgen-orange transition"
          >
            {item.title}
          </Link>
          <div className="tabular-nums">
            <p className="font-display font-extrabold text-base text-nexgen-night dark:text-white">
              {formatINR(item.priceINR)}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-nexgen-night/55 dark:text-slate-400">
              excluding GST
            </p>
          </div>
          <fetcher.Form
            method="post"
            action={`/cart/add/${item.handle}`}
            className="mt-auto pt-1"
          >
            <button
              type="submit"
              disabled={isAdding}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full nexgen-gradient text-white font-bold text-sm py-2.5 shadow-md shadow-nexgen-orange/30 hover:scale-[1.02] active:scale-95 transition disabled:opacity-70"
            >
              {isAdding ? 'Adding…' : justAdded ? 'Added ✓' : 'Add to cart'}
            </button>
          </fetcher.Form>
        </div>
      </article>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 rounded-3xl bg-white dark:bg-[#0d1326] ring-1 ring-nexgen-night/5 dark:ring-white/10">
      <div className="text-6xl mb-3" aria-hidden>💖</div>
      <p className="text-nexgen-night/70 dark:text-slate-400 mb-6">
        Your favorites list is empty.
      </p>
      <Link
        to="/collections/all"
        prefetch="intent"
        className="inline-flex items-center gap-2 rounded-full nexgen-gradient text-white font-bold px-6 py-3 text-sm shadow-md shadow-nexgen-orange/30 hover:scale-[1.03] active:scale-95 transition"
      >
        Browse the catalog
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
