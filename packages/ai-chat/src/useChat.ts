import { useState, useCallback, useRef } from 'react';

import type { AiChatApi, ChatMessage, ChatStatus, ConfirmRequest } from './types';

function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function newMsg(role: ChatMessage['role'], content = ''): ChatMessage {
  return { id: genId(), role, content, createdAt: new Date().toISOString() };
}

interface UseChatOptions {
  api: AiChatApi;
}

interface UseChatReturn {
  messages: ChatMessage[];
  status: ChatStatus;
  conversationId: string | null;
  error: string | null;
  send: (message: string) => Promise<void>;
  confirm: (approved: boolean) => Promise<void>;
  clear: () => void;
  loadHistory: (id: number) => Promise<void>;
}

export function useChat({ api }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<(() => void) | null>(null);
  const confirmReqRef = useRef<ConfirmRequest | null>(null);

  const updateLastAssistant = useCallback((fn: (msg: ChatMessage) => ChatMessage) => {
    setMessages(prev => {
      const idx = prev.length - 1;
      if (idx < 0 || prev[idx].role !== 'assistant') return prev;
      const updated = [...prev];
      updated[idx] = fn(updated[idx]);
      return updated;
    });
  }, []);

  const sseCallbacks = useCallback(
    () => ({
      onToken: (content: string) => {
        updateLastAssistant(msg => ({ ...msg, content: msg.content + content }));
      },
      onToolCall: (tool: string, args: Record<string, unknown>) => {
        updateLastAssistant(msg => ({
          ...msg,
          toolCalls: [
            ...(msg.toolCalls || []),
            { id: genId(), name: tool, args, status: 'running' as const },
          ],
        }));
      },
      onToolResult: (tool: string, result: unknown) => {
        updateLastAssistant(msg => {
          if (!msg.toolCalls) return msg;
          const tcs = [...msg.toolCalls];
          for (let i = tcs.length - 1; i >= 0; i--) {
            if (tcs[i].name === tool && tcs[i].status === 'running') {
              tcs[i] = { ...tcs[i], result, status: 'completed' };
              break;
            }
          }
          return { ...msg, toolCalls: tcs };
        });
      },
      onConfirm: (tool: string, args: Record<string, unknown>, message: string) => {
        confirmReqRef.current = { tool, args, message };
        setStatus('confirming');
      },
      onDone: (threadId?: string) => {
        if (threadId) setConversationId(threadId);
        setStatus('idle');
      },
      onError: (msg: string) => {
        setError(msg);
        setStatus('error');
      },
    }),
    [updateLastAssistant]
  );

  const send = useCallback(
    async (message: string) => {
      abortRef.current?.();
      setError(null);
      setStatus('streaming');
      setMessages(prev => [...prev, newMsg('user', message), newMsg('assistant')]);
      const { abort } = api.chatStream(
        { message, conversationId: conversationId || undefined },
        sseCallbacks()
      );
      abortRef.current = abort;
    },
    [api, conversationId, sseCallbacks]
  );

  const confirm = useCallback(
    async (approved: boolean) => {
      if (!conversationId || !confirmReqRef.current) return;
      const cid = Number(conversationId);
      confirmReqRef.current = null;
      if (!approved) {
        setStatus('idle');
        return;
      }
      setStatus('streaming');
      setMessages(prev => [...prev, newMsg('assistant')]);
      const { abort } = api.confirmStream(cid, approved, sseCallbacks());
      abortRef.current = abort;
    },
    [api, conversationId, sseCallbacks]
  );

  const clear = useCallback(() => {
    abortRef.current?.();
    setMessages([]);
    setConversationId(null);
    setStatus('idle');
    setError(null);
    confirmReqRef.current = null;
  }, []);

  const loadHistory = useCallback(
    async (id: number) => {
      abortRef.current?.();
      setError(null);
      setStatus('idle');

      const conv = await api.getConversation(id);
      const history: ChatMessage[] = (conv.messages || []).map(m => ({
        id: genId(),
        role: m.role,
        content: m.content ?? '',
        toolCalls: m.toolCalls?.map(tc => ({
          id: tc.id || genId(),
          name: tc.name,
          args: tc.args,
          status: 'completed' as const,
        })),
        createdAt: m.createdAt,
      }));

      setMessages(history);
      setConversationId(String(id));
      confirmReqRef.current = null;
    },
    [api]
  );

  return { messages, status, conversationId, error, send, confirm, clear, loadHistory };
}
