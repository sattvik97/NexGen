import {useEffect, useRef, useState, type ReactNode, type MouseEvent} from 'react';
import {Link} from 'react-router';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {MascotRobot} from './hero/MascotRobot';
// CursorParticles is now mounted in app/root.tsx (site-wide)

// 3D scene is loaded strictly on the client — Three.js/R3F use CJS internals
// that workerd/MiniOxygen cannot evaluate during SSR.
type SceneCmp = React.ComponentType<Record<string, never>>;

/* ============================================================== */
/*  NEXGEN IMMERSIVE HERO — animated sky · parallax toys · 3D     */
/* ============================================================== */

const HEADLINE = ['Discover', 'Toys', 'That'];
const SHIMMER = 'Spark Creativity';
const SUBHEAD =
  'Curated, safety-tested, joy-tested toys that turn living rooms into launchpads. Built for curious minds, loved by parents.';

export function NexGenHero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // R3F is browser-only and ships a fat Three.js bundle. Defer the dynamic
  // import until the browser is idle so initial hero paint + interactivity
  // are not blocked by it. Also skip on prefers-reduced-motion users.
  const [Scene, setScene] = useState<SceneCmp | null>(null);
  useEffect(() => {
    let alive = true;
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (r) return;
    const load = () => {
      import('./hero/ToyChestScene').then((m) => {
        if (alive) setScene(() => m.ToyChestScene as SceneCmp);
      });
    };
    const w = window as Window & {requestIdleCallback?: (cb: () => void, opts?: {timeout: number}) => number};
    if (w.requestIdleCallback) w.requestIdleCallback(load, {timeout: 2500});
    else window.setTimeout(load, 700);
    return () => {
      alive = false;
    };
  }, []);

  // Skip mouse parallax + cursor particles on touch devices.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Mouse parallax (-1..1)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, {stiffness: 60, damping: 18, mass: 0.4});
  const smy = useSpring(my, {stiffness: 60, damping: 18, mass: 0.4});

  useEffect(() => {
    if (isTouch) return;
    const handler = (e: globalThis.MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mx, my, isTouch]);

  // Scroll-driven cinematic exit
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <motion.section
      ref={heroRef}
      style={{scale: heroScale, opacity: heroOpacity, y: heroY}}
      className="relative isolate w-full min-h-[100svh] lg:min-h-screen overflow-hidden text-nexgen-night"
    >
      {/* ===================== LAYER 1 — ANIMATED SKY ===================== */}
      <motion.div aria-hidden style={{y: skyY}} className="absolute inset-0 -z-30">
        <AnimatedSky />
      </motion.div>

      {/* ===================== LAYER 2 — PARALLAX TOYS ==================== */}
      <ParallaxToyField mx={smx} my={smy} />

      {/* ====================== CURSOR PARTICLES ========================== */}
      {/* CursorParticles is now mounted globally in app/root.tsx */}

      {/* ============================ CONTENT ============================ */}
      <div className="relative z-10 mx-auto w-full max-w-7xl min-h-[100svh] lg:min-h-screen px-5 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-20 sm:pt-24 pb-24 sm:pb-28 lg:pb-32">
        {/* ---------- LEFT: COPY ---------- */}
        <div className="lg:col-span-7 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, ease: 'easeOut'}}
            className="inline-flex"
          >
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-nexgen-purple ring-1 ring-nexgen-purple/20 shadow-lg shadow-nexgen-purple/10"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(108,99,255,0.0)',
                  '0 0 24px 4px rgba(108,99,255,0.35)',
                  '0 0 0 0 rgba(108,99,255,0.0)',
                ],
              }}
              transition={{duration: 3, repeat: Infinity}}
            >
              <span className="text-base leading-none">✨</span>
              Where Imagination Comes To Life
            </motion.span>
          </motion.div>

          {/* Headline */}
          <h1 className="mt-5 sm:mt-7 font-display font-black leading-[1.02] text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem] tracking-tight">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word}
                initial={{opacity: 0, y: 30, rotateX: -40}}
                animate={{opacity: 1, y: 0, rotateX: 0}}
                transition={{delay: 0.25 + i * 0.12, duration: 0.6, ease: 'easeOut'}}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
            <br className="hidden sm:block" />
            <ShimmerHeadline text={SHIMMER} />
          </h1>

          {/* Typewriter sub */}
          <div className="mt-5 sm:mt-6 max-w-xl mx-auto lg:mx-0">
            <Typewriter text={SUBHEAD} delay={1.1} className="text-base sm:text-lg text-nexgen-night/75" />
          </div>

          {/* CTAs */}
          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1.6, duration: 0.6}}
            className="relative z-20 mt-7 sm:mt-9 flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <MagneticButton to="/collections" variant="primary">
              <SparkleIcon /> Shop Adventure
            </MagneticButton>
            <MagneticButton to="/collections" variant="ghost">
              Explore Toy Worlds <ArrowIcon />
            </MagneticButton>
          </motion.div>

          {/* Counters */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 2, duration: 0.7}}
            className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto lg:mx-0"
          >
            <StatCard value={50000} suffix="+" label="Happy Families" tint="orange" />
            <StatCard value={100000} suffix="+" label="Toys Delivered" tint="teal" />
            <StatCard value={4.9} decimals={1} suffix="★" label="Parent Rating" tint="yellow" />
            <StatCard value={500} suffix="+" label="Educational Toys" tint="purple" />
          </motion.div>
          {/* Mobile trust strip (replaces hidden floating cards) */}
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 2.3, duration: 0.6}}
            className="sm:hidden mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold text-nexgen-night/70"
          >
            <span className="inline-flex items-center gap-1.5"><span className="text-nexgen-teal">●</span> BIS Certified</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-nexgen-orange">●</span> Ships 24h</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-nexgen-purple">●</span> 30-day Returns</span>
          </motion.div>
        </div>

        {/* ---------- RIGHT: 3D SCENE + MASCOT ---------- */}
        <div className="lg:col-span-5 relative h-[300px] sm:h-[460px] lg:h-[640px] order-first lg:order-none">
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 0.4, duration: 1, ease: 'easeOut'}}
            className="absolute inset-0"
          >
            {Scene ? (
              <Scene />
            ) : (
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-nexgen-orange/10 via-nexgen-teal/10 to-nexgen-purple/10 animate-pulse" />
            )}
          </motion.div>

          <MascotRobot className="absolute left-1 sm:-left-8 bottom-0 w-20 sm:w-36 lg:w-44 pointer-events-none select-none" />

          <FloatingTrust
            label="100% Safe"
            sub="BIS Certified"
            tint="teal"
            icon={<ShieldIcon />}
            style={{top: '6%', right: '0%'}}
            delay={1.4}
          />
          <FloatingTrust
            label="Educational"
            sub="Learn & Play"
            tint="purple"
            icon={<BrainIcon />}
            style={{top: '38%', right: '-2%'}}
            delay={1.7}
          />
          <FloatingTrust
            label="Fast Delivery"
            sub="Ships in 24h"
            tint="orange"
            icon={<TruckIcon />}
            style={{bottom: '14%', right: '4%'}}
            delay={2}
          />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 2.4, duration: 0.6}}
        className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 text-xs uppercase tracking-[0.25em] text-nexgen-night/60"
      >
        <span>Scroll to explore</span>
        <motion.div
          className="w-[2px] h-8 rounded-full bg-gradient-to-b from-nexgen-orange to-transparent"
          animate={{scaleY: [0.4, 1, 0.4]}}
          style={{originY: 0}}
          transition={{duration: 1.6, repeat: Infinity, ease: 'easeInOut'}}
        />
      </motion.div>
    </motion.section>
  );
}

