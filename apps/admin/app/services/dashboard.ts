import { get } from '@/lib/request';
import type { DashboardStats } from '~/types/dashboard';

export const dashboardService = {
  getDashboardStats: () => {
    return get<DashboardStats>('/visitor/dashboard');
  },
};
