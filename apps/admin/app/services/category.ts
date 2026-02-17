import { get, post, del, put } from '@/lib/request';
import type { Category, CategoryPageQueryDto } from '~/types/category';
import type { PaginationResponse } from '@/types/index';

export const categoryService = {
  getCategoryList: (params: CategoryPageQueryDto) =>
    get<PaginationResponse<Category>>('/categories/page', { params }),
  getCategoryById: (id: string) => get<Category>(`/categories/${id}`),
  getCategoryAll: () => get<Category[]>('/categories'),
  saveCategory: (category: Category) => post('/categories', category),
  deleteCategory: (id: string) => del(`/categories/${id}`),
  updateCategoryStatus: (id: string, status: number) => put(`/categories/${id}/status`, { status }),
};
