'use client';

import React, { useEffect, useState } from 'react';

interface SuspensionPanelProps {
  threshold?: number; // 滚动多少像素后显示
  qqNumber?: string; // QQ 号码（用于一键联系）
}

const SuspensionPanel: React.FC<SuspensionPanelProps> = ({ threshold = 400, qqNumber }) => {
  const [visible, setVisible] = useState(false);

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

  const handleBackToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactQQ = () => {
    if (typeof window === 'undefined' || !qqNumber) return;
    const url = `https://wpa.qq.com/msgrd?v=3&uin=${qqNumber}&site=qq&menu=yes`;
    window.open(url, '_blank');
  };

  const commonBtnClasses =
    'flex h-10 w-10 items-center justify-center rounded-md bg-white/95 shadow-md shadow-black/10 border border-black/5 hover:bg-white hover:shadow-lg hover:-translate-y-[1px] transition-all dark:bg-zinc-900/95 dark:border-zinc-700 dark:hover:bg-zinc-800';

  return (
    <div
      className={`fixed right-4 bottom-8 z-[60] transform transition-opacity duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* QQ 联系按钮 */}
        <button
          type="button"
          onClick={handleContactQQ}
          disabled={!qqNumber}
          title={qqNumber ? `QQ: ${qqNumber}` : '请在代码中配置 qqNumber'}
          className={`${commonBtnClasses} ${
            qqNumber
              ? 'cursor-pointer'
              : 'cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-md'
          }`}
        >
          {/* 简单 QQ 图标（对话气泡形状） */}
          <span className="text-lg leading-none">Q</span>
        </button>

        {/* 回到顶部按钮 */}
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
