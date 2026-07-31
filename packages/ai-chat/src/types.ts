// === Message ===

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool';

export type ToolStatus = 'running' | 'completed' | 'failed';

export type ChatStatus = 'idle' | 'streaming' | 'confirming' | 'error';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: ToolStatus;
}

export interface ConfirmRequest {
  tool: string;
  args: Record<string, unknown>;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  toolCalls?: ToolCall[];
  confirm?: ConfirmRequest;
  createdAt: string;
}

// === Backend conversation Types ===

export interface ConversationMessage {
  role: ChatRole;
  content: string;
  toolCalls?: { name: string; args: Record<string, unknown>; id: string }[];
  toolResult?: { name: string; result: unknown };
  createdAt: string;
}

export interface Conversation {
  id: number;
  title: string;
  lastMessagePreview: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail {
  id: number;
  title: string;
  userId: number;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

// === SSE Callbacks ===

export interface SseCallbacks {
  onToken: (content: string) => void;
  onToolCall: (tool: string, args: Record<string, unknown>) => void;
  onToolResult: (tool: string, result: unknown) => void;
  onConfirm: (tool: string, args: Record<string, unknown>, message: string) => void;
  onDone: (threadId?: string) => void;
  onError: (message: string) => void;
}

// === Chat Request ===

export interface ChatRequest {
  message: string;
  conversationId?: string;
  temporary?: boolean;
}

// === Api Client ===

export interface AiChatApi {
  chatStream(req: ChatRequest, callbacks: SseCallbacks): { abort: () => void };
  confirmStream(
    conversationId: number,
    confirm: boolean,
    callbacks: SseCallbacks
  ): { abort: () => void };
  getConversations(
    page?: number,
    limit?: number
  ): Promise<{ items: Conversation[]; meta: { total: number } }>;
  getConversation(id: number): Promise<ConversationDetail>;
  deleteConversation(id: number): Promise<void>;
}
