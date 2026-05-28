'use client';

import { useEffect, useRef } from 'react';

// ── Ribbons effect（Qzdy 原版逻辑） ──

interface Section {
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  p3x: number;
  p3y: number;
  hue: number;
  delay: number;
  phase: number;
  alpha: number;
  dir: number; // 1=right, -1=left
}

export default function GeometricRibbons() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const ribbonsRef = useRef<(Section[] | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.globalAlpha = 0.5;

    const SPEED = 200;
    const COUNT = 3;
    const HIDE = 200;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    };
    window.addEventListener('resize', onResize);

    function addRibbon() {
      // Qzdy: Math.round(random(1,9)) > 5 → ~44% right, ~56% left
      const dir = Math.random() < 0.44 ? 1 : -1;
      const min = -HIDE;
      const max = W + HIDE;
      const sx = dir === 1 ? min : max;
      const sy = Math.round(Math.random() * H);
      let hue = Math.round(Math.random() * 360);

      const sections: Section[] = [];
      let p1 = { x: sx, y: sy };
      let p2 = { x: sx, y: sy };
      let delay = 0;
      let stop = 1000;

      while (stop > 0) {
        stop--;

        const mx = Math.round((Math.random() * 1 - 0.2) * SPEED);
        const my = Math.round((Math.random() * 1 - 0.5) * (H * 0.25));
        const p3 = {
          x: p2.x + mx * dir,
          y: p2.y + my,
        };

        sections.push({
          p1x: p1.x,
          p1y: p1.y,
          p2x: p2.x,
          p2y: p2.y,
          p3x: p3.x,
          p3y: p3.y,
          hue,
          delay,
          phase: 0,
          alpha: 0,
          dir,
        });

        p1 = { x: p2.x, y: p2.y };
        p2 = { x: p3.x, y: p3.y };

        if (dir === 1 && p2.x >= max) break;
        if (dir === -1 && p2.x <= min) break;

        delay += 4;
        hue += 5;
      }

      ribbonsRef.current.push(sections);
    }

    function drawSection(s: Section): boolean {
      if (s.phase >= 1 && s.alpha <= 0) return true;

      if (s.delay <= 0) {
        s.phase += 0.02;
        s.alpha = Math.sin(s.phase) * 1;
        s.alpha = s.alpha <= 0 ? 0 : s.alpha >= 1 ? 1 : s.alpha;

        const mod = Math.sin(1 + (s.phase * Math.PI) / 2) * 0.1;
        if (s.dir === 1) {
          s.p1x += mod;
          s.p2x += mod;
          s.p3x += mod;
        } else {
          s.p1x -= mod;
          s.p2x -= mod;
          s.p3x -= mod;
        }
        s.p1y += mod;
        s.p2y += mod;
        s.p3y += mod;
      } else {
        s.delay -= 0.5;
      }

      const c = `hsla(${s.hue}, 60%, 50%, ${s.alpha})`;
      ctx.beginPath();
      ctx.moveTo(s.p1x, s.p1y);
      ctx.lineTo(s.p2x, s.p2y);
      ctx.lineTo(s.p3x, s.p3y);
      ctx.fillStyle = c;
      ctx.fill();

      return false;
    }

    function draw() {
      ribbonsRef.current = ribbonsRef.current.filter(r => r !== null);

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.5;

      for (let a = 0; a < ribbonsRef.current.length; a++) {
        const ribbon = ribbonsRef.current[a];
        if (!ribbon) continue;
        let done = 0;
        for (let b = 0; b < ribbon.length; b++) {
          if (drawSection(ribbon[b])) done++;
        }
        if (done >= ribbon.length) ribbonsRef.current[a] = null;
      }

      if (ribbonsRef.current.filter(r => r !== null).length < COUNT) {
        addRibbon();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    for (let i = 0; i < COUNT; i++) addRibbon();

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
