import { get, put } from '@/lib/request';

import type { SiteConfig } from '~/types/siteConfig';

export const siteConfigService = {
  get: () => get<SiteConfig>('/site-config'),
  save: (dto: SiteConfig) => put<SiteConfig>('/site-config', dto),
};
