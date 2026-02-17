'use client';

import { useState } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Input, Space, message } from 'antd';

import { commentArticle, getArticleComments } from '@/app/lib/api';
import type { SaveCommentDto } from '@/app/types';

function getCommentDisplay(item: SaveCommentDto) {
  return {
    name: item.user?.username ?? item.userName ?? '匿名用户',
    avatar: item.user?.avatar ?? item.userAvatar,
    ip: item.visitor?.ip ?? item.userIp,
    userAgent: item.visitor?.userAgent ?? item.userAgent,
  };
}

type ArticleCommentsCardProps = {
  articleId: string;
  comments: SaveCommentDto[];
};

export default function ArticleCommentsCard({
  articleId,
  comments: initialComments = [],
}: ArticleCommentsCardProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<SaveCommentDto[]>(initialComments);

  const loadComments = async () => {
    if (!articleId) return;
    // setLoading(true);
    const list = await getArticleComments(articleId);
    setComments(Array.isArray(list) ? list : []);
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      message.warning('评论内容不能为空');
      return;
    }
    if (!articleId) {
      message.error('文章信息有误，无法发表评论');
      return;
    }
    setSubmitting(true);
    try {
      await commentArticle({
        postId: articleId,
        content: trimmed,
        visitorId: localStorage.getItem('behaviorMonitor_visitor_id'),
      });
      message.success('评论已提交，待审核通过后展示');
      setContent('');
      // 重新加载评论列表
      loadComments();
    } catch (error) {
      console.error('发表评论失败', error);
      message.error('发表评论失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
  };

  return (
    <Card title="评论" size="small">
      <Space orientation="vertical" className="w-full" size={12}>
        <Input.TextArea
          placeholder="写下你的评论"
          autoSize={{ minRows: 3, maxRows: 6 }}
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={submitting}
        />
        <Space>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!content.trim() || submitting}
          >
            发表
          </Button>
          <Button onClick={handleCancel} disabled={(!content && !comments.length) || submitting}>
            取消
          </Button>
        </Space>
        <Divider style={{ margin: '8px 0' }} />
        <div className="comment-list-wrap">
          <ul className="comment-list">
            {comments.map(item => {
              const { name, avatar, ip, userAgent } = getCommentDisplay(item);
              return (
                <li
                  key={item.id ?? `${item.postId}-${item.content.slice(0, 10)}`}
                  className="comment-item"
                >
                  <div className="comment-item-inner">
                    <Avatar
                      size={40}
                      src={avatar}
                      icon={!avatar ? <UserOutlined /> : undefined}
                      className="comment-avatar"
                    />
                    <div className="comment-item-main">
                      <div className="comment-item-head">
                        <span className="comment-author">{name}</span>
                        {item.userEmail && <span className="comment-email">{item.userEmail}</span>}
                      </div>
                      {(ip || userAgent) && (
                        <div className="comment-meta">
                          {ip && <span>IP: {ip}</span>}
                          {userAgent && (
                            <span className="comment-agent" title={userAgent}>
                              {userAgent.length > 48 ? `${userAgent.slice(0, 48)}…` : userAgent}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="comment-content">{item.content}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Space>
    </Card>
  );
}
