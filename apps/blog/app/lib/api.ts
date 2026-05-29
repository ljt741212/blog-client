import {
  SeoSetting,
  Article,
  Tag,
  Category,
  CreateCommentDto,
  SaveCommentDto,
  Changelog,
  PaginationParams,
  PaginationResponse,
  CreateGuestMessageDto,
  GuestMessage,
  Author,
  SiteConfig,
} from '@/types';

import { get, post, put } from './request';

/**
 * 获取最新的SEO设置
 */
export async function getSeoSettings(): Promise<SeoSetting | null> {
  const result = await get<SeoSetting>('/seo-settings/latest', {
    next: { revalidate: 3600 }, // 缓存1小时
  });
  return result.data || null;
}

/**
 * 获取站点配置（背景图等）
 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  const result = await get<SiteConfig>('/site-config', {
    next: { revalidate: 300 }, // 缓存5分钟
  });
  return result.data ?? null;
}

/**
 *
 * @param search 搜索关键词
 * @param pageNum 页码
 * @param pageSize 每页条数
 * @returns 文章列表
 */
export async function getArticles(
  params: PaginationParams & { searchValue?: string; categoryId?: number; tagId?: number }
): Promise<PaginationResponse<Article>> {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  const result = await get<PaginationResponse<Article>>(`/posts?${query}`);
  return result.data;
}
/**
 * 获取文章分类
 * @returns 文章分类
 */
export async function getArticleCategories(): Promise<Category[]> {
  const result = await get<Category[]>('/categories');
  return result.data || [];
}

/**
 * 获取文章标签
 * @returns 文章标签
 */
export async function getArticleTags(): Promise<Tag[]> {
  const result = await get<Tag[]>('/tags');
  return result.data || [];
}

/**
 * 获取文章评论（后端返回分页对象 { items, total, ... }，此处只取 items 数组）
 * @param postId 文章ID
 * @returns 文章评论列表
 */
export async function getArticleComments(postId: string): Promise<SaveCommentDto[]> {
  const id = Number(postId);
  const result = await get<{ items?: SaveCommentDto[] }>(`/comments/by-post?postId=${id}`);
  return result.data?.items ?? [];
}

/**
 * 评论文章（后端要求 body 使用 postId，且为不小于 1 的整数）
 * @param dto 评论 DTO，需包含 postId、content
 * @returns 评论
 */
export async function commentArticle(dto: CreateCommentDto): Promise<SaveCommentDto | null> {
  const result = await post<SaveCommentDto>('/comments', dto);
  return result.data ?? null;
}

/**
 * 获取更新日志列表（仅已发布，按发布日期倒序）
 */
export async function getChangelogs(): Promise<Changelog[]> {
  const result = await get<Changelog[]>('/changelogs', {
    next: { revalidate: 300 }, // 缓存 5 分钟
  });
  return result.data ?? [];
}

/**
 * 新增访客留言
 * @param dto 访客留言 DTO
 * @returns 访客留言
 */
export async function createGuestMessage(dto: CreateGuestMessageDto): Promise<GuestMessage | null> {
  const result = await post<GuestMessage>('/guest-messages', dto);
  return result.data ?? null;
}

/**
 * 获取访客留言列表
 * @returns 访客留言列表
 */
export async function getGuestMessageList(): Promise<GuestMessage[]> {
  const result = await get<GuestMessage[]>('/guest-messages');
  return result.data ?? [];
}

/**
 * 获取博主信息
 * @returns 作者信息
 */
export async function getAuthor(): Promise<Author | null> {
  const result = await get<Author>('/users/super-admin');
  return result.data ?? null;
}

/**
 * 增加浏览量
 * @param id 文章ID
 * @returns 是否成功
 */
export async function incrementViews(id: number): Promise<boolean> {
  const result = await put<boolean>(`/posts/${id}/views`);
  return result.data ?? false;
}

/**
 * 增加点赞量
 * @param id 文章ID
 * @returns 是否成功
 */
export async function incrementLikes(id: number): Promise<boolean> {
  const result = await put<boolean>(`/posts/${id}/likes`);
  return result.data ?? false;
}

/**
 * 在线
 * @returns 是否成功
 */
export async function heartbeat(): Promise<boolean> {
  const result = await post<boolean>('/visitor/heartbeat');
  return result.data ?? false;
}
