import type { PaginationParams } from '@/types/index';

export enum ArticleStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface ArticleListItem {
  id: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  status: ArticleStatusEnum;
  categoryId?: number | null;
  category?: string | null;
  tagIds: number[];
  tags: string;
  author?: string | null;
  publishTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  coverImage?: string | null;
  category: {
    id: number;
    name: string;
    description?: string | null;
  } | null;
  tags: {
    id: number;
    name: string;
    description?: string | null;
  }[];
  author: {
    id: number;
    username: string;
    avatar?: string | null;
    bio?: string | null;
  } | null;
  status: ArticleStatusEnum;
  publishTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveArticleDto {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId: number;
  tagIds?: number[];
  status?: ArticleStatusEnum;
  publishTime?: string;
}

export interface ArticlePageQueryDto extends PaginationParams {
  searchValue?: string;
  status?: ArticleStatusEnum;
}
