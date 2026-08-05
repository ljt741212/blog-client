import { DeleteOutlined } from '@ant-design/icons';

import type { Conversation } from './types';

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface AiChatConversationListProps {
  open: boolean;
  conversations: Conversation[];
  activeId: string | null;
  onClose: () => void;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function AiChatConversationList({
  open,
  conversations,
  activeId,
  onClose,
  onSelect,
  onDelete,
}: AiChatConversationListProps) {
  if (!open) return null;

  return (
    <>
      <div className="absolute inset-0 z-10" onClick={onClose} />

      <div className="absolute left-0 right-0 top-[49px] z-20 flex flex-col rounded-b-lg bg-[#152240] max-h-[calc(100%_-_49px)]">
        <div className="h-px shrink-0 bg-gradient-to-r from-[#4d94ff] to-[#5eead4]" />

        <div className="flex items-center px-4 py-3 shrink-0 border-b border-[#1e3050]">
          <span className="text-sm font-medium text-[#e2e8f0]">会话记录</span>
        </div>

        <div className="overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-sm text-[#94a3b8] text-center py-8">暂无会话记录</p>
          )}
          {conversations.map(c => {
            const isActive = activeId === String(c.id);
            return (
              <div
                key={c.id}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-[#1e3050] transition-colors ${isActive ? 'bg-[#223860]' : 'bg-transparent hover:bg-[#1c3055]'}`}
                onClick={() => onSelect(c.id)}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm text-[#e2e8f0] truncate">{c.title || '新对话'}</p>
                  <p className="text-xs text-[#94a3b8] truncate mt-0.5">
                    {c.lastMessagePreview || fmtDate(c.updatedAt)}
                  </p>
                </div>
                <DeleteOutlined
                  className="text-[#94a3b8] hover:text-[#f97066] transition-colors shrink-0"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(c.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
