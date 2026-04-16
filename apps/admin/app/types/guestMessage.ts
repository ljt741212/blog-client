import type { PaginationParams } from '@/types';

export type GuestMessageStatus = 'pending' | 'approved' | 'rejected';

export enum GuestMessageStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface GuestMessage {
  id: number;
  content: string;
  status: GuestMessageStatus;
  nickname?: string | null;
  email?: string | null;
  userId?: number | null;
  visitorId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuestMessageAdminPageQueryDto extends PaginationParams {
  status?: GuestMessageStatus;
  searchValue?: string;
}
