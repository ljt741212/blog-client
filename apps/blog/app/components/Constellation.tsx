'use client';

import React, { useEffect, useRef } from 'react';

interface ConstellationProps {
  count?: number;
  color?: string;
  lineWidth?: number;
  connectDistance?: number;
  speed?: number;
  zIndex?: number;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const genParticles = (count: number, width: number, height: number, speed: number): Particle[] =>
  Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6 * speed,
    vy: (Math.random() - 0.5) * 0.6 * speed,
    radius: Math.random() * 1.5 + 1,
  }));

const Constellation: React.FC<ConstellationProps> = ({
  count = 80,
  color = '#2563eb',
  lineWidth = 0.6,
  connectDistance = 150,
  speed = 1,
  zIndex = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const particles = genParticles(count, width, height, speed);
    const maxDistSq = connectDistance * connectDistance;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const { x: mx, y: my } = mouseRef.current;
      const colorRGB = hexToRgb(color);

      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = 1 - distSq / maxDistSq;
            ctx.strokeStyle = `rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},${(alpha * 0.15).toFixed(3)})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // draw particles & update
      ctx.fillStyle = color;
      particles.forEach(p => {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // gentle mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
          const force = 0.015 * speed;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // damp
        p.vx *= 0.999;
        p.vy *= 0.999;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [count, color, lineWidth, connectDistance, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex,
      }}
    />
  );
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export default Constellation;
