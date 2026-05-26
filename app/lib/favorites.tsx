/**
 * Favorites store — persisted to localStorage, exposed via React Context.
 * Each saved favorite carries the data needed to render it on the
 * /favorites page without re-fetching from Shopify.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type FavoriteItem = {
  handle: string;
  title: string;
  image: string;
  priceINR: number;
  mrpINR?: number;
  addedAt: number;
};

type FavoritesContextValue = {
  items: FavoriteItem[];
  count: number;
  isFavorite: (handle: string) => boolean;
  toggle: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  add: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  remove: (handle: string) => void;
  clear: () => void;
};

const STORAGE_KEY = 'nexgen.favorites.v1';

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FavoriteItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.handle));
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after first hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  // Cross-tab sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? (JSON.parse(e.newValue) as FavoriteItem[]) : [];
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFavorite = useCallback(
    (handle: string) => items.some((i) => i.handle === handle),
    [items],
  );

  const add = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setItems((prev) => {
      if (prev.some((i) => i.handle === item.handle)) return prev;
      return [{...item, addedAt: Date.now()}, ...prev];
    });
  }, []);

  const remove = useCallback((handle: string) => {
    setItems((prev) => prev.filter((i) => i.handle !== handle));
  }, []);

  const toggle = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setItems((prev) => {
      if (prev.some((i) => i.handle === item.handle)) {
        return prev.filter((i) => i.handle !== item.handle);
      }
      return [{...item, addedAt: Date.now()}, ...prev];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({items, count: items.length, isFavorite, toggle, add, remove, clear}),
    [items, isFavorite, toggle, add, remove, clear],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    // Safe no-op fallback so server-side renders don't crash.
    return {
      items: [],
      count: 0,
      isFavorite: () => false,
      toggle: () => {},
      add: () => {},
      remove: () => {},
      clear: () => {},
    };
  }
  return ctx;
}
