export interface Visitor {
  id: number;
  visitorId: string | null;
  ip: string;
  location: string | null;
  userAgent: string | null;
  lastActiveAt: string;
}

export interface VisitorPageParams {
  current?: number;
  pageSize?: number;
  ip?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
}
