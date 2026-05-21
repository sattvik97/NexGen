import {motion, useAnimationControls} from 'framer-motion';
import {useEffect, useState} from 'react';

/**
 * Bolt — the NexGen mascot. A friendly toy robot built from SVG primitives.
 * Waves periodically, blinks, and tracks the mouse with his eyes.
 */
export function MascotRobot({className = ''}: {className?: string}) {
  const wave = useAnimationControls();
  const [blink, setBlink] = useState(false);
  const [eye, setEye] = useState({x: 0, y: 0});

  // Periodic wave
  useEffect(() => {
    let alive = true;
    const loop = async () => {
      while (alive) {
        await new Promise((r) => setTimeout(r, 4200));
        if (!alive) return;
        await wave.start({
          rotate: [0, -25, 18, -18, 12, 0],
          transition: {duration: 1.6, ease: 'easeInOut'},
        });
      }
    };
    loop();
    return () => {
      alive = false;
    };
  }, [wave]);

  // Blink every ~3s
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Eyes follow mouse
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 4;
      const y = (e.clientY / window.innerHeight - 0.5) * 3;
      setEye({x, y});
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 30, scale: 0.85}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{delay: 1.1, duration: 0.7, type: 'spring', stiffness: 120}}
    >
      <motion.div
        animate={{y: [0, -8, 0]}}
        transition={{duration: 3.5, repeat: Infinity, ease: 'easeInOut'}}
      >
        <svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden>
          <defs>
            <linearGradient id="botBody" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e6efff" />
            </linearGradient>
            <linearGradient id="botAccent" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FFE66D" />
            </linearGradient>
            <radialGradient id="botGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow */}
          <ellipse cx="100" cy="225" rx="55" ry="8" fill="url(#botGlow)" />

          {/* Antenna */}
          <line x1="100" y1="28" x2="100" y2="48" stroke="#6C63FF" strokeWidth="3" strokeLinecap="round" />
          <motion.circle
            cx="100"
            cy="24"
            r="6"
            fill="#FFE66D"
            animate={{scale: [1, 1.4, 1], opacity: [1, 0.6, 1]}}
            transition={{duration: 1.6, repeat: Infinity, ease: 'easeInOut'}}
          />

          {/* Head */}
          <rect x="55" y="50" width="90" height="80" rx="22" fill="url(#botBody)" stroke="#0F1E35" strokeWidth="3" />
          {/* Face screen */}
          <rect x="68" y="68" width="64" height="44" rx="12" fill="#0F1E35" />
          {/* Eyes */}
          <g>
            <motion.ellipse
              cx={88 + eye.x}
              cy={90 + eye.y}
              rx="6"
              ry={blink ? 0.6 : 6}
              fill="#4ECDC4"
            />
            <motion.ellipse
              cx={112 + eye.x}
              cy={90 + eye.y}
              rx="6"
              ry={blink ? 0.6 : 6}
              fill="#4ECDC4"
            />
          </g>
          {/* Smile */}
          <path d="M85 102 Q100 112 115 102" stroke="#FFE66D" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Ears */}
          <circle cx="50" cy="88" r="8" fill="url(#botAccent)" />
          <circle cx="150" cy="88" r="8" fill="url(#botAccent)" />

          {/* Body */}
          <rect x="60" y="138" width="80" height="70" rx="18" fill="url(#botBody)" stroke="#0F1E35" strokeWidth="3" />
          {/* Chest button */}
          <circle cx="100" cy="172" r="10" fill="url(#botAccent)" />
          <motion.circle
            cx="100"
            cy="172"
            r="14"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2"
            animate={{scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7]}}
            transition={{duration: 1.8, repeat: Infinity}}
          />

          {/* Left arm (waving) */}
          <motion.g
            style={{originX: '52px', originY: '148px'}}
            animate={wave}
          >
            <rect x="36" y="142" width="20" height="42" rx="10" fill="url(#botBody)" stroke="#0F1E35" strokeWidth="3" />
            <circle cx="46" cy="190" r="10" fill="url(#botAccent)" stroke="#0F1E35" strokeWidth="2" />
          </motion.g>

          {/* Right arm */}
          <g>
            <rect x="144" y="142" width="20" height="42" rx="10" fill="url(#botBody)" stroke="#0F1E35" strokeWidth="3" />
            <circle cx="154" cy="190" r="10" fill="url(#botAccent)" stroke="#0F1E35" strokeWidth="2" />
          </g>

          {/* Feet */}
          <rect x="68" y="208" width="24" height="14" rx="6" fill="#0F1E35" />
          <rect x="108" y="208" width="24" height="14" rx="6" fill="#0F1E35" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
