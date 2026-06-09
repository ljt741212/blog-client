import { get, post, patch, del } from '@/lib/request';

import type { FriendLink, SaveFriendLinkDto } from '~/types/friendLink';

export const friendLinkService = {
  getList: (status?: number) =>
    get<FriendLink[]>(`/friend-links${status !== undefined ? `?status=${status}` : ''}`),

  save: (dto: SaveFriendLinkDto) => post<FriendLink>('/friend-links', dto),

  updateStatus: (id: number, status: number) =>
    patch<FriendLink>(`/friend-links/${id}/status`, { status }),

  batchSort: (items: { id: number; sort: number }[]) =>
    patch<void>('/friend-links/sort', { items }),

  delete: (id: number) => del<void>(`/friend-links/${id}`),
};
