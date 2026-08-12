export * from './ai';
export * from './editorAi';
export * from './friendLink';

export interface Meta {
  current: number;
  pageSize: number;
  total: number;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface PaginationResponse<T> {
  items: T[];
  meta: Meta;
}

export interface PaginationParams {
  current: number;
  pageSize: number;
}
