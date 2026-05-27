import {Suspense, useState, type FormEvent} from 'react';
import {Await, NavLink, Link, useNavigate, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ThemeToggle} from '~/components/ThemeToggle';
import {useFavorites} from '~/lib/favorites';
import {HeartIcon} from '~/components/FavoriteButton';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

/* ----------------- Announcement Marquee ----------------- */
const ANNOUNCEMENTS = [
  {icon: '🚚', text: 'FREE DELIVERY on orders above ₹999'},
  {icon: '🎁', text: 'Use code NEXGEN10 for 10% off'},
  {icon: '🛡️', text: 'BIS Certified · 100% Safe'},
];

function AnnouncementMarquee() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div
      role="region"
      aria-label="Store announcements"
      className="relative overflow-hidden bg-gradient-to-r from-nexgen-orange via-nexgen-purple to-nexgen-teal text-white"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)] bg-[length:250%_100%] animate-marquee-shimmer"
      />
      <div className="marquee-track flex whitespace-nowrap py-2 sm:py-2.5 text-[12px] sm:text-sm font-bold tracking-wide">
        {items.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 shrink-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            <span className="text-base leading-none" aria-hidden>{it.icon}</span>
            <span>{it.text}</span>
            <span className="text-white/60 px-3" aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================== */
/*  HEADER — three-row layout matching nexgen.toys                 */
/*    Row 1: thin announcement bar                                 */
/*    Row 2: logo · search · account/cart                          */
/*    Row 3: centered primary nav                                  */
/* ============================================================== */
export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const shopName = header?.shop?.name || 'NexGen Toys';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-nexgen-night/10">
      {/* ---------- Row 1 — promo marquee strip ---------- */}
      <AnnouncementMarquee />


      {/* ---------- Row 2 — logo · search · ctas ---------- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 sm:gap-6 py-4 sm:py-5">
          {/* Mobile hamburger */}
          <MobileMenuButton />

          {/* Logo */}
          <Link
            to="/"
            prefetch="intent"
            className="shrink-0 font-display font-black text-xl sm:text-2xl text-nexgen-night tracking-tight whitespace-nowrap"
          >
            {shopName}
          </Link>

          {/* Search */}
          <HeaderSearch />

          {/* CTAs */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">
            <MobileSearchButton />
            <ThemeToggle />
            <FavoritesLink />
            <AccountLink isLoggedIn={isLoggedIn} />
            <CartButton cart={cart} />
          </div>
        </div>
      </div>

      {/* ---------- Row 3 — primary nav ---------- */}
      <PrimaryNav
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </header>
  );
}

/* ----------------------------- Search ----------------------------- */
function HeaderSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="hidden sm:flex flex-1 max-w-2xl items-stretch gap-2"
    >
      <div className="relative flex-1">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search RC cars, helicopters, and more"
          aria-label="Search the store"
          className="w-full rounded-full bg-nexgen-mist text-nexgen-night placeholder:text-nexgen-night/45 ring-1 ring-transparent focus:ring-nexgen-orange/50 focus:bg-white focus:outline-none px-5 py-2.5 text-sm transition"
        />
      </div>
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex size-10 items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30 transition active:scale-95"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

/* ------------------------- Favorites ----------------------------- */
function FavoritesLink() {
  const {count} = useFavorites();
  return (
    <NavLink
      to="/favorites"
      prefetch="intent"
      aria-label={`Wishlist${count ? `, ${count} items` : ''}`}
      title="Wishlist"
      className={({isActive}) =>
        `relative inline-flex size-10 items-center justify-center rounded-full transition ${
          isActive
            ? 'text-rose-500 bg-rose-50'
            : 'text-nexgen-night hover:bg-nexgen-mist hover:text-rose-500'
        }`
      }
    >
      <HeartIcon filled={count > 0} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </NavLink>
  );
}

/* ------------------------- Account / Cart ------------------------ */
function AccountLink({
  isLoggedIn,
}: {
  isLoggedIn: HeaderProps['isLoggedIn'];
}) {
  return (
    <NavLink
      to="/account"
      prefetch="intent"
      aria-label="Profile"
      title="Profile"
      className="inline-flex size-10 items-center justify-center rounded-full text-nexgen-night hover:bg-nexgen-mist transition"
    >
      <Suspense fallback={<UserIcon />}>
        <Await resolve={isLoggedIn} errorElement={<UserIcon />}>
          {() => <UserIcon />}
        </Await>
      </Suspense>
    </NavLink>
  );
}

function CartButton({cart}: {cart: HeaderProps['cart']}) {
  return (
    <Suspense fallback={<CartIconButton count={null} />}>
      <Await resolve={cart}>
        <CartButtonInner />
      </Await>
    </Suspense>
  );
}

function CartButtonInner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartIconButton count={cart?.totalQuantity ?? 0} />;
}

