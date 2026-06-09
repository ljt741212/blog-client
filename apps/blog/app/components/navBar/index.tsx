'use client';

import { useEffect, useRef, useState } from 'react';

import NavLink from './navLink';

const menuItems = [
  [
    {
      label: '首页',
      href: '/',
    },
    {
      label: '更新日志',
      href: '/changeLog',
    },
    {
      label: '留言板',
      href: '/messageBoard',
    },
    {
      label: '友链',
      href: '/friendLinks',
    },
  ],
  [
    {
      label: '关于我',
      href: '/aboutMe',
    },
  ],
];

export default function NavBar() {
  const [hidden, setHidden] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const HIDE_OFFSET_PX = 128;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
          setHidden(false);
        } else if (currentScrollY > prevScrollY.current && currentScrollY > HIDE_OFFSET_PX) {
          setHidden(true);
        } else if (currentScrollY < prevScrollY.current) {
          setHidden(false);
        }

        prevScrollY.current = currentScrollY;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const [homeMenu, aboutMeMenu] = menuItems;
  return (
    <nav
      aria-hidden={hidden}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full h-12
     backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--border-primary)] 
     bg-[var(--background-secondary)]/20 px-32
     transition-[transform,opacity] duration-500 ease-in-out
     "
      style={{
        willChange: 'transform, opacity',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      <div className="flex items-center space-x-6">
        {homeMenu.map(item => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
      <div className="flex items-center space-x-6">
        {aboutMeMenu.map(item => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
    </nav>
  );
}
