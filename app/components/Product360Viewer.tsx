import {useEffect, useRef, useState, useCallback} from 'react';

type Product360ViewerProps = {
  /**
   * Public URLs of each angle frame, in clockwise order starting from
   * the "front" of the product.
   */
  frames: string[];
  /** Used as the visible fallback while frames load (or if they 404). */
  fallbackSrc: string;
  alt: string;
  /** Aspect ratio class (Tailwind). Default `aspect-square`. */
  aspectClass?: string;
  className?: string;
  /**
   * When true, hide the "frames pending" notice on the fallback image.
   * Use on production product pages where the static image is fine until
   * the 360 frames are produced.
   */
  silentFallback?: boolean;
};

/**
 * Interactive 360° product viewer. Drag horizontally (mouse or touch) to
 * rotate the product. Keyboard ←/→ also rotates one frame at a time for
 * accessibility. Gracefully falls back to `fallbackSrc` if any frame fails
 * to load (e.g. while you're still preparing the angle assets).
 */
export function Product360Viewer({
  frames,
  fallbackSrc,
  alt,
  aspectClass = 'aspect-square',
  className = '',
  silentFallback = false,
}: Product360ViewerProps) {
  const safeFrames = frames.length > 0 ? frames : [fallbackSrc];
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0); // count of frames loaded
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    startX: number;
    startIndex: number;
    width: number;
    active: boolean;
  }>({startX: 0, startIndex: 0, width: 1, active: false});

  // Preload every frame so dragging is smooth. If any 404s, switch to
  // fallback mode entirely.
  useEffect(() => {
    if (frames.length === 0) {
      setFailed(true);
      return;
    }
    let cancelled = false;
    let loadedCount = 0;
    frames.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        loadedCount += 1;
        setLoaded(loadedCount);
      };
      img.onerror = () => {
        if (cancelled) return;
        setFailed(true);
      };
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, [frames]);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const s = dragStateRef.current;
      if (!s.active || s.width === 0) return;
      // ~1 full revolution per container width swept
      const ratio = (clientX - s.startX) / s.width;
      const delta = Math.round(ratio * safeFrames.length);
      const next =
        ((s.startIndex + delta) % safeFrames.length + safeFrames.length) %
        safeFrames.length;
      setIndex(next);
    },
    [safeFrames.length],
  );

  const beginDrag = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      dragStateRef.current = {
        startX: clientX,
        startIndex: index,
        width: el.getBoundingClientRect().width,
        active: true,
      };
    },
    [index],
  );

  const endDrag = useCallback(() => {
    dragStateRef.current.active = false;
  }, []);

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    beginDrag(e.clientX);
  };
  useEffect(() => {
    const onMove = (e: MouseEvent) => updateFromPointer(e.clientX);
    const onUp = () => endDrag();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [updateFromPointer, endDrag]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    beginDrag(e.touches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    updateFromPointer(e.touches[0].clientX);
  };
  const onTouchEnd = () => endDrag();

  // Keyboard accessibility
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIndex((i) => (i - 1 + safeFrames.length) % safeFrames.length);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIndex((i) => (i + 1) % safeFrames.length);
    }
  };

  const showingFallback = failed || frames.length === 0;
  const currentSrc = showingFallback ? fallbackSrc : safeFrames[index];
  const progress = frames.length > 0 ? loaded / frames.length : 1;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${alt}. Drag horizontally to rotate.`}
      tabIndex={0}
      onMouseDown={showingFallback ? undefined : onMouseDown}
      onTouchStart={showingFallback ? undefined : onTouchStart}
      onTouchMove={showingFallback ? undefined : onTouchMove}
      onTouchEnd={showingFallback ? undefined : onTouchEnd}
      onKeyDown={showingFallback ? undefined : onKeyDown}
      className={`relative ${aspectClass} w-full overflow-hidden rounded-[1.5rem] shadow-2xl ring-1 ring-nexgen-night/10 bg-[#0a0f1f] select-none touch-pan-y ${
        showingFallback ? '' : 'cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-nexgen-orange'
      } ${className}`}
    >
      {/* Current frame */}
      <img
        src={currentSrc}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Loading shimmer while preloading frames */}
      {!showingFallback && progress < 1 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
          <div
            className="h-full bg-nexgen-orange transition-all"
            style={{width: `${Math.round(progress * 100)}%`}}
            aria-hidden="true"
          />
        </div>
      )}

      {/* 360 hint */}
      {!showingFallback ? (
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20 pointer-events-none">
          <span aria-hidden="true">⟳</span> 360° · Drag to rotate
        </div>
      ) : silentFallback ? null : (
        <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-medium px-3 py-1.5 ring-1 ring-amber-300/60">
          360° frames pending — drop angle photos into{' '}
          <code className="font-mono text-[10px]">public/products/cyber-truck-360/</code>
        </div>
      )}
    </div>
  );
}
