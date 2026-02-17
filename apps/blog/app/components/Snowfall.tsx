'use client';

import React, { useEffect, useRef } from 'react';

type Snowflake = {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
};

interface SnowfallProps {
  count?: number; // 雪花数量
  color?: string; // 雪花颜色
  speed?: number; // 基础速度系数
  opacity?: number; // 全局透明度
  zIndex?: number; // 图层层级
}

const Snowfall: React.FC<SnowfallProps> = ({
  count = 120,
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

    const context = canvas.getContext('2d');
    if (!context) return;

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
      radius: Math.random() * 2.5 + 1,
      speedY: (Math.random() * 0.5 + 0.5) * speed,
      speedX: (Math.random() - 0.5) * 0.5 * speed,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.globalAlpha = opacity;

      snowflakes.forEach(flake => {
        context.beginPath();
        context.fillStyle = color;
        context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        context.fill();

        flake.y += flake.speedY;
        flake.x += flake.speedX;

        if (flake.y > height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;
      });

      animationRef.current = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, color, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
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
