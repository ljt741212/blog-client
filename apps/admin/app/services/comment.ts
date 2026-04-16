import { get, del, put } from '@/lib/request';
import type { PaginationResponse } from '@/types/index';

import type { Comment, CommentStatusEnum } from '~/types/comment';

export const commentService = {
  getCommentList: (params: object) => get<PaginationResponse<Comment>>('/comments/page', params),
  deleteComment: (id: string) => del<Comment>(`/comments/${id}`),
  updateCommentStatus: (id: number, status: CommentStatusEnum) =>
    put<void>(`/comments/${id}/status`, { status }),
};