/* =================================================================== */
/*  ANIMATED SKY                                                       */
/* =================================================================== */
function AnimatedSky() {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0 dark:opacity-0 transition-opacity duration-700"
        animate={{
          background: [
            'linear-gradient(180deg,#FFE8D6 0%,#FFF6E5 38%,#E8F8FF 100%)',
            'linear-gradient(180deg,#FFD7C2 0%,#FFF1D7 38%,#D7F0FF 100%)',
            'linear-gradient(180deg,#FFE8D6 0%,#FFF6E5 38%,#E8F8FF 100%)',
          ],
        }}
        transition={{duration: 18, repeat: Infinity, ease: 'easeInOut'}}
      />
      {/* Night-sky overlay (only visible in dark mode) */}
      <motion.div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700"
        animate={{
          background: [
            'linear-gradient(180deg,#05060f 0%,#0b1029 38%,#1a0b2e 100%)',
            'linear-gradient(180deg,#070920 0%,#101637 38%,#23103c 100%)',
            'linear-gradient(180deg,#05060f 0%,#0b1029 38%,#1a0b2e 100%)',
          ],
        }}
        transition={{duration: 18, repeat: Infinity, ease: 'easeInOut'}}
      />
      {/* Sun rays (sun in day, full moon in night) */}
      <motion.div
        className="absolute -top-32 -right-32 w-[36rem] h-[36rem] rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,230,109,0.7), rgba(255,230,109,0) 70%)',
        }}
        animate={{scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85]}}
        transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}
      />
      <div className="absolute -top-20 -left-24 size-[28rem] rounded-full bg-nexgen-orange/30 blur-3xl animate-orb" />
      <div
        className="absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-nexgen-teal/25 blur-3xl animate-orb"
        style={{animationDelay: '3s'}}
      />
      <div
        className="absolute top-1/3 right-1/4 size-[20rem] rounded-full bg-nexgen-purple/25 blur-3xl animate-orb"
        style={{animationDelay: '6s'}}
      />

      {/* Stars — pure CSS twinkle (no framer-motion overhead) */}
      {Array.from({length: 14}).map((_, i) => {
        const top = (i * 37) % 90;
        const left = (i * 53) % 100;
        const size = 2 + ((i * 7) % 4);
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle will-change-[opacity,transform]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              animationDuration: `${2 + (i % 5) * 0.4}s`,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        );
      })}

      {/* Clouds */}
      <Cloud className="top-[14%] opacity-80 dark:opacity-20" duration={48} />
      <Cloud className="top-[34%] scale-75 opacity-60 dark:opacity-10" duration={62} delay={-20} />
      <Cloud className="top-[60%] scale-90 opacity-70 dark:opacity-15" duration={70} delay={-40} />

      {/* Paper airplane */}
      <PaperPlane />
    </div>
  );
}

