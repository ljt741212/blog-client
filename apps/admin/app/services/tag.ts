import { get, post, del } from '@/lib/request';
import type { PaginationResponse } from '@/types/index';

import type { Tag, TagPageQueryDto } from '~/types/tag';

export const tagService = {
  getTagList: (params: TagPageQueryDto) => {
    return get<PaginationResponse<Tag>>('/tags/page', { params });
  },
  getTagById: (id: string) => get<Tag>(`/tags/${id}`),
  getTagAll: () => get<Tag[]>('/tags'),
  saveTag: (tag: Partial<Tag>) => post('/tags', tag),
  deleteTag: (id: string) => del(`/tags/${id}`),
};
