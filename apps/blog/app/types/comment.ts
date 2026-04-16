/** 提交评论时使用的 DTO，与后端 CreateCommentDto 一致（字段名为 postId） */
export interface CreateCommentDto {
  postId: number;
  content: string;
  parentId?: number;
  userId?: number;
  visitorId?: number;
}

/** 后端 by-post 接口返回的 user/visitor 结构 */
export interface CommentUserDto {
  id: number;
  username: string;
  avatar?: string;
}
export interface CommentVisitorDto {
  id: number;
  ip?: string;
  userAgent?: string;
}

/** 评论列表项等使用的类型（含后端返回的扁平字段或 user/visitor 嵌套结构） */
export interface SaveCommentDto {
  id?: number;
  postId: number;
  content: string;
  parentId?: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userIp?: string;
  userAgent?: string;
  userReferer?: string;
  userLocation?: string;
  /** 后端 by-post 返回的嵌套结构，二选一 */
  user?: CommentUserDto | null;
  visitor?: CommentVisitorDto | null;
}
