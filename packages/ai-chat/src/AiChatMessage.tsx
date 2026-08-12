import { LoadingOutlined } from '@ant-design/icons';

import type { ChatMessage } from './types';

interface AiChatMessageProps {
  message: ChatMessage;
  streaming: boolean;
  onConfirm: (approved: boolean) => void;
}

function ToolIcon({ name }: { name: string }) {
  const icon = name.includes('delete')
    ? '🗑'
    : name.includes('create') || name.includes('write')
      ? '✍'
      : '📊';
  return <span className="mr-1">{icon}</span>;
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%] bg-[#4d94ff] text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm">
        {content}
      </div>
    </div>
  );
}

function AssistantBubble({
  message,
  streaming,
  onConfirm,
}: {
  message: ChatMessage;
  streaming: boolean;
  onConfirm: (approved: boolean) => void;
}) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4d94ff] to-[#5eead4] flex items-center justify-center text-white text-xs font-bold shrink-0">
        AI
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#e2e8f0] whitespace-pre-wrap leading-relaxed">
          {message.content}
          {streaming && <span className="animate-pulse">▌</span>}
        </div>

        {message.toolCalls?.map(tc => (
          <div key={tc.id} className="bg-[#15294d] rounded-lg px-3 py-2 mt-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <ToolIcon name={tc.name} />
              <span className="text-[#4d94ff]">{tc.name}</span>
            </div>
            <div className="text-[#7c8da5] mt-1">
              {tc.status === 'running' ? (
                <span>
                  <LoadingOutlined spin className="mr-1" />
                  运行中...
                </span>
              ) : tc.status === 'completed' ? (
                <span>✅ 已完成</span>
              ) : (
                <span>❌ 失败</span>
              )}
            </div>
          </div>
        ))}

        {message.confirm && (
          <div className="bg-[#15294d] border border-[#f97066]/30 rounded-xl p-4 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#f97066]">⚠</span>
              <span className="text-sm font-medium text-[#e2e8f0]">需要确认</span>
            </div>
            <p className="text-sm text-[#7c8da5] mb-4">{message.confirm.message}</p>
            <div className="flex justify-end gap-3">
              <button
                className="text-sm text-[#7c8da5] hover:text-[#e2e8f0] transition-colors"
                onClick={() => onConfirm(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-1.5 bg-[#f97066] text-white text-sm rounded-lg hover:bg-[#dc2626] transition-colors"
                onClick={() => onConfirm(true)}
              >
                确认执行
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiChatMessage({ message, streaming, onConfirm }: AiChatMessageProps) {
  if (message.role === 'user') {
    return <UserBubble content={message.content} />;
  }
  if (message.role === 'assistant') {
    return <AssistantBubble message={message} streaming={streaming} onConfirm={onConfirm} />;
  }
  return null;
}
