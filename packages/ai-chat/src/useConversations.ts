import { useState, useCallback } from 'react';

import type { AiChatApi, Conversation } from './types';

interface UseConversationsOptions {
  api: AiChatApi;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  loadList: () => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export function useConversations({ api }: UseConversationsOptions): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getConversations(1, 50);
      setConversations(data.items);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const remove = useCallback(
    async (id: number) => {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
    },
    [api]
  );

  return { conversations, loading, loadList, remove };
}
