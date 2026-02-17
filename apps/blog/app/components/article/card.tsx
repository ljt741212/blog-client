'use client';

import type { ReactNode } from 'react';

import { UserOutlined, ClockCircleOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import type { Article } from '@/app/types/article';

const MetaIcon = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[var(--text-muted)]">
    {children}
  </span>
);

interface ArticlesCardProps {
  data: Article;
}

export default function ArticlesCard({ data }: ArticlesCardProps) {
  const router = useRouter();
  const goToArticleDetail = (e: React.MouseEvent<HTMLDivElement>) => {
    router.push(`/articles/${data.id}`);
    e.stopPropagation();
  };

  return (
    <div
      className="relative rounded-2xl flex items-stretch gap-6 pr-8 py-6 h-48 border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-2xl)] cursor-pointer"
      style={{
        background: 'var(--gradient-card)',
        borderColor: 'var(--border-primary)',
        boxShadow: 'var(--shadow-xl)',
      }}
      onClick={goToArticleDetail}
    >
      <div
        className="ml-4 w-32 h-full flex items-center justify-center rounded-2xl backdrop-blur-md border overflow-hidden"
        style={{
          background: 'var(--gradient-accent)',
          borderColor: 'var(--border-secondary)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {data.coverImage ? (
          <img src={data.coverImage} alt={data.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-muted)] bg-[var(--background-secondary)]">
            无封面
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 py-2 flex-1 min-w-0">
        <p className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1 text-[var(--text-primary)]">
            <MetaIcon>
              <UserOutlined />
            </MetaIcon>
            <span>{data.author?.username ?? '匿名作者'}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
            <MetaIcon>
              <ClockCircleOutlined />
            </MetaIcon>
            <span>{data.publishTime ? new Date(data.publishTime).toLocaleDateString() : ''}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--text-disabled)]">
            <MetaIcon>
              <EyeOutlined />
            </MetaIcon>
            <span>{data.views}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--text-disabled)]">
            <MetaIcon>
              <LikeOutlined />
            </MetaIcon>
            <span>{data.likes}</span>
          </span>
        </p>
        <h3 className="h-7 font-bold text-lg truncate text-[var(--text-primary)]">{data.title}</h3>
        <p className="flex-1 text-base line-clamp-2 overflow-hidden text-[var(--text-tertiary)]">
          {data.summary}
        </p>
      </div>
    </div>
  );
}
