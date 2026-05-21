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
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.4 - 0.2,
          life: 0,
          max: 60 + Math.random() * 50,
          r: 2 + Math.random() * 6,
          hue: colors[Math.floor(Math.random() * colors.length)],
          kind: Math.random() > 0.5 ? 'bubble' : 'spark',
        });
      }
      if (particles.length > 220) particles.splice(0, particles.length - 220);
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
        ctx.globalAlpha = t * 0.85;
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
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
    />
  );
}
