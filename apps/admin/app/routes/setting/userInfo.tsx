import { useEffect, useState, useRef } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, message, Row, Col, Upload } from 'antd';

import FullScreenLoading from '@/components/loading';
import { uploadService } from '@/services/upload';
import { userService } from '@/services/user';
import type { User } from '~/types/user';

import type { FormInstance } from 'antd';

interface UserProfileFormValues {
  Name: string;
  Email: string;
  Password?: string;
  Avatar?: string;
  Description?: string;
  GitHub?: string;
  NikName?: string;
  WeChat?: string;
  Phone?: string;
}

export default function UserInfo() {
  const [form] = Form.useForm<UserProfileFormValues>() as [FormInstance<UserProfileFormValues>];
  const [loading, setLoading] = useState(false);
  const currentUser = useRef<User>();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await userService.getCurrentUser();
      currentUser.current = data;
      form.setFieldsValue(data);
    };
    getCurrentUser();
  }, [form]);

  const handleSubmit = async (values: UserProfileFormValues) => {
    setLoading(true);
    await userService.updateUser(currentUser.current?.Id as string, values as Partial<User>).finally(() => {
      setLoading(false);
    });
    message.success('信息修改成功');
  };

  const handleUploadCoverImage = async (file: File) => {
    const res = await uploadService.upload(file, 'user');
    return res?.data?.url;
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 w-full">
          <Form<UserProfileFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="用户名"
                  name="Name"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="邮箱"
                  name="Email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入正确的邮箱格式' },
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="昵称" name="NikName">
                  <Input placeholder="请输入昵称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="微信" name="WeChat">
                  <Input placeholder="请输入微信号" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="手机号" name="Phone">
                  <Input placeholder="请输入手机号" inputMode="numeric" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="GitHub 账号" name="GitHub">
                  <Input placeholder="例如：your-github-username" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="个人简介" name="Description">
                  <Input.TextArea rows={3} placeholder="简单介绍一下自己" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="头像"
              name="Avatar"
              rules={[{ required: true, message: '请上传头像' }]}
            >
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue, setFieldValue }) => {
                  const url = getFieldValue('Avatar');
                  return (
                    <Upload
                      maxCount={1}
                      listType="picture-card"
                      fileList={url ? [{ uid: '-1', name: 'avatar', status: 'done', url }] : []}
                      customRequest={async ({ file, onSuccess }) => {
                        const newUrl = await handleUploadCoverImage(file as File);
                        if (newUrl) {
                          setFieldValue('Avatar', newUrl);
                          onSuccess?.(newUrl);
                        }
                      }}
                      onRemove={() => setFieldValue('Avatar', undefined)}
                    >
                      <PlusOutlined />
                      <div className="ant-upload-text">Upload</div>
                    </Upload>
                  );
                }}
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => form.resetFields()}>重置</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存更改
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
      <FullScreenLoading loading={loading} />
    </>
  );
}
