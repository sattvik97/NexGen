import {useFavorites, type FavoriteItem} from '~/lib/favorites';

type Props = Omit<FavoriteItem, 'addedAt'> & {
  /** Visual placement helper — adds absolute positioning if true. */
  floating?: boolean;
  className?: string;
};

export function FavoriteButton({floating, className = '', ...item}: Props) {
  const {isFavorite, toggle} = useFavorites();
  const active = isFavorite(item.handle);

  const base =
    'inline-flex size-9 items-center justify-center rounded-full ring-1 backdrop-blur transition active:scale-90 motion-safe:transition-transform';
  const pos = floating ? 'absolute top-2 right-2 z-10' : '';
  const tone = active
    ? 'bg-rose-500 text-white ring-rose-500 shadow-md shadow-rose-500/30'
    : 'bg-white/85 text-nexgen-night/70 ring-nexgen-night/10 hover:text-rose-500 hover:ring-rose-300';

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={`${base} ${pos} ${tone} ${className}`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}

export function HeartIcon({filled, className = ''}: {filled?: boolean; className?: string}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