function Cloud({
  className = '',
  duration = 50,
  delay = 0,
}: {
  className?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 200 80"
      className={`absolute -left-40 w-64 ${className}`}
      initial={{x: '-10vw'}}
      animate={{x: '120vw'}}
      transition={{duration, delay, repeat: Infinity, ease: 'linear'}}
      aria-hidden
    >
      <g fill="#ffffff">
        <ellipse cx="60" cy="50" rx="38" ry="22" />
        <ellipse cx="100" cy="42" rx="34" ry="26" />
        <ellipse cx="140" cy="52" rx="32" ry="20" />
        <rect x="50" y="50" width="100" height="22" rx="11" />
      </g>
    </motion.svg>
  );
}

function PaperPlane() {
  return (
    <motion.div
      aria-hidden
      className="absolute dark:opacity-40"
      initial={{x: '-10vw', y: '20vh', rotate: 10}}
      animate={{x: '110vw', y: ['20vh', '14vh', '22vh'], rotate: [10, -6, 10]}}
      transition={{duration: 22, repeat: Infinity, ease: 'linear'}}
    >
      <svg width="64" height="48" viewBox="0 0 64 48">
        <defs>
          <linearGradient id="planeGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#FFE66D" />
          </linearGradient>
        </defs>
        <polygon
          points="0,24 60,4 36,28 60,44"
          fill="url(#planeGrad)"
          stroke="#0F1E35"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polygon
          points="36,28 28,42 24,30"
          fill="#FF6B35"
          stroke="#0F1E35"
          strokeWidth="1.2"
        />
      </svg>
    </motion.div>
  );
}

/* =================================================================== */
/*  PARALLAX TOY FIELD                                                 */
/* =================================================================== */
function ParallaxToyField({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const toys: Array<{
    emoji: string;
    style: React.CSSProperties;
    depth: number;
    size: number;
    sound?: 'pop' | 'wave' | 'launch';
  }> = [
    {emoji: '🚀', style: {top: '14%', left: '6%'}, depth: 40, size: 56, sound: 'launch'},
    {emoji: '🧸', style: {top: '70%', left: '8%'}, depth: 28, size: 64, sound: 'wave'},
    {emoji: '🎈', style: {top: '20%', left: '38%'}, depth: 55, size: 48, sound: 'pop'},
    {emoji: '🧩', style: {top: '76%', left: '46%'}, depth: 22, size: 46},
    {emoji: '🪁', style: {top: '10%', left: '56%'}, depth: 60, size: 50},
    {emoji: '🎨', style: {top: '60%', left: '34%'}, depth: 18, size: 44},
    {emoji: '🚂', style: {top: '84%', left: '22%'}, depth: 24, size: 50},
    {emoji: '⭐', style: {top: '32%', left: '24%'}, depth: 70, size: 30},
    {emoji: '🎲', style: {top: '54%', left: '58%'}, depth: 26, size: 42},
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 hidden sm:block">
      {toys.map((t, i) => (
        <ParallaxToy key={i} {...t} mx={mx} my={my} index={i} />
      ))}
    </div>
  );
}

function ParallaxToy({
  emoji,
  style,
  depth,
  size,
  mx,
  my,
  index,
  sound,
}: {
  emoji: string;
  style: React.CSSProperties;
  depth: number;
  size: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  index: number;
  sound?: 'pop' | 'wave' | 'launch';
}) {
  const tx = useTransform(mx, (v) => v * depth);
  const ty = useTransform(my, (v) => v * depth * 0.6);
  const [reacted, setReacted] = useState<null | 'pop' | 'wave' | 'launch'>(null);

  const onClick = () => {
    if (!sound) return;
    setReacted(sound);
    setTimeout(() => setReacted(null), 1200);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{...style, x: tx, y: ty, fontSize: size}}
      className="absolute pointer-events-auto cursor-pointer select-none drop-shadow-[0_8px_18px_rgba(15,30,53,0.25)] leading-none bg-transparent border-0 p-0"
      animate={
        reacted === 'launch'
          ? {y: -400, opacity: [1, 1, 0], scale: [1, 1.2, 0.8]}
          : reacted === 'pop'
            ? {scale: [1, 1.4, 0], opacity: [1, 1, 0]}
            : reacted === 'wave'
              ? {rotate: [0, -20, 20, -15, 10, 0]}
              : {
                  y: [0, -14, 0],
                  rotate: [-3 + (index % 3), 3 - (index % 3), -3 + (index % 3)],
                }
      }
      transition={
        reacted
          ? {duration: 1.1, ease: 'easeOut'}
          : {duration: 4 + (index % 4), repeat: Infinity, ease: 'easeInOut'}
      }
      whileHover={{scale: 1.15}}
      aria-label={sound ? `Click the ${emoji}` : undefined}
    >
      {emoji}
    </motion.button>
  );
}

