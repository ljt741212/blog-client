import { Affix, Col, Row } from 'antd';

import { ArticleCommentsCard, ArticleContentCard, ArticleSidebar } from '@/components/article';
import { incrementViews, getArticleComments } from '@/lib/api';
import { get } from '@/lib/request';
import type { PaginationResponse } from '@/types';
import type { Article } from '@/types/article';

type ArticleDetailProps = {
  params: { id: string };
};

export default async function ArticleDetail({ params }: ArticleDetailProps) {
  const { id } = await params;

  let article: Article | null = null;
  let recentArticles: { id: string; title: string }[] = [];
  const [detailRes, listRes, commentsRes] = await Promise.all([
    get<Article>(`/posts/${id}`, {
      next: { revalidate: 60 },
    }),
    get<PaginationResponse<Article>>('/posts', {
      next: { revalidate: 60 },
    }),
    getArticleComments(id),
    incrementViews(Number(id)),
  ]);

  article = detailRes.data;
  const allArticles = listRes.data?.items ?? [];
  recentArticles = allArticles
    .filter(a => a.id !== (article?.id ?? id))
    .slice(0, 4)
    .map(a => ({ id: a.id, title: a.title }));
  const comments = commentsRes ?? [];
  const markdown = article.content || '';

  return (
    <div className="w-full min-h-screen mt-12">
      <div className="mx-auto w-full px-32 py-2">
        <Row gutter={[24, 24]} align="top" className="mt-4">
          <Col xs={24} lg={18}>
            <div id="article-scroll-container" className="w-full flex flex-col gap-4">
              <ArticleContentCard
                articleId={String(article?.id ?? id)}
                title={article?.title ?? ''}
                category={article?.category ?? { id: 0, name: '' }}
                tags={article?.tags?.map(tag => tag.name) ?? []}
                markdown={markdown}
                views={article?.views ?? 0}
                likes={article?.likes ?? 0}
              />
              <ArticleCommentsCard articleId={String(article?.id ?? id)} comments={comments} />
            </div>
          </Col>

          <Col xs={24} lg={6}>
            <Affix offsetTop={56}>
              <ArticleSidebar
                markdown={markdown}
                scrollRootId="article-scroll-container"
                recentArticles={recentArticles}
              />
            </Affix>
          </Col>
        </Row>
      </div>
    </div>
  );
}
