import { get, post, del, put } from '@/lib/request';
import type { PaginationResponse } from '@/types';

import type {
  GuestMessage,
  GuestMessageAdminPageQueryDto,
  GuestMessageStatus,
} from '~/types/guestMessage';

export const guestMessageService = {
  /** 管理端分页查询留言列表 */
  getGuestMessageList: async (params: GuestMessageAdminPageQueryDto) => {
    const res = await get<PaginationResponse<GuestMessage>>('/guest-messages/page', { params });
    return res.data;
  },

  /** 删除留言（管理端） */
  deleteGuestMessage: async (id: number) => {
    const res = await del<void>(`/guest-messages/${id}`);
    return res.data;
  },

  /** 新增留言（目前主要由前台使用，这里保留以备管理端扩展） */
  saveGuestMessage: async (params: Partial<GuestMessage>) => {
    const res = await post<GuestMessage>('/guest-messages', params);
    return res.data;
  },

  /** 修改留言状态（管理端） */
  updateGuestMessageStatus: async (id: number, status: GuestMessageStatus) => {
    const res = await put<void>(`/guest-messages/${id}/status`, { status });
    return res.data;
  },
};
