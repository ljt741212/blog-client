import { DeleteOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';

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
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="会话记录"
      width={320}
      styles={{
        header: {
          background: '#0f0a1a',
          color: '#e8e0f0',
          borderBottom: '1px solid #2d2050',
        },
        body: { background: '#0f0a1a', padding: 0 },
      }}
      closable
    >
      {conversations.length === 0 && (
        <p className="text-sm text-[#8a7ca0] text-center py-8">暂无会话记录</p>
      )}
      {conversations.map(c => (
        <div
          key={c.id}
          className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-[#2d2050] transition-colors hover:bg-[#1a1333] ${
            activeId === String(c.id) ? 'bg-[#1a1333]' : ''
          }`}
          onClick={() => onSelect(c.id)}
        >
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-sm text-[#e8e0f0] truncate">{c.title || '新对话'}</p>
            <p className="text-xs text-[#8a7ca0] truncate mt-0.5">
              {c.lastMessagePreview || fmtDate(c.updatedAt)}
            </p>
          </div>
          <DeleteOutlined
            className="text-[#8a7ca0] hover:text-[#f85149] transition-colors shrink-0"
            onClick={e => {
              e.stopPropagation();
              onDelete(c.id);
            }}
          />
        </div>
      ))}
    </Drawer>
  );
}