/* =================================================================== */
/*  SHIMMER HEADLINE                                                   */
/* =================================================================== */
function ShimmerHeadline({text}: {text: string}) {
  return (
    <motion.span
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.65, duration: 0.7, ease: 'easeOut'}}
      className="relative inline-block"
    >
      <span
        className="relative bg-clip-text text-transparent bg-[length:200%_100%]"
        style={{
          backgroundImage:
            'linear-gradient(90deg,#FF6B35 0%,#FFE66D 25%,#4ECDC4 50%,#6C63FF 75%,#FF6B35 100%)',
          animation: 'nexgen-shimmer 6s linear infinite',
        }}
      >
        {text}
      </span>
      <motion.span
        aria-hidden
        className="absolute -inset-2 -z-10 rounded-2xl blur-2xl"
        style={{background: 'linear-gradient(90deg,#FF6B3555,#6C63FF55)'}}
        animate={{opacity: [0.4, 0.8, 0.4]}}
        transition={{duration: 3, repeat: Infinity, ease: 'easeInOut'}}
      />
    </motion.span>
  );
}

/* =================================================================== */
/*  TYPEWRITER                                                         */
/* =================================================================== */
function Typewriter({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = setTimeout(() => {
      const id = setInterval(() => {
        setN((v) => {
          if (v >= text.length) {
            clearInterval(id);
            return v;
          }
          return v + 1;
        });
      }, 22);
    }, delay * 1000);
    return () => clearTimeout(start);
  }, [text, delay]);
  return (
    <motion.p
      className={className}
      animate={{y: [0, -3, 0]}}
      transition={{duration: 5, repeat: Infinity, ease: 'easeInOut'}}
    >
      {text.slice(0, n)}
      <span className="inline-block w-[2px] h-[1em] align-middle ml-1 bg-nexgen-orange animate-pulse" />
    </motion.p>
  );
}

