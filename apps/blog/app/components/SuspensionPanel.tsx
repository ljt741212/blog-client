'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface SuspensionPanelProps {
  threshold?: number;
}

const SuspensionPanel: React.FC<SuspensionPanelProps> = ({ threshold = 400 }) => {
  const [visible, setVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(scrollTop >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleBackToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  const commonBtnClasses =
    'flex h-10 w-10 items-center justify-center rounded-md bg-white/95 shadow-md shadow-black/10 border border-black/5 hover:bg-white hover:shadow-lg hover:-translate-y-[1px] transition-all dark:bg-zinc-900/95 dark:border-zinc-700 dark:hover:bg-zinc-800';

  return (
    <div
      className={`fixed right-4 bottom-8 z-[60] transform transition-opacity duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? '退出全屏' : '全屏'}
          className={commonBtnClasses}
        >
          <span className="text-lg leading-none">{isFullscreen ? '✕' : '⛶'}</span>
        </button>

        <button
          type="button"
          onClick={handleBackToTop}
          className={commonBtnClasses}
          title="回到顶部"
        >
          <span className="text-lg leading-none">↑</span>
        </button>
      </div>
    </div>
  );
};

export default SuspensionPanel;
