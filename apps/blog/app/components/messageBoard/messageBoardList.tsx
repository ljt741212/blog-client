import { Card, Empty } from 'antd';
import dayjs from 'dayjs';

import { GuestMessage } from '@/types/guestMessage';

export type MessageBoardListProps = {
  messages: GuestMessage[];
};

export function MessageBoardList({ messages }: MessageBoardListProps) {
  console.log(messages);
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">留言板</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          有任何想说的、建议或是吐槽，都可以在这里留下。支持匿名留言。
        </p>
      </div>

      <Card
        title={`留言列表（${messages.length} 条）`}
        variant="borderless"
        className="rounded-2xl bg-[var(--background-secondary)]"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {messages.length === 0 ? (
          <Empty description="还没有留言，快来抢沙发吧～" />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-2 flex flex-col gap-4">
            {messages.map(item => (
              <div
                key={item.id}
                className="border-b border-[var(--border-primary)]/40 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500">
                    {item.nickname || '匿名访客'} {item.email || '未留邮箱'} ·{' '}
                    {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{item.content}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
