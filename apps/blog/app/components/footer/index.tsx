'use client';

import { useState } from 'react';

import { LinkOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { useSiteConfig } from '@/context/SiteConfigContext';

const FALLBACK_START_DATE = '2025-05-18';

const FALLBACK_QUOTES = [
  '代码是写给人看的，顺便能在机器上运行。',
  '优秀的代码本身就是最好的文档。',
  '先让它能工作，再让它变优雅。',
  '技术是解决问题的艺术。',
  '学而不思则罔，思而不学则殆。',
  'Stay hungry, stay foolish.',
  '大道至简。',
  'Talk is cheap. Show me the code.',
  '千里之行，始于足下。',
  '一个好的程序员是那种能过单行道却总两边看的人。',
  '简单是可靠的前提。',
  'Debugging 就像在一部犯罪电影中，你同时是凶手、侦探和受害者。',
  '代码如诗，架构如画。',
  '编程不是输入，是思考。',
  'First, solve the problem. Then, write the code.',
  '没有银弹。',
  '工欲善其事，必先利其器。',
  '持续学习是工程师最好的投资。',
  '代码审查是最好的知识共享。',
  '不积跬步，无以至千里。',
];

export default function Footer() {
  const siteConfig = useSiteConfig();
  const startDateStr = siteConfig?.startDate || FALLBACK_START_DATE;
  const dailyQuote = siteConfig?.dailyQuote;

  const [days] = useState(() => {
    const start = new Date(startDateStr).getTime();
    return Math.floor((Date.now() - start) / 86400000);
  });

  const [randomQuote] = useState(
    () => FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
  );

  const quote = dailyQuote || randomQuote;

  return (
    <footer className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full px-32 py-6 flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-4 text-[var(--text-muted)] text-xs">
          <span suppressHydrationWarning>已稳定运行 {days} 天</span>
          <span className="text-[var(--border-primary)]">|</span>
          <span>粤ICP备2026000000号-1</span>
          <span className="text-[var(--border-primary)]">|</span>
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <LinkOutlined />
            RSS
          </Link>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] italic" suppressHydrationWarning>
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </footer>
  );
}
