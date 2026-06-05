export enum AiProvider {
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek',
  ANTHROPIC = 'anthropic',
}

export enum AiAction {
  CONTINUE_WRITE = 'continue_write',
  POLISH = 'polish',
  SUMMARY = 'summary',
  TITLE = 'title',
  CHAT = 'chat',
}

export interface AiConfig {
  id: number;
  name: string;
  provider: AiProvider;
  model: string;
  apiKey: string;
  baseUrl?: string | null;
  isActive: boolean;
  maxTokens: number;
  temperature: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  action?: AiAction;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AiUsage {
  id: number;
  configId: number;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  action: AiAction;
  createdAt: string;
}

export interface UsageStats {
  totalCalls: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
}

export interface UsageQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  model?: string;
}

export interface UsageResponse {
  list: AiUsage[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  stats: UsageStats;
}
