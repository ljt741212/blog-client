import { get, put } from '@/lib/request';
import type { Setting } from '~/types/setting';

export const settingService = {
  getSetting: () => get<Setting>('/setting'),
  saveSetting: (setting: Setting) => put<Setting>('/setting', setting),
};
