import { setupLifecycleListeners } from './lifecycle';
import { send } from './sender';
import { state } from './state';
import { buildBasePayload, isBrowser, logDebug } from './utils';

import type { BehaviorMonitorConfig, TrackPayload } from './types';

export type { BehaviorMonitorConfig, TrackPayload } from './types';

export const behaviorMonitor = {
  /**
   * 初始化埋点 SDK（需要在浏览器端调用一次）
   */
  init(config: BehaviorMonitorConfig) {
    if (state.initialized) {
      state.config = { ...state.config, ...config };
      logDebug('behaviorMonitor 已经初始化，更新配置', state.config);
      return;
    }

    state.config = config;
    state.initialized = true;

    if (!isBrowser()) {
      logDebug('当前不是浏览器环境，仅记录配置，不注册监听');
      return;
    }

    setupLifecycleListeners();
    logDebug('behaviorMonitor 初始化完成', config);
  },

  /**
   * 手动上报自定义事件
   */
  track(event: string, extra: object = {}) {
    const payload: TrackPayload = {
      ...buildBasePayload(event),
      extra,
    };

    void send(payload);
  },

  /**
   * 获取当前会话已停留的毫秒数（仅前端使用，不会上报）
   */
  getCurrentStayTime(): number {
    if (!state.sessionStartTime) return 0;
    return Date.now() - state.sessionStartTime;
  },
};
