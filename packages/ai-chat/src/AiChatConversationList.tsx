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

      <div
        className="absolute z-20 flex flex-col rounded-b-lg"
        style={{
          left: 0,
          right: 0,
          top: 49,
          maxHeight: 'calc(100% - 49px)',
          backgroundColor: '#152240',
        }}
      >
        <div
          style={{
            height: 1,
            flexShrink: 0,
            background: 'linear-gradient(to right, #4d94ff, #5eead4)',
          }}
        />

        <div
          className="flex items-center px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid #1e3050' }}
        >
          <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
            会话记录
          </span>
        </div>

        <div className="overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: '#94a3b8' }}>
              暂无会话记录
            </p>
          )}
          {conversations.map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: '1px solid #1e3050',
                backgroundColor: activeId === String(c.id) ? '#223860' : 'transparent',
              }}
              onMouseEnter={e => {
                if (activeId !== String(c.id))
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#1c3055';
              }}
              onMouseLeave={e => {
                if (activeId !== String(c.id))
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
              onClick={() => onSelect(c.id)}
            >
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm truncate" style={{ color: '#e2e8f0' }}>
                  {c.title || '新对话'}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: '#94a3b8' }}>
                  {c.lastMessagePreview || fmtDate(c.updatedAt)}
                </p>
              </div>
              <DeleteOutlined
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#f97066';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                }}
                onClick={e => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
