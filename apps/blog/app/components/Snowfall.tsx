'use client';

import React, { useEffect, useRef } from 'react';

interface SnowfallProps {
  count?: number;
  color?: string;
  speed?: number;
  opacity?: number;
  zIndex?: number;
}

type Snowflake = {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
};

const Snowfall: React.FC<SnowfallProps> = ({
  count = 40,
  color = '#ffffff',
  speed = 1,
  opacity = 0.6,
  zIndex = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

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
    window.addEventListener('resize', handleResize);

    const snowflakes: Snowflake[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 2,
      speedY: (Math.random() * 0.5 + 0.5) * speed,
      speedX: (Math.random() - 0.5) * 0.5 * speed,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      snowflakes.forEach(flake => {
        ctx.globalAlpha = flake.opacity * opacity;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();

        flake.y += flake.speedY;
        flake.x += flake.speedX;

        if (flake.y > height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, color, speed, opacity]);

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

export default Snowfall;
