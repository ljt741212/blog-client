import { fetchEventSource, type FetchEventSourceInit } from '@microsoft/fetch-event-source';

import { get } from '@/lib/request';
import { getCookie } from '@/utils';

import type { PaginationResponse } from '~/types';
import type { Visitor, VisitorPageParams } from '~/types/visitor';

export const visitorService = {
  getVisitorPage: (params?: VisitorPageParams) => {
    return get<PaginationResponse<Visitor>>('/visitor/page', { params });
  },
  connectOnlineStream: (params: FetchEventSourceInit) => {
    const token = getCookie('token');
    return fetchEventSource('/api/visitor/online/stream', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...params,
    });
  },
};
