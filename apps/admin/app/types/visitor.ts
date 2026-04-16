export interface Visitor {
  id: number;
  ip: string;
  userAgent: string;
  referer: string;
  visitedAt: Date;
}
