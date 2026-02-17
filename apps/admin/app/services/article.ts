import { get, post, put, del } from '@/lib/request';
import type {
  ArticlePageQueryDto,
  SaveArticleDto,
  ArticleStatusEnum,
  ArticleDetail,
} from '~/types/article';
import type { PaginationResponse } from '@/types/index';

export const articleService = {
  saveArticle: (article: SaveArticleDto) => post<SaveArticleDto>('/posts', article),
  getArticleById: (id: string) => get<ArticleDetail>(`/posts/${id}`),
  getArticleAll: () => get<SaveArticleDto[]>('/posts'),
  getArticleList: (params: ArticlePageQueryDto) =>
    get<PaginationResponse<SaveArticleDto>>('/posts/page', { params }),
  deleteArticle: (id: string) => del<SaveArticleDto>(`/posts/${id}`),
  updateArticleStatus: (id: number, status: ArticleStatusEnum) =>
    put<SaveArticleDto>(`/posts/${id}/status`, { status }),
};
