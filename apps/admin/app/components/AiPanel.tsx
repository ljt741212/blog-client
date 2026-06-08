import { useState } from 'react';

import { RobotOutlined, LoadingOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Typography, Empty, message, Spin } from 'antd';

import { aiService } from '@/services/ai';

import { AiAction } from '~/types/ai';

interface AiPanelProps {
  selectedText?: string;
  editorContent?: string;
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
          '你是一位工作十年的全栈工程师，平时写技术博客分享经验。读一读下面的内容，顺着思路自然地往下写，保持同样的技术深度和语气风格。别重复已有的内容，别加"以下是续写"之类的废话。',
      },
      {
        role: 'user',
        content: `接着往下写：\n\n${selectedText || editorContent?.slice(-500) || ''}`,
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
          '你是一位工作十年的全栈工程师，文字功底扎实，写出来的东西清楚、准确、不啰嗦。把下面的内容润色一下，让表达更清晰流畅，改掉拗口或绕来绕去的句子。别改变原意和技术细节，原文什么语言就用什么语言输出。',
      },
      {
        role: 'user',
        content: `润色一下这段：\n\n${selectedText || '请先在编辑器中选中需要润色的文字'}`,
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
          '你是一位工作十年的全栈工程师。读完下面的技术文章，用不超过180字概括它讲了一件什么事、解决什么问题、核心结论是什么。让人扫一眼就判断值不值得往下读。注意：必须180字以内。直接输出摘要，别加开场白。',
      },
      {
        role: 'user',
        content: `给这篇文章写个摘要：\n\n${editorContent?.slice(0, 3000) || ''}`,
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
          '你是一位工作十年的全栈工程师，经常给技术博客起标题。读完文章后给5个标题建议，每个一行。标题要准确反映内容，简洁有力，别标题党。风格可以多样：直接点出技术点的、一句话说清楚干了什么的、稍微轻松一点的。',
      },
      {
        role: 'user',
        content: `帮这篇文章起几个标题：\n\n${editorContent?.slice(0, 3000) || ''}`,
      },
    ],
  },
  {
    key: AiAction.ARTICLE_ADVICE,
    label: '文章建议',
    icon: '💬',
    buildMessages: ({ editorContent }) => [
      {
        role: 'system',
        content:
          '你是一位工作十年的全栈工程师，经常 review 同事的技术博客。读完文章后给3-4条具体的改进建议。角度可以包括：技术点有没有讲清楚、逻辑链路有没有断、有没有关键细节被一笔带过、代码或示例是否够直观。语气像同事间的点评，诚恳直接，每条一两句话。',
      },
      {
        role: 'user',
        content: `帮我 review 一下这篇文章：\n\n${editorContent?.slice(0, 5000) || ''}`,
      },
    ],
  },
];

export default function AiPanel({ selectedText, editorContent }: AiPanelProps) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
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
          <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>
            复制
          </Button>
        </div>
      )}

      {!loading && !response && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="点击上方按钮，让 AI 帮你打磨文章"
          styles={{ image: { height: 48 } }}
        />
      )}
    </div>
  );
}
