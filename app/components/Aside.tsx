import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  // Lock body scroll while the aside is open so the page behind doesn't
  // scroll on touch devices.
  useEffect(() => {
    if (!expanded) return;
    const {body} = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <div
      id={`${type}-aside`}
      aria-modal={expanded || undefined}
      aria-labelledby="aside-heading"
      aria-hidden={!expanded}
      className={`fixed inset-0 z-[70] transition ${
        expanded ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      role="dialog"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className={`absolute inset-0 bg-nexgen-night/60 backdrop-blur-sm transition-opacity duration-300 ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] lg:w-[460px] max-w-full bg-white dark:bg-[#0d1326] text-nexgen-night dark:text-slate-100 shadow-2xl shadow-nexgen-night/30 flex flex-col transition-transform duration-300 ease-out ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-nexgen-night/10 dark:border-white/10">
          <h3
            id="aside-heading"
            className="text-base sm:text-lg font-display font-black tracking-tight uppercase"
          >
            {heading}
          </h3>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-full bg-nexgen-night/5 hover:bg-nexgen-night/10 dark:bg-white/10 dark:hover:bg-white/20 text-nexgen-night dark:text-white transition active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