function CartIconButton({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <button
      type="button"
      aria-label={`Cart${count ? `, ${count} items` : ''}`}
      title="Cart"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: typeof window !== 'undefined' ? window.location.href : '',
        } as CartViewPayload);
      }}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-nexgen-night hover:bg-nexgen-mist transition"
    >
      <CartIcon />
      {count != null && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-nexgen-orange text-white text-[10px] font-bold px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

/* ------------------------- Primary nav --------------------------- */
function PrimaryNav({
  header,
  publicStoreDomain,
}: {
  header: HeaderQuery;
  publicStoreDomain: string;
}) {
  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="border-t border-nexgen-night/10 bg-white"
    >
      <ul className="mx-auto max-w-7xl flex items-center justify-center gap-6 sm:gap-10 px-4 py-3 text-sm font-semibold text-nexgen-night/80 overflow-x-auto">
        <PrimaryNavItem to="/" end label="Home" />
        <PrimaryNavItem to="/collections/all" label="All Products" />
        <PrimaryNavItem to="/pages/contact" label="Contact Us" />
      </ul>
    </nav>
  );
}

function PrimaryNavItem({
  to,
  label,
  end,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        prefetch="intent"
        className={({isActive}) =>
          `relative inline-flex items-center pb-1 hover:text-nexgen-night transition ${
            isActive
              ? 'text-nexgen-night after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-nexgen-night after:rounded-full'
              : ''
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}

/* ------------------------ Mega menu dropdown --------------------- */
function CollectionsMegaMenu({
  header,
  publicStoreDomain,
}: {
  header: HeaderQuery;
  publicStoreDomain: string;
}) {
  const items = (header?.menu?.items || []).filter((i) => i.url);
  if (items.length === 0) return null;
  return (
    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl bg-white shadow-xl ring-1 ring-nexgen-night/10 p-2 z-50">
      <ul className="grid grid-cols-1">
        {items.slice(0, 8).map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(header.shop.primaryDomain.url)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <li key={item.id}>
              <Link
                to={url}
                prefetch="intent"
                className="block rounded-xl px-3 py-2 text-sm text-nexgen-night hover:bg-nexgen-mist transition"
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --------------------- Mobile menu trigger ----------------------- */
function MobileMenuButton() {
  const {open, type} = useAside();
  const isOpen = type === 'mobile';
  return (
    <button
      type="button"
      onClick={() => open('mobile')}
      aria-label="Open menu"
      aria-expanded={isOpen}
      aria-controls="mobile-menu-aside"
      className="sm:hidden inline-flex size-11 items-center justify-center rounded-full text-nexgen-night hover:bg-nexgen-mist focus-visible:bg-nexgen-mist transition"
    >
      <BurgerIcon />
    </button>
  );
}

/* --------------------- Mobile search trigger --------------------- */
function MobileSearchButton() {
  const {open} = useAside();
  return (
    <button
      type="button"
      onClick={() => open('search')}
      aria-label="Open search"
      className="sm:hidden inline-flex size-11 items-center justify-center rounded-full text-nexgen-night hover:bg-nexgen-mist transition"
    >
      <SearchIcon />
    </button>
  );
}

/* ============================================================== */
/*  Re-export HeaderMenu for the mobile aside (PageLayout.tsx)     */
/* ============================================================== */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: 'desktop' | 'mobile';
  publicStoreDomain: string;
}) {
  const {close} = useAside();
  const items = (menu || FALLBACK_HEADER_MENU).items
    .filter((item) => item.title.toLowerCase() !== 'all collections')
    .map((item) =>
      item.title.toLowerCase() === 'catalog'
        ? {...item, title: 'All Products'}
        : item.title.toLowerCase() === 'contact'
          ? {...item, title: 'Contact Us'}
          : item,
    );
  return (
    <nav
      role="navigation"
      className={
        viewport === 'mobile'
          ? 'flex flex-col gap-1 p-4 text-base'
          : 'flex items-center gap-6'
      }
    >
      {viewport === 'mobile' && (
        <NavLink
          to="/"
          end
          prefetch="intent"
          onClick={close}
          className="rounded-xl px-3 py-2 hover:bg-nexgen-mist"
        >
          Home
        </NavLink>
      )}
      {items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            key={item.id}
            to={url}
            prefetch="intent"
            onClick={close}
            className={
              viewport === 'mobile'
                ? 'rounded-xl px-3 py-2 hover:bg-nexgen-mist'
                : 'text-sm font-semibold text-nexgen-night/80 hover:text-nexgen-night'
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/* ============================== Icons ============================ */
function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ChevronDown({className = ''}: {className?: string}) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ============================== Fallback ========================= */
const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/fallback',
  items: [
    {
      id: 'm1',
      resourceId: null,
      tags: [],
      title: 'RC Cars',
      type: 'HTTP',
      url: '/collections/rc-cars',
      items: [],
    },
    {
      id: 'm2',
      resourceId: null,
      tags: [],
      title: 'RC Helicopters',
      type: 'HTTP',
      url: '/collections/rc-helicopter',
      items: [],
    },
    {
      id: 'm3',
      resourceId: null,
      tags: [],
      title: 'Soft Toys',
      type: 'HTTP',
      url: '/collections/soft-toys',
      items: [],
    },
    {
      id: 'm4',
      resourceId: null,
      tags: [],
      title: 'Board Games',
      type: 'HTTP',
      url: '/collections/board-games',
      items: [],
    },
    {
      id: 'm5',
      resourceId: null,
      tags: [],
      title: 'Outdoor Toys',
      type: 'HTTP',
      url: '/collections/outdoor-toys',
      items: [],
    },
    {
      id: 'm6',
      resourceId: null,
      tags: [],
      title: 'Hot Sellers',
      type: 'HTTP',
      url: '/collections/hot-sellers',
      items: [],
    },
  ],
};
