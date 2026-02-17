'use client';

import { useState, useEffect } from 'react';

import { Form, message } from 'antd';

import { MessageBoardList, MessageBoardForm } from '@/app/components/messageBoard';
import { createGuestMessage, getGuestMessageList } from '@/app/lib/api';
import { GuestMessage } from '@/app/types/guestMessage';

export default function MessageBoard() {
  const [form] = Form.useForm();
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  // const [loading, setLoading] = useState(false);

  const init = async () => {
    // setLoading(true);
    const data = await getGuestMessageList();
    setMessages(data ?? []);
  };
  useEffect(() => {
    init();
  }, []);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const item = {
      ...values,
      visitorId: '2',
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
      <div className="flex-1 flex gap-12 p-32 pt-18 bg-[var(--background)] max-w-full overflow-x-hidden">
        <MessageBoardList messages={messages} />
        <MessageBoardForm form={form} onSubmit={handleSubmit} onReset={handleReset} />
      </div>
    </div>
  );
}
