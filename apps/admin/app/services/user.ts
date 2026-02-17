import { get, post, put } from '@/lib/request';
import type { PaginationResponse } from '@/types';
import type { LoginForm, LoginResponse, User, UserPageQueryDto, ChangePasswordForm } from '~/types/user';

export const userService = {
  login: (data: LoginForm) => {
    return post<LoginResponse>('/users/login', data);
  },
  getUserList: (params: UserPageQueryDto) => {
    return get<PaginationResponse<User>>('/users/page', { params });
  },
  deleteUser: (id: string) => {
    return post<void>(`/users/${id}/delete`);
  },
  saveUser: (user: User) => {
    return post<User>('/users', user);
  },
  // getUserDetail: (id: string) => {
  //   return get<User>(`/users/${id}`);
  // },
  updateUser: (id: string, payload: User) => {
    return put<User>(`/users/${id}`, payload);
  },
  getCurrentUser: () => {
    return get<User>('/users/me');
  },
  changePassword: (data: ChangePasswordForm) => {
    return put<void>('/users/change-password', data);
  },
};
