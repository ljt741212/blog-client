// 对应后端 PostStatus 枚举（字符串枚举）
export enum ArticleStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * 博客前台使用的文章类型
 * 和后端文章详情（PostService.findDetail）保持一致
 */
export interface Article {
  /** 文章 ID（后端为 number，这里统一为 string） */
  id: string;
  /** 标题 */
  title: string;
  /** 正文内容（Markdown） */
  content: string;
  /** 摘要，可为空 */
  summary?: string | null;
  /** 封面图，可为空 */
  coverImage?: string | null;
  /** 分类对象，可为空 */
  category: {
    id: number;
    name: string;
    description?: string | null;
  } | null;
  /** 标签列表 */
  tags: {
    id: number;
    name: string;
    description?: string | null;
  }[];
  /** 作者信息，可为空 */
  author: {
    id: number;
    username: string;
    avatar?: string | null;
    bio?: string | null;
  } | null;
  /** 状态：draft/published/archived */
  status: ArticleStatusEnum;
  /** 发布时间，可为空（仅发布后有值） */
  publishTime?: string | null;
  /** 创建时间（ISO 字符串） */
  createdAt: string;
  /** 更新时间（ISO 字符串） */
  updatedAt: string;
  /** 浏览量 */
  views: number;
  /** 点赞量 */
  likes: number;
}
