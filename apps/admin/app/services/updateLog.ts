import { get, post, del } from '@/lib/request';
import type { PaginationResponse } from '@/types';

import type { UpdateLog, UpdateLogPageQueryDto } from '~/types/updateLog';

export const updateLogService = {
  getUpdateLogList: (params: UpdateLogPageQueryDto) =>
    get<PaginationResponse<UpdateLog>>('/changelogs/page', { params }),
  getUpdateLogAll: () => get<UpdateLog[]>('/changelogs'),
  deleteUpdateLog: (id: string) => del<void>(`/changelogs/${id}`),
  updateUpdateLogStatus: (id: string, isPublished: boolean) =>
    post<void>(`/changelogs/${id}/status`, { isPublished }),
};
