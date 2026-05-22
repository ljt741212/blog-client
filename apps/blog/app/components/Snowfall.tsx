'use client';

import React, { useEffect, useState, useId } from 'react';

interface SnowfallProps {
  count?: number;
  color?: string;
  speed?: number;
  opacity?: number;
  zIndex?: number;
}

interface Flake {
  left: number;
  size: number;
  fallDuration: number;
  swayDuration: number;
  delay: number;
}

const genFlakes = (count: number, speed: number): Flake[] =>
  Array.from({ length: count }).map(() => ({
    left: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    fallDuration: (Math.random() * 5 + 5) / speed,
    swayDuration: (Math.random() * 3 + 2) / speed,
    delay: Math.random() * 8,
  }));

const Snowfall: React.FC<SnowfallProps> = ({
  count = 40,
  opacity = 0.6,
  zIndex = 50,
  speed = 1,
}) => {
  const id = useId();
  const [flakes, setFlakes] = useState<Flake[]>(() => []);

  useEffect(() => {
    setFlakes(genFlakes(count, speed));
  }, [count, speed]);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex,
        opacity,
      }}
    >
      {flakes.map((flake, i) => (
        <div
          key={`${id}-${i}`}
          style={{
            position: 'absolute',
            left: `${flake.left}%`,
            top: `-${flake.size * 2}px`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            borderRadius: '50%',
            background: '#ffffff',
            animation: `snowFall ${flake.fallDuration}s ${flake.delay}s linear infinite,
                         snowSway ${flake.swayDuration}s ${flake.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes snowFall {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        @keyframes snowSway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(${15 * speed}px); }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
