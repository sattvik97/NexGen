import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion';

/**
 * MagneticTilt — drop-in hover wrapper that gives any child the signature
 * "hero" feel from the homepage:
 *   • Cursor-tracking 3D tilt (perspective + rotateX/Y)
 *   • Lift + scale on hover
 *   • Always-on faint brand aura that explodes into a rainbow glow on hover
 *   • Animated sheen sweep + specular hot-spot following the cursor
 *   • Ripple burst the first time the cursor enters
 *
 * Pure CSS + framer-motion springs — GPU accelerated.
 */
export function MagneticTilt({
  children,
  className = '',
  intensity = 1,
  glow = true,
  sheen = true,
  scale = 1.02,
  rounded = 'rounded-3xl',
}: {
  children: ReactNode;
  className?: string;
  /** 0 disables tilt, 1 = default, 2 = exaggerated */
  intensity?: number;
  glow?: boolean;
  sheen?: boolean;
  scale?: number;
  rounded?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ripple, setRipple] = useState<{id: number; x: number; y: number} | null>(
    null,
  );
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateInteractiveMode = () => {
      setInteractive(!coarsePointerQuery.matches && !reducedMotionQuery.matches);
    };

    updateInteractiveMode();
    coarsePointerQuery.addEventListener('change', updateInteractiveMode);
    reducedMotionQuery.addEventListener('change', updateInteractiveMode);

    return () => {
      coarsePointerQuery.removeEventListener('change', updateInteractiveMode);
      reducedMotionQuery.removeEventListener('change', updateInteractiveMode);
    };
  }, []);

  // Normalized mouse position (-0.5 .. 0.5)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Smooth springs for natural motion
  const sx = useSpring(mx, {stiffness: 250, damping: 20, mass: 0.55});
  const sy = useSpring(my, {stiffness: 250, damping: 20, mass: 0.55});

  // Gentler rotations + lift so hovered cards never overlap neighbours
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9 * intensity, 9 * intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7 * intensity, -7 * intensity]);
  const translateZ = useTransform(
    [sx, sy] as const,
    ([x, y]) => 12 + Math.abs(x as number) * 14 + Math.abs(y as number) * 14,
  );

  // Sheen / specular follow the cursor
  const sheenX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);

  // Conic-gradient rotation angle for the aura
  const auraAngle = useTransform([sx, sy] as const, ([x, y]) =>
    Math.atan2(y as number, x as number) * (180 / Math.PI) + 90,
  );

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleEnter = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRipple({id: Date.now(), x: e.clientX - r.left, y: e.clientY - r.top});
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  if (!interactive) {
    return <div className={`relative ${rounded} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileHover={{scale}}
      transition={{type: 'spring', stiffness: 260, damping: 22}}
      style={{
        rotateX,
        rotateY,
        z: translateZ,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      className={`relative will-change-transform group/tilt ${rounded} ${className}`}
    >
      {/* Always-on faint aura + dramatic rainbow on hover */}
      {glow && (
        <>
          {/* Subtle constant aura (more visible in dark mode) */}
          <span
            aria-hidden
            className={`pointer-events-none absolute -inset-1 ${rounded} blur-xl opacity-30 dark:opacity-50 group-hover/tilt:opacity-0 transition-opacity duration-500`}
            style={{
              background:
                'radial-gradient(60% 60% at 50% 50%, rgba(108,99,255,0.35), transparent 70%)',
              zIndex: -1,
            }}
          />
          {/* Hover rainbow conic aura */}
          <motion.span
            aria-hidden
            className={`pointer-events-none absolute -inset-2 ${rounded} blur-2xl opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-500`}
            style={{
              background:
                'conic-gradient(from 0deg, #FF6B35, #FFE66D, #4ECDC4, #6C63FF, #FF6B35)',
              rotate: auraAngle,
              zIndex: -1,
            }}
          />
        </>
      )}

      {/* Child content — pushed forward in 3D so the tilt is obvious */}
      <div className="relative" style={{transform: 'translateZ(20px)'}}>
        {children}
      </div>

      {/* Sheen sweep + specular hot-spot following the cursor */}
      {sheen && (
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${rounded} overflow-hidden opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300`}
        >
          <motion.span
            className="absolute h-[140%] w-[55%] -top-[20%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-md mix-blend-overlay"
            style={{left: sheenX, rotate: 14}}
          />
          <motion.span
            className="absolute size-40 rounded-full bg-white/40 blur-2xl mix-blend-overlay"
            style={{
              left: sheenX,
              top: sheenY,
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        </motion.span>
      )}

      {/* One-shot ripple where the cursor first entered */}
      {ripple && (
        <motion.span
          key={ripple.id}
          aria-hidden
          initial={{opacity: 0.55, scale: 0}}
          animate={{opacity: 0, scale: 4}}
          transition={{duration: 0.9, ease: 'easeOut'}}
          onAnimationComplete={() => setRipple(null)}
          className={`pointer-events-none absolute size-24 ${rounded} bg-gradient-to-br from-nexgen-orange/40 via-nexgen-yellow/40 to-nexgen-teal/40 blur-md`}
          style={{
            left: ripple.x - 48,
            top: ripple.y - 48,
            transform: 'translateZ(20px)',
          }}
        />
      )}
    </motion.div>
  );
}

