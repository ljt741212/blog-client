'use client';

import { useState, useEffect } from 'react';

import { Form, message } from 'antd';

import { MessageBoardList, MessageBoardForm } from '@/components/messageBoard';
import { createGuestMessage, getGuestMessageList } from '@/lib/api';
import { GuestMessage } from '@/types/guestMessage';

export default function MessageBoard() {
  const [form] = Form.useForm();
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  // const [loading, setLoading] = useState(false);

  const init = async () => {
    const messages = await getGuestMessageList();
    setMessages(messages ?? []);
  };
  useEffect(() => {
    init();
  }, []);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const item = {
      ...values,
      visitorUuid: localStorage.getItem('behaviorMonitor_visitor_id'),
    };
    await createGuestMessage(item);
    message.success('留言提交成功');
    form.resetFields();
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="flex flex-col max-h-screen">
      <div className="flex-1 flex gap-12 p-32 pt-18 bg-[var(--page-bg)] max-w-full overflow-x-hidden">
        <MessageBoardList messages={messages} />
        <MessageBoardForm form={form} onSubmit={handleSubmit} onReset={handleReset} />
      </div>
    </div>
  );
}
