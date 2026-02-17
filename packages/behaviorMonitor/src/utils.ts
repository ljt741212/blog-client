import { state, VISITOR_ID_KEY } from './state';

import type { TrackPayload } from './types';

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function logDebug(...args: []) {
  if (!state.config?.debug) return;
  // eslint-disable-next-line no-console
  console.log('[behaviorMonitor]', ...args);
}

function createVisitorId(): string {
  return `bm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getOrCreateVisitorId(): string | undefined {
  if (!isBrowser()) return undefined;

  if (state.visitorId) return state.visitorId;

  try {
    const stored = window.localStorage.getItem(VISITOR_ID_KEY);
    if (stored) {
      state.visitorId = stored;
      return stored;
    }

    const id = createVisitorId();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    state.visitorId = id;
    return id;
  } catch {
    // localStorage 不可用时降级：仅本次会话内使用
    const id = createVisitorId();
    state.visitorId = id;
    return id;
  }
}

export function buildBasePayload(event: string): TrackPayload {
  const timestamp = Date.now();
  const visitorId = getOrCreateVisitorId();
  const base: TrackPayload = {
    event,
    timestamp,
    appId: state.config?.appId,
    visitorId,
  };

  if (!isBrowser()) return base;

  return {
    ...base,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: window.navigator.userAgent,
  };
}
