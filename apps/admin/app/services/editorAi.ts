import { fetchEventSource } from '@microsoft/fetch-event-source';

import { get } from '@/lib/request';
import { getCookie } from '@/utils';

import type { EditorState, EditorConversation } from '~/types/editorAi';

interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (content: string) => void;
  onError: (message: string) => void;
}

function authHeaders(): Record<string, string> {
  const token = getCookie('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function parseSseEvent(event: { data: string }, callbacks: StreamCallbacks) {
  try {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'token':
        callbacks.onToken(data.content);
        break;
      case 'done':
        callbacks.onDone('');
        break;
      case 'error':
        callbacks.onError(data.message);
        break;
    }
  } catch {
    callbacks.onError('SSE 数据解析失败');
  }
}

export const editorAiService = {
  chatStream(
    message: string,
    editorState: EditorState,
    conversationId: number | null,
    callbacks: StreamCallbacks
  ): { abort: () => void } {
    const controller = new AbortController();
    let content = '';

    fetchEventSource('/api/ai/article-editor/chat', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ message, editorState, ...(conversationId ? { conversationId } : {}) }),
      signal: controller.signal,
      onmessage(event) {
        parseSseEvent(event, {
          onToken(token) {
            content += token;
            callbacks.onToken(token);
          },
          onDone() {
            callbacks.onDone(content);
          },
          onError(msg) {
            callbacks.onError(msg);
          },
        });
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

  confirmStream(
    conversationId: number,
    confirm: boolean,
    callbacks: StreamCallbacks
  ): { abort: () => void } {
    const controller = new AbortController();
    let content = '';

    fetchEventSource(`/api/ai/article-editor/chat/${conversationId}/confirm`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ confirm }),
      signal: controller.signal,
      onmessage(event) {
        parseSseEvent(event, {
          onToken(token) {
            content += token;
            callbacks.onToken(token);
          },
          onDone() {
            callbacks.onDone(content);
          },
          onError(msg) {
            callbacks.onError(msg);
          },
        });
      },
      onerror(err) {
        callbacks.onError(err.message || '连接失败');
        throw err;
      },
    }).catch(() => {});

    return { abort: () => controller.abort() };
  },

  getConversations(page = 1, limit = 20) {
    return get<{ items: EditorConversation[]; meta: { total: number } }>(
      `/ai/article-editor/conversations?page=${page}&limit=${limit}`
    );
  },
};
