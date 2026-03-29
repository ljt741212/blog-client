import { useState, useEffect } from 'react';

import { Modal, Form, Input, Select, Row, Col } from 'antd';

import { UserRoleEnum, UserStatusEnum } from '~/types/user';
import type { User } from '~/types/user';

import type { ModalProps } from 'antd';

interface SaveUserModalProps extends Omit<ModalProps, 'onOk'> {
  userInfo?: User;
  onSave: (userInfo: User) => Promise<Error | undefined>;
}

const sexOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
];

export default function SaveUserModal({ userInfo, onSave, ...props }: SaveUserModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        username: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone,
        github: userInfo.github,
      });
    }
  }, [userInfo, form]);

  const saveUser = async () => {
    setLoading(true);
    const values = await form.validateFields();
    const payload: User = userInfo
      ? { ...userInfo, ...values }
      : {
          id: '',
          username: values.username,
          email: values.email,
          phone: values.phone,
          github: values.github,
          role: UserRoleEnum.ADMIN,
          status: UserStatusEnum.ENABLED,
        };
    await onSave(payload).finally(() => {
      setLoading(false);
    });
    form.resetFields();
  };

  return (
    <Modal
      {...props}
      title="用户信息"
      okText="保存"
      cancelText="取消"
      width={820}
      onOk={() => saveUser()}
      confirmLoading={loading}
      onCancel={e => {
        form.resetFields();
        props.onCancel?.(e);
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ required: true, message: '请输入邮箱' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input inputMode="numeric" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="github"
              label="GitHub账号"
              rules={[{ required: true, message: '请输入GitHub账号' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sex" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Select options={sexOptions} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
