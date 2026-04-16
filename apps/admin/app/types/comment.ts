import type { PaginationParams, PaginationResponse } from '@/types/index';

export enum CommentStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface CommentUserSummary {
  id: number;
  username: string;
}

export interface CommentVisitorSummary {
  id: number;
  ip: string | null;
}

export interface CommentPostSummary {
  id: number;
  title: string;
}

export interface Comment {
  id: number;
  content: string;
  status: CommentStatusEnum;
  likes: number;
  postId: number;
  parentId: number | null;
  user: CommentUserSummary | null;
  visitor: CommentVisitorSummary | null;
  post: CommentPostSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentAdminPageQueryDto extends PaginationParams {
  postId?: number;
  status?: CommentStatusEnum;
  searchValue?: string;
}

export type CommentPageResponse = PaginationResponse<Comment>;

export interface CreateCommentDto {
  content: string;
  postId: number;
  parentId?: number;
  userId?: number;
  visitorId?: string;
}

export interface UpdateCommentStatusDto {
  status: CommentStatusEnum;
}

export interface CommentReplyItem {
  id: number;
  content: string;
  likes: number;
  user: { id: number; username: string; avatar?: string | null } | null;
  visitor: { id: number; ip: string | null } | null;
  createdAt: string;
}

export interface CommentByPostItem {
  id: number;
  content: string;
  likes: number;
  status: CommentStatusEnum;
  user: { id: number; username: string; avatar?: string | null } | null;
  visitor: { id: number; ip: string | null; userAgent?: string } | null;
  replies: CommentReplyItem[];
  createdAt: string;
}

export interface CommentsByPostQueryDto {
  postId: number;
  page?: number;
  limit?: number;
  approvedOnly?: boolean;
}
