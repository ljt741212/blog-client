import type { PaginationParams } from '@/types';

export type UpdateLogType = 'feature' | 'improvement' | 'bugfix' | 'security';

export interface UpdateLog {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  type: UpdateLogType;
  content: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateLogPageQueryDto extends PaginationParams {
  searchValue?: string;
  type?: UpdateLogType | 'all';
}
