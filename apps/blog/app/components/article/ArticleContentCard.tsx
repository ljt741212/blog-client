'use client';

import { useEffect, useRef, useState } from 'react';

import { LikeOutlined, ShareAltOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Badge, Card, Divider, Space, Tag, Typography, message } from 'antd';
import { Viewer } from 'markdownEditor';

import { incrementLikes } from '@/lib/api';

import EditArticleButton from './EditArticleButton';

function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      message.success('代码已复制');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-xs
        bg-[var(--background-secondary)] border border-[var(--border-primary)]
        text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]
        transition-colors opacity-0 group-hover:opacity-100"
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
      {copied ? '已复制' : '复制'}
    </button>
  );
}

export type ArticleContentCardProps = {
  articleId: string;
  title?: string;
  category?: {
    id: number;
    name: string;
  };
  tags?: string[];
  markdown: string;
  views: number;
  likes: number;
  publishTime?: string;
};

export default function ArticleContentCard({
  articleId,
  title = '',
  category = { id: 0, name: '' },
  tags = [],
  markdown,
  views,
  likes,
  publishTime,
}: ArticleContentCardProps) {
  const [likeCount, setLikeCount] = useState(likes);
  const [likeLoading, setLikeLoading] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;
    const container = viewerRef.current;
    // Wait for bytemd to finish rendering
    const timer = setTimeout(() => {
      const pres = container.querySelectorAll('pre');
      pres.forEach(pre => {
        if (pre.closest('[data-code-copy]')) return;
        const code = pre.querySelector('code');
        const text = code?.textContent ?? '';
        if (!text.trim()) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';
        wrapper.setAttribute('data-code-copy', 'true');
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const btnSpan = document.createElement('span');
        wrapper.appendChild(btnSpan);

        import('react-dom/client').then(({ createRoot }) => {
          createRoot(btnSpan).render(<CodeCopyButton code={text} />);
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [markdown]);

  const handleClickLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await incrementLikes(Number(articleId));
      setLikeCount(c => c + 1);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleClickShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = title || (typeof document !== 'undefined' ? document.title : '');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ url: shareUrl, title: shareTitle, text: title || '' });
        return;
      } catch {
        // user cancelled or not supported, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success('链接已复制到剪贴板');
    } catch {
      message.error('复制失败，请手动复制链接');
    }
  };

  return (
    <Card>
      <Space orientation="vertical" size={12} className="w-full">
        <div className="flex items-start justify-between">
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            {title}
          </Typography.Title>
          <EditArticleButton articleId={articleId} />
        </div>
        <Space wrap size={[8, 8]}>
          <Typography.Text type="secondary">ID：{articleId}</Typography.Text>
          <Divider orientation="vertical" />
          <Typography.Text type="secondary">阅读：{views}</Typography.Text>
          <Divider orientation="vertical" />
          {publishTime && (
            <>
              <Typography.Text type="secondary">
                发布于 {new Date(publishTime).toLocaleDateString('zh-CN')}
              </Typography.Text>
              <Divider orientation="vertical" />
            </>
          )}
          <Typography.Text type="secondary">分类：</Typography.Text>
          <Tag key={category.id}>{category.name}</Tag>
          <Divider orientation="vertical" />
          <Typography.Text type="secondary">标签：</Typography.Text>
          {tags.map(t => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Space>

        <Divider style={{ margin: '8px 0' }} />

        <div ref={viewerRef} className="w-full">
          <Viewer value={markdown} />
        </div>

        <Divider style={{ margin: '16px 0 0' }} />

        <div className="w-full flex justify-center pt-8 px-0 pb-6">
          <Typography.Text className="text-sm tracking-[0.125rem] text-[var(--ant-color-text-tertiary)]">
            — THE END —
          </Typography.Text>
        </div>
        <div className="w-full flex items-center justify-center gap-8 min-h-[100px] pt-6 px-4 pb-7 rounded-lg bg-[var(--ant-color-fill-quaternary)]">
          <div className="flex flex-col items-center gap-2">
            <Badge
              count={likeCount}
              showZero
              size="small"
              color="#8c8c8c"
              offset={[-8, 8]}
              styles={{ indicator: { fontWeight: 500 } }}
            >
              <button
                type="button"
                className="w-14 h-14 flex items-center justify-center rounded-full border border-[var(--ant-color-border)] bg-transparent cursor-pointer hover:border-[var(--ant-color-primary)] hover:text-[var(--ant-color-primary)] transition-colors text-[var(--ant-color-text-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="点赞"
                onClick={handleClickLike}
                disabled={likeLoading}
              >
                <LikeOutlined className="text-2xl" />
              </button>
            </Badge>
          </div>
          <button
            type="button"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-[var(--ant-color-border)] bg-transparent cursor-pointer hover:border-[var(--ant-color-primary)] hover:text-[var(--ant-color-primary)] transition-colors text-[var(--ant-color-text-tertiary)]"
            aria-label="转发"
            onClick={handleClickShare}
          >
            <ShareAltOutlined className="text-2xl" />
          </button>
        </div>
      </Space>
    </Card>
  );
}
