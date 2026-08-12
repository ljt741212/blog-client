import { useState, useCallback } from 'react';

import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Typography, Input, message } from 'antd';

import { editorAiService } from '@/services/editorAi';

import type { Category } from '~/types/category';
import type { FillAction, AgentResponse, EditorState } from '~/types/editorAi';
import type { Tag } from '~/types/tag';

import type { FormInstance } from 'antd';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  fills: FillAction[];
  isStreaming: boolean;
}

interface Props {
  form: FormInstance;
  categories: Category[];
  tags: Tag[];
}

let idCounter = 0;
const nextId = () => `${++idCounter}`;

function buildEditorState(form: FormInstance, categories: Category[], tags: Tag[]): EditorState {
  const categoryId: number | undefined = form.getFieldValue('categoryId');
  const tagIds: string[] = form.getFieldValue('tagIds') ?? [];

  return {
    title: form.getFieldValue('title'),
    content: form.getFieldValue('content'),
    summary: form.getFieldValue('summary'),
    categoryName: categories.find(c => c.id === categoryId)?.name,
    tagNames: tagIds
      .map((id: string) => tags.find(t => t.id === id)?.name)
      .filter(Boolean) as string[],
    coverImage: form.getFieldValue('coverImage'),
  };
}

function parseAgentResponse(raw: string): { content: string; fills: FillAction[] } {
  try {
    const trimmed = raw.trim();
    // Try to parse the entire response as JSON
    const parsed: AgentResponse = JSON.parse(trimmed);
    if (parsed.message && Array.isArray(parsed.fills)) {
      return { content: parsed.message, fills: parsed.fills };
    }
  } catch {
    // Try to extract JSON from markdown code blocks
    const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) {
      try {
        const parsed: AgentResponse = JSON.parse(codeBlock[1].trim());
        if (parsed.message && Array.isArray(parsed.fills)) {
          return { content: parsed.message, fills: parsed.fills };
        }
      } catch {
        // fall through
      }
    }
  }
  return { content: raw, fills: [] };
}

export default function EditorAiPanel({ form, categories, tags }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const applyFill = useCallback(
    (fill: FillAction) => {
      if (fill.field === 'categoryName') {
        const name = Array.isArray(fill.value) ? fill.value[0] : String(fill.value);
        const cat = categories.find(c => c.name === name);
        if (cat) form.setFieldValue('categoryId', cat.id);
      } else if (fill.field === 'tagNames') {
        const names: string[] = Array.isArray(fill.value)
          ? (fill.value as string[])
          : [String(fill.value)];
        const ids = names.map(n => tags.find(t => t.name === n)?.id).filter(Boolean) as string[];
        form.setFieldValue('tagIds', ids);
      } else {
        form.setFieldValue(fill.field, fill.value);
      }
    },
    [form, categories, tags]
  );

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);

    const userMsg: Message = {
      id: nextId(),
      role: 'user',
      content: text,
      fills: [],
      isStreaming: false,
    };
    const assistantMsg: Message = {
      id: nextId(),
      role: 'assistant',
      content: '',
      fills: [],
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);

    const editorState = buildEditorState(form, categories, tags);

    editorAiService.chatStream(text, editorState, conversationId, {
      onToken(token) {
        setMessages(prev =>
          prev.map(m => (m.id === assistantMsg.id ? { ...m, content: m.content + token } : m))
        );
      },
      onDone(content) {
        const { content: displayContent, fills } = parseAgentResponse(content);

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id
              ? { ...m, content: displayContent || content, fills, isStreaming: false }
              : m
          )
        );

        setSending(false);

        // Track conversationId: fetch and pick the latest after first message
        if (!conversationId) {
          editorAiService
            .getConversations(1, 1)
            .then(res => {
              const first = res.data?.items?.[0];
              if (first) setConversationId(first.id);
            })
            .catch(() => {});
        }
      },
      onError(msg) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: msg, fills: [], isStreaming: false } : m
          )
        );
        setSending(false);
        message.error(msg);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isStreaming = messages.some(m => m.isStreaming);

  return (
    <div className="flex flex-col h-full pb-3">
      <div className="flex-1 overflow-y-auto mb-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <Typography.Text type="secondary" className="text-sm">
            输入你想对文章做什么，比如"帮我润色这篇文章"、"给这篇文章起几个标题"、"推荐标签和分类"
          </Typography.Text>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user' ? 'bg-[#e5edff] text-[#1e293b]' : 'bg-[#f3f4f6] text-[#1e293b]'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
                {msg.isStreaming && (
                  <LoadingOutlined className="ml-1 text-[#2563eb] animate-spin" />
                )}
              </div>

              {!msg.isStreaming && msg.fills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#e5e7eb]">
                  {msg.fills.map((fill, i) => (
                    <Button
                      key={i}
                      size="small"
                      type="primary"
                      ghost
                      onClick={() => applyFill(fill)}
                    >
                      填入{fillLabel(fill.field)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input.TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入指令..."
          rows={2}
          disabled={isStreaming}
          className="text-sm"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={sending}
          disabled={!input.trim() || isStreaming}
        />
      </div>
    </div>
  );
}

function fillLabel(field: FillAction['field']): string {
  const map: Record<FillAction['field'], string> = {
    title: '标题',
    content: '内容',
    summary: '摘要',
    categoryName: '分类',
    tagNames: '标签',
  };
  return map[field] ?? field;
}
