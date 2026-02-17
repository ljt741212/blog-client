import type { PaginationParams } from '@/types';

export enum UserRoleEnum {
  ADMIN = 0,
  SUPER_ADMIN = 1,
}

export enum UserStatusEnum {
  ENABLED = 1,
  DISABLED = 0,
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRoleEnum;
  status: UserStatusEnum;
  description?: string;
  github?: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserPageQueryDto extends PaginationParams {
  searchValue?: string;
  status?: UserStatusEnum;
  role?: UserRoleEnum;
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}