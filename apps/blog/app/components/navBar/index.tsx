'use client';

import { useEffect, useState } from 'react';

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
      label: '关于博客',
      href: '/aboutBlog',
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

  useEffect(() => {
    const sentinel = document.getElementById('nav-hide-sentinel');
    if (!sentinel) return;

    const HIDE_OFFSET_PX = 128;
    setHidden(window.scrollY >= HIDE_OFFSET_PX);

    const updateByRect = () => {
      const top = sentinel.getBoundingClientRect().top;
      setHidden(top <= -HIDE_OFFSET_PX);
    };

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setHidden(!entry?.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${HIDE_OFFSET_PX}px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);
    updateByRect();

    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateByRect();
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, []);

  const [homeMenu, aboutMeMenu] = menuItems;
  return (
    <nav
      aria-hidden={hidden}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full h-12
     backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--border-primary)] 
     bg-[var(--background-secondary)]/60 px-32
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