/* =================================================================== */
/*  MAGNETIC BUTTON                                                    */
/* =================================================================== */
function MagneticButton({
  to,
  children,
  variant,
}: {
  to: string;
  children: ReactNode;
  variant: 'primary' | 'ghost';
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, {stiffness: 200, damping: 12});
  const sy = useSpring(y, {stiffness: 200, damping: 12});

  const [bursts, setBursts] = useState<{id: number}[]>([]);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  const onClick = () => {
    const id = Date.now();
    setBursts((b) => [...b, {id}]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
  };

  const base =
    'relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-base overflow-visible transition will-change-transform';
  const styles =
    variant === 'primary'
      ? 'text-white nexgen-gradient shadow-[0_10px_30px_-8px_rgba(255,107,53,0.6)] hover:shadow-[0_18px_40px_-8px_rgba(255,107,53,0.7)]'
      : 'bg-white/70 backdrop-blur-md text-nexgen-night dark:text-white ring-1 ring-nexgen-night/15 dark:ring-white/20 hover:ring-nexgen-purple/40 hover:bg-white dark:hover:bg-white/15';

  return (
    <motion.div style={{x: sx, y: sy}} className="inline-block">
      <Link
        ref={ref}
        to={to}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
        className={`${base} ${styles}`}
      >
        {children}
        {variant === 'primary' && (
          <span
            aria-hidden
            className="absolute -inset-1 -z-10 rounded-full blur-xl opacity-50"
            style={{background: 'linear-gradient(90deg,#FF6B35,#FFE66D)'}}
          />
        )}
        <AnimatePresence>
          {bursts.map((b) => (
            <ConfettiBurst key={b.id} />
          ))}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

function ConfettiBurst() {
  const pieces = Array.from({length: 14});
  const colors = ['#FF6B35', '#FFE66D', '#4ECDC4', '#6C63FF', '#ffffff'];
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const dist = 60 + Math.random() * 50;
        return (
          <motion.span
            key={i}
            initial={{x: 0, y: 0, opacity: 1, scale: 1}}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist + 20,
              opacity: 0,
              rotate: Math.random() * 360,
              scale: 0.6,
            }}
            transition={{duration: 0.8, ease: 'easeOut'}}
            className="absolute block w-2 h-2 rounded-sm"
            style={{background: colors[i % colors.length]}}
          />
        );
      })}
    </span>
  );
}

/* =================================================================== */
/*  STAT CARD WITH COUNT-UP                                            */
/* =================================================================== */
function StatCard({
  value,
  suffix = '',
  decimals = 0,
  label,
  tint,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  tint: 'orange' | 'teal' | 'yellow' | 'purple';
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !seen.current) {
          seen.current = true;
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const e = 1 - Math.pow(1 - p, 3);
            setN(value * e);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      {threshold: 0.4},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  const tintBg: Record<string, string> = {
    orange: 'from-nexgen-orange/20 to-nexgen-orange/0 text-nexgen-orange',
    teal: 'from-nexgen-teal/20 to-nexgen-teal/0 text-nexgen-teal',
    yellow: 'from-nexgen-yellow/40 to-nexgen-yellow/0 text-amber-600',
    purple: 'from-nexgen-purple/20 to-nexgen-purple/0 text-nexgen-purple',
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{y: -4}}
      className="rounded-2xl bg-white/70 backdrop-blur-md ring-1 ring-white/60 shadow-lg shadow-nexgen-night/5 px-4 py-3"
    >
      <div
        className={`text-2xl font-display font-extrabold bg-gradient-to-br ${tintBg[tint]} bg-clip-text`}
      >
        {decimals > 0 ? n.toFixed(decimals) : Math.floor(n).toLocaleString()}
        {suffix}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-nexgen-night/60 font-semibold mt-0.5">
        {label}
      </div>
    </motion.div>
  );
}

/* =================================================================== */
/*  FLOATING TRUST CARD                                                */
/* =================================================================== */
function FloatingTrust({
  label,
  sub,
  icon,
  tint,
  style,
  delay = 0,
}: {
  label: string;
  sub: string;
  icon: ReactNode;
  tint: 'orange' | 'teal' | 'purple';
  style: React.CSSProperties;
  delay?: number;
}) {
  const tints: Record<string, string> = {
    orange: 'from-nexgen-orange to-amber-500',
    teal: 'from-nexgen-teal to-cyan-500',
    purple: 'from-nexgen-purple to-indigo-500',
  };
  return (
    <motion.div
      style={style}
      initial={{opacity: 0, y: 14, scale: 0.9}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{delay, duration: 0.7, type: 'spring'}}
      className="absolute hidden sm:flex items-center gap-3 rounded-2xl bg-white/75 backdrop-blur-xl ring-1 ring-white/70 shadow-xl shadow-nexgen-night/10 px-3 py-2.5"
      whileHover={{y: -4, scale: 1.04}}
    >
      <motion.span
        className={`inline-flex items-center justify-center size-10 rounded-xl bg-gradient-to-br ${tints[tint]} text-white shadow-md`}
        animate={{y: [0, -3, 0]}}
        transition={{duration: 3, repeat: Infinity, ease: 'easeInOut', delay}}
      >
        {icon}
      </motion.span>
      <div className="leading-tight pr-1">
        <div className="text-sm font-bold text-nexgen-night">{label}</div>
        <div className="text-[11px] text-nexgen-night/60">{sub}</div>
      </div>
    </motion.div>
  );
}

/* =================================================================== */
/*  ICONS                                                              */
/* =================================================================== */
function ArrowIcon() {
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
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6L22.5 17l-2.6.9L19 20.5l-.9-2.6L15.5 17l2.6-.9L19 13z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V4z" />
      <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
