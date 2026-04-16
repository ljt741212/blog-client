import { fetchEventSource, type FetchEventSourceInit} from '@microsoft/fetch-event-source';

import { get } from '@/lib/request';
import { getCookie } from '@/utils';

import type { Visitor } from '~/types/visitor';


export const visitorService = {
  getVisitorList: () => {
    return get<Visitor[]>('/visitor');
  },
  getOnlineVisitors: (params: FetchEventSourceInit) => {
    const token = getCookie('token');
    return fetchEventSource('/api/visitor/online/stream', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/event-stream',
        'Authorization': `Bearer ${token}`,
      },
      ...params,
    });
  },
};
