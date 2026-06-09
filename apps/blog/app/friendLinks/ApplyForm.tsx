'use client';

import { useState } from 'react';

import { Form, Input, Button, message } from 'antd';

import { applyFriendLink } from '@/lib/api';
import type { ApplyFriendLinkDto } from '@/types';

export default function ApplyForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ApplyFriendLinkDto) => {
    setLoading(true);
    await applyFriendLink(values).finally(() => setLoading(false));
    form.resetFields();
    message.success('申请已提交，审核通过后将展示在友链列表中');
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">申请友链</h3>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="站点名称"
          rules={[{ required: true, message: '请输入站点名称' }]}
        >
          <Input placeholder="你的站点名称" />
        </Form.Item>
        <Form.Item
          name="url"
          label="站点链接"
          rules={[
            { required: true, message: '请输入站点链接' },
            { type: 'url', message: '请输入有效的链接地址' },
          ]}
        >
          <Input placeholder="https://example.com" />
        </Form.Item>
        <Form.Item name="avatar" label="头像链接（可选）">
          <Input placeholder="头像图片 URL" />
        </Form.Item>
        <Form.Item name="description" label="站点描述（可选）">
          <Input.TextArea rows={2} placeholder="简单介绍一下你的站点" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          提交申请
        </Button>
      </Form>
    </div>
  );
}
