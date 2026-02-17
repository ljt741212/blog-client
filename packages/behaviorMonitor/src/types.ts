export interface BehaviorMonitorConfig {
  /**
   * 上报服务地址，例如：/api/track
   */
  endpoint: string;
  /**
   * 应用 ID，方便后端区分不同项目
   */
  appId?: string;
  /**
   * 是否在控制台打印调试日志
   */
  debug?: boolean;
}

export interface TrackPayload {
  event: string;
  timestamp: number;
  appId?: string;
  visitorId?: string;
  url?: string;
  referrer?: string;
  userAgent?: string;
  duration?: number;
  extra?: object;
}
