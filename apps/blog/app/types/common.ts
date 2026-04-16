export interface Meta {
  current: number;
  pageSize: number;
  total: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationResponse<T> {
  items: T[];
  meta: Meta;
}

export interface PaginationParams {
  current: number;
  pageSize: number;
}
