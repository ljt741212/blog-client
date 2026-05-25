/** 新增访客留言（前台 POST /guest-messages） */
export interface CreateGuestMessageDto {
  /** 留言内容（必填，最长 5000 字符） */
  content: string;

  /** 昵称（可选，最长 50 字符） */
  nickname?: string;

  /** 邮箱（可选，最长 100 字符） */
  email?: string;

  /** 用户 ID（登录用户留言时传） */
  userId?: number;

  /** 访客 ID（游客留言时传，数字 DB 记录 ID） */
  visitorId?: number;

  /** 访客 UUID（游客留言时传，behaviorMonitor 生成的 UUID） */
  visitorUuid?: string | null;
}

export interface GuestMessage {
  id: number;
  nickname?: string;
  email?: string;
  content: string;
  createdAt: string;
}
