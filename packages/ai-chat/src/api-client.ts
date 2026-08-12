import { fetchEventSource } from '@microsoft/fetch-event-source';

import type { AiChatApi, ChatRequest, SseCallbacks } from './types';

function parseSseEvent(event: { data: string }, callbacks: SseCallbacks) {
  try {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'token':
        callbacks.onToken(data.content);
        break;
      case 'tool_call':
        callbacks.onToolCall(data.tool, data.args);
        break;
      case 'tool_result':
        callbacks.onToolResult(data.tool, data.result);
        break;
      case 'confirm':
        callbacks.onConfirm(data.tool, data.args, data.message);
        break;
      case 'done':
        callbacks.onDone(data.threadId);
        break;
      case 'error':
        callbacks.onError(data.message);
        break;
    }
  } catch {
    callbacks.onError('SSE 数据解析失败');
  }
}

export function createAiChatApi(baseUrl: string, getAuthHeader: () => string): AiChatApi {
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: getAuthHeader(),
  });

  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${url}`, {
      ...init,
      headers: { ...authHeaders(), ...init?.headers },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || res.statusText);
    }
    const json = await res.json();
    if (json.code !== 200) {
      throw new Error(json.msg || '请求失败');
    }
    return json.data as T;
  }

  return {
    chatStream(req: ChatRequest, callbacks: SseCallbacks) {
      const controller = new AbortController();
      fetchEventSource(`${baseUrl}/ai/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(req),
        signal: controller.signal,
        onmessage(event) {
          parseSseEvent(event, callbacks);
        },
        onerror(err) {
          callbacks.onError(err.message || '连接失败');
          throw err;
        },
      }).catch(() => {
        // handled by onerror callback
      });
      return { abort: () => controller.abort() };
    },

    confirmStream(conversationId: number, confirm: boolean, callbacks: SseCallbacks) {
      const controller = new AbortController();
      fetchEventSource(`${baseUrl}/ai/chat/${conversationId}/confirm`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ confirm }),
        signal: controller.signal,
        onmessage(event) {
          parseSseEvent(event, callbacks);
        },
        onerror(err) {
          callbacks.onError(err.message || '连接失败');
          throw err;
        },
      }).catch(() => {});
      return { abort: () => controller.abort() };
    },

    getConversations(page = 1, limit = 20) {
      return request(`/ai/conversations?page=${page}&limit=${limit}`);
    },

    getConversation(id: number) {
      return request(`/ai/conversations/${id}`);
    },

    deleteConversation(id: number) {
      return request(`/ai/conversations/${id}`, { method: 'DELETE' });
    },
  };
}
