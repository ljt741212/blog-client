import { send } from './sender';
import { state } from './state';
import { buildBasePayload, isBrowser } from './utils';

function sendPageView() {
  const payload = buildBasePayload('page_view');
  void send(payload);
}

function sendStayTime() {
  if (!state.sessionStartTime) return;

  const duration = Date.now() - state.sessionStartTime;
  const payload = {
    ...buildBasePayload('stay_time'),
    duration,
  };

  void send(payload);
}

export function handleSessionStart() {
  if (!isBrowser()) return;
  state.sessionStartTime = Date.now();
  // 记录一次访问（用于“多少人来过”统计，后端可按 visitorId 去重）
  sendPageView();
}

export function handleSessionEnd() {
  if (!isBrowser()) return;
  sendStayTime();
}

export function setupLifecycleListeners() {
  if (!isBrowser()) return;

  // 页面加载完成 / 初始化时作为会话开始
  handleSessionStart();

  // 页面关闭或刷新前
  window.addEventListener('beforeunload', handleSessionEnd);

  // 切到后台时也尝试记录一次（避免某些场景 beforeunload 不触发）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleSessionEnd();
    }
  });
}
