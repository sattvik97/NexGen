import {useEffect, useRef} from 'react';

/**
 * Lightweight canvas particle cursor trail — bubbles + sparkles that follow
 * the pointer and drift upward, then fade. Pure 2D canvas, no deps.
 */
export function CursorParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // Skip entirely on touch / coarse-pointer devices — saves a fullscreen
    // canvas + RAF loop on phones where a cursor trail makes no sense.
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (coarse) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      max: number;
      r: number;
      hue: string;
      kind: 'bubble' | 'spark';
    };
    const particles: P[] = [];
    const colors = ['#FF6B35', '#4ECDC4', '#6C63FF', '#FFE66D'];

    const onMove = (e: MouseEvent) => {
      // Throttle: only spawn on a fraction of moves so the trail is light
      if (Math.random() > 0.45) return;
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1 - 0.15,
        life: 0,
        max: 45 + Math.random() * 35,
        r: 1.5 + Math.random() * 3,
        hue: colors[Math.floor(Math.random() * colors.length)],
        kind: Math.random() > 0.7 ? 'spark' : 'bubble',
      });
      if (particles.length > 70) particles.splice(0, particles.length - 70);
    };

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.99;
        const t = 1 - p.life / p.max;
        if (t <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = t * 0.45;
        if (p.kind === 'bubble') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.hue + '55';
          ctx.fill();
          ctx.strokeStyle = p.hue;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.life * 0.1);
          ctx.fillStyle = p.hue;
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const a = (s / 5) * Math.PI * 2 - Math.PI / 2;
            const rx = Math.cos(a) * p.r;
            const ry = Math.sin(a) * p.r;
            const a2 = a + Math.PI / 5;
            const rx2 = Math.cos(a2) * (p.r * 0.45);
            const ry2 = Math.sin(a2) * (p.r * 0.45);
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
            ctx.lineTo(rx2, ry2);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{mixBlendMode: 'plus-lighter'}}
    />
  );
}
