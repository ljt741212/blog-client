import { get } from '@/lib/request';
import type { Visitor } from '~/types/visitor';

export const visitorService = {
  getVisitorList: () => {
    return get<Visitor[]>('/visitor');
  },
};
