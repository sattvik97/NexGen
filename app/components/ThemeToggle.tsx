import {useEffect, useState} from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'nexgen-theme';

/**
 * Inline script that runs synchronously in <head> *before* React hydrates,
 * so the correct theme class is on <html> immediately — no flash of wrong
 * theme (FOUC). Reads localStorage, falls back to OS preference.
 */
export const themeNoFlashScript = `
(function(){try{
  var k='${STORAGE_KEY}';
  var saved=localStorage.getItem(k);
  var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme=saved||(prefersDark?'dark':'light');
  if(theme==='dark'){document.documentElement.classList.add('dark');}
  document.documentElement.dataset.theme=theme;
}catch(e){}})();
`;

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Floating round button with sun/moon icon. Add anywhere in the UI. */
export function ThemeToggle({className = ''}: {className?: string}) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readInitialTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    const root = document.documentElement;
    if (next === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  // Render a placeholder during SSR/hydration to keep markup stable.
  const isDark = mounted && theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex size-10 items-center justify-center rounded-full text-nexgen-night hover:bg-nexgen-mist transition group/theme overflow-hidden ${className}`}
    >
      {/* Sun icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
        aria-hidden
      >
        <SunIcon />
      </span>
      {/* Moon icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
        aria-hidden
      >
        <MoonIcon />
      </span>
      {/* Soft glow on dark */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full bg-nexgen-yellow/40 blur-xl transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-0 group-hover/theme:opacity-100'
        }`}
      />
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}
