import type { PaginationParams } from '@/types/index';

export enum TagStatusEnum {
  DISABLED = 0,
  ENABLED = 1,
}

export interface Tag {
  id: string;
  name: string;
  description?: string | null;
  status: TagStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface TagPageQueryDto extends PaginationParams {
  searchValue?: string;
  status?: TagStatusEnum;
}
