import request, { get, post, del } from '@/lib/request';

import type { AiConfig, UsageQuery, UsageResponse } from '~/types/ai';

export const aiService = {
  getConfigs: () => get<AiConfig[]>('/ai/configs'),

  saveConfig: (data: Partial<AiConfig>) => post<AiConfig>('/ai/configs/save', data),

  deleteConfig: (id: number) => del(`/ai/configs/${id}`),

  activateConfig: (id: number) => request(`/ai/configs/${id}/activate`, { method: 'PATCH' }),

  getUsage: (params?: UsageQuery) => get<UsageResponse>('/ai/usage', { params }),
};
