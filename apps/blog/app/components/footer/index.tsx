'use client';

import { useEffect, useState } from 'react';

import { LinkOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { getIcpInfo, getSiteConfig } from '@/lib/api';
import type { IcpInfo, SiteConfig } from '@/types';

function calcDays(startedAt: string) {
  const start = new Date(startedAt).getTime();
  return Math.floor((Date.now() - start) / 86400000);
}

export default function Footer() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [icpInfo, setIcpInfo] = useState<IcpInfo | null>(null);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getSiteConfig(), getIcpInfo()]).then(([sc, icp]) => {
      setSiteConfig(sc);
      setIcpInfo(icp);
      if (sc?.siteStartedAt) setDays(calcDays(sc.siteStartedAt));
    });
  }, []);

  return (
    <footer className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full px-32 py-6 flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-4 text-[var(--text-muted)] text-xs">
          {days !== null && (
            <>
              <span suppressHydrationWarning>已稳定运行 {days} 天</span>
              <span className="text-[var(--border-primary)]">|</span>
            </>
          )}
          {icpInfo?.icpNumber && (
            <a href={icpInfo?.icpUrl ?? '#'} target="_blank" rel="noopener noreferrer">
              {icpInfo.icpNumber}
            </a>
          )}
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <LinkOutlined />
            RSS
          </Link>
        </div>
        {siteConfig?.footerText && (
          <p className="text-xs text-[var(--text-tertiary)] italic" suppressHydrationWarning>
            &ldquo;{siteConfig.footerText}&rdquo;
          </p>
        )}
      </div>
    </footer>
  );
}
