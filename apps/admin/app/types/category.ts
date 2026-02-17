import type { PaginationParams } from '@/types/index';

export enum CategoryStatusEnum {
  DISABLED = 0,
  ENABLED = 1,
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  status?: CategoryStatusEnum;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPageQueryDto extends PaginationParams {
  searchValue?: string;
  status?: CategoryStatusEnum;
}
