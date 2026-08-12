export interface EditorState {
  title?: string;
  content?: string;
  summary?: string;
  categoryName?: string;
  tagNames?: string[];
  coverImage?: string;
}

export interface FillAction {
  field: 'title' | 'content' | 'summary' | 'categoryName' | 'tagNames';
  value: string | string[];
}

export interface AgentResponse {
  message: string;
  fills: FillAction[];
}

export interface EditorConversation {
  id: number;
  title: string;
  lastMessagePreview: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorConversationDetail {
  id: number;
  title: string;
  userId: number;
  messages: {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
