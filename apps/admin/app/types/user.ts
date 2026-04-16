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

/** 与后端用户接口一致：JSON 小驼峰 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRoleEnum;
  status: UserStatusEnum;
  bio?: string;
  github?: string;
  nickname?: string;
  wechat?: string;
  phone?: string;
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
