import { state } from './state';
import { logDebug, isBrowser } from './utils';

import type { TrackPayload } from './types';

export async function send(payload: TrackPayload): Promise<void> {
  if (!state.config?.endpoint) {
    logDebug('未配置 endpoint，取消上报', payload);
    return;
  }

  if (!(isBrowser() && 'sendBeacon' in navigator)) {
    logDebug('当前环境不支持 navigator.sendBeacon，取消上报', payload);
    return;
  }

  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: 'application/json' });
  const ok = navigator.sendBeacon(state.config.endpoint, blob);
  logDebug('sendBeacon', ok, payload);
}
