'use client';

import { useState } from 'react';

import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Badge, Card, Divider, Space, Tag, Typography, message } from 'antd';
import { Viewer } from 'markdownEditor';

import { incrementLikes } from '@/lib/api';

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
};

export default function ArticleContentCard({
  articleId,
  title = '',
  category = { id: 0, name: '' },
  tags = [],
  markdown,
  likes,
}: ArticleContentCardProps) {
  const [likeCount, setLikeCount] = useState(likes);
  const handleClickLike = async () => {
    await incrementLikes(Number(articleId));
    setLikeCount(likeCount + 1);
    // 查询点赞数
  };

  const handleClickShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (!navigator) {
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    message.success('链接已复制到剪贴板');
    await navigator.share({
      url: shareUrl,
      title: title || document.title,
      text: title || '',
    });
  };

  return (
    <Card>
      <Space orientation="vertical" size={12} className="w-full">
        <div>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            {title}
          </Typography.Title>
          <Space wrap size={[8, 8]}>
            <Typography.Text type="secondary">ID：{articleId}</Typography.Text>
            <Divider orientation="vertical" />
            <Typography.Text type="secondary">分类：</Typography.Text>
            <Tag key={category.id}>{category.name}</Tag>
            <Divider orientation="vertical" />
            <Typography.Text type="secondary">标签：</Typography.Text>
            {tags.map(t => (
              <Tag key={t}>{t}</Tag>
            ))}
          </Space>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div className="w-full">
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
                className="w-14 h-14 flex items-center justify-center rounded-full border border-[var(--ant-color-border)] bg-transparent cursor-pointer hover:border-[var(--ant-color-primary)] hover:text-[var(--ant-color-primary)] transition-colors text-[var(--ant-color-text-tertiary)]"
                aria-label="点赞"
                onClick={handleClickLike}
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
