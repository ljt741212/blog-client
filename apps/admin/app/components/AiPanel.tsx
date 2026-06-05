import { useState } from 'react';

import {
  RobotOutlined,
  ThunderboltOutlined,
  LoadingOutlined,
  SendOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { Button, Input, Space, Typography, Empty, message, Spin } from 'antd';

import { aiService } from '@/services/ai';

import { AiAction } from '~/types/ai';

interface AiPanelProps {
  selectedText?: string;
  editorContent?: string;
  onInsert: (text: string) => void;
}

interface QuickAction {
  key: AiAction;
  label: string;
  icon: React.ReactNode;
  buildMessages: (ctx: {
    selectedText?: string;
    editorContent?: string;
  }) => { role: string; content: string }[];
}

const quickActions: QuickAction[] = [
  {
    key: AiAction.CONTINUE_WRITE,
    label: 'AI 续写',
    icon: '✏️',
    buildMessages: ({ selectedText, editorContent }) => [
      {
        role: 'system',
        content:
          '你是一个专业的博客写作助手。请续写下面的内容，保持风格一致，直接输出续写内容，不要加任何前缀说明。只输出续写的内容，不要重复已有内容。',
      },
      {
        role: 'user',
        content: `请续写以下内容：\n\n${selectedText || editorContent?.slice(-500) || ''}`,
      },
    ],
  },
  {
    key: AiAction.POLISH,
    label: 'AI 润色',
    icon: '✨',
    buildMessages: ({ selectedText }) => [
      {
        role: 'system',
        content:
          '你是一个专业的文字润色助手。请润色以下文字，使其更流畅自然、表达更精准。直接输出润色后的内容，不要加任何前缀说明。如果原文是中文则以中文回复，英文则以英文回复。',
      },
      {
        role: 'user',
        content: `请润色以下文字：\n\n${selectedText || '请先在编辑器中选中需要润色的文字'}`,
      },
    ],
  },
  {
    key: AiAction.SUMMARY,
    label: '生成摘要',
    icon: '📝',
    buildMessages: ({ editorContent }) => [
      {
        role: 'system',
        content:
          '你是一个专业的博客写作助手。请为以下文章生成一段简洁的摘要，150字以内。直接输出摘要内容，不要加任何前缀说明。',
      },
      {
        role: 'user',
        content: `请为以下文章生成摘要：\n\n${editorContent?.slice(0, 3000) || ''}`,
      },
    ],
  },
  {
    key: AiAction.TITLE,
    label: '标题建议',
    icon: '💡',
    buildMessages: ({ editorContent }) => [
      {
        role: 'system',
        content:
          '你是一个专业的博客写作助手。请根据文章内容生成5个吸引人的标题建议，每个标题一行。直接输出标题，不要加序号或前缀说明。',
      },
      {
        role: 'user',
        content: `请为以下文章生成标题建议：\n\n${editorContent?.slice(0, 3000) || ''}`,
      },
    ],
  },
];

export default function AiPanel({ selectedText, editorContent, onInsert }: AiPanelProps) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeAction, setActiveAction] = useState<AiAction | null>(null);

  const handleQuickAction = async (action: QuickAction) => {
    setLoading(true);
    setActiveAction(action.key);
    setResponse('');
    try {
      const messages = action.buildMessages({ selectedText, editorContent });
      const res = await aiService.chat({ messages, action: action.key });
      setResponse(res?.data?.content ?? '');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomChat = async () => {
    if (!customPrompt.trim()) return;
    setLoading(true);
    setActiveAction(null);
    setResponse('');
    try {
      const context = selectedText || editorContent?.slice(0, 3000) || '';
      const res = await aiService.chat({
        messages: [
          {
            role: 'system',
            content:
              '你是一个专业的博客写作助手。请根据用户的问题和上下文提供帮助。如果用户没有提供具体文章内容，请基于你的知识回答。',
          },
          ...(context ? [{ role: 'user' as const, content: `上下文：\n${context}` }] : []),
          { role: 'user', content: customPrompt },
        ],
        action: AiAction.CHAT,
      });
      setResponse(res?.data?.content ?? '');
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (!response) return;
    onInsert(response);
    setResponse('');
  };

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      message.success('已复制到剪贴板');
    } catch {
      message.error('复制失败');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <RobotOutlined className="text-lg" />
        <Typography.Text strong>AI 助手</Typography.Text>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map(action => (
          <Button
            key={action.key}
            size="small"
            onClick={() => handleQuickAction(action)}
            loading={loading && activeAction === action.key}
          >
            {action.icon} {action.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input.TextArea
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
          placeholder="自定义指令..."
          rows={2}
          onPressEnter={e => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleCustomChat();
            }
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleCustomChat}
          loading={loading && activeAction === null}
          className="self-end"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Spin indicator={<LoadingOutlined spin />} />
          <Typography.Text type="secondary" className="ml-3">
            AI 正在生成...
          </Typography.Text>
        </div>
      )}

      {!loading && response && (
        <div className="border border-[#e5e7eb] rounded-lg p-3">
          <Typography.Paragraph
            className="whitespace-pre-wrap text-sm mb-3"
            style={{ marginBottom: 12 }}
          >
            {response}
          </Typography.Paragraph>
          <Space>
            <Button
              size="small"
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={handleInsert}
            >
              插入到文章
            </Button>
            <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>
              复制
            </Button>
          </Space>
        </div>
      )}

      {!loading && !response && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="选中文字使用快捷操作，或输入自定义指令"
          styles={{ image: { height: 48 } }}
        />
      )}
    </div>
  );
}
