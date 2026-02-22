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

/** 与后端约定：用户相关接口入参/出参使用大驼峰 */
export interface User {
  Id: string;
  Name: string;
  Email: string;
  Avatar?: string;
  Role: UserRoleEnum;
  Status: UserStatusEnum;
  Description?: string;
  GitHub?: string;
  NikName?: string;
  WeChat?: string;
  Phone?: string;
  CreatedAt?: string;
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
