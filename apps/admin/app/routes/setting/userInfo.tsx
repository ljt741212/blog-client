import { useEffect, useState, useRef } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space, message, Row, Col, Upload } from 'antd';

import FullScreenLoading from '@/components/loading';
import { uploadService } from '@/services/upload';
import { userService } from '@/services/user';
import type { User } from '~/types/user';

import type { FormInstance } from 'antd';

interface UserProfileFormValues {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  githubAccount?: string;
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
    const payload: User = {
      id: currentUser.current?.id as string,
      username: values.username,
      email: values.email,
      avatar: values.avatar,
      bio: values.bio,
      githubAccount: values.githubAccount,
    };
    // 密码留空则不修改
    if (values.password) {
      payload.password = values.password;
    }
    setLoading(true);
    await userService.updateUser(currentUser.current?.id as string, payload).finally(() => {
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
                  name="name"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="邮箱"
                  name="email"
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
                <Form.Item label="个人简介" name="description">
                  <Input.TextArea rows={3} placeholder="简单介绍一下自己" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="GitHub 账号" name="gitHub">
                  <Input placeholder="例如：your-github-username" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="头像"
              name="avatar"
              rules={[{ required: true, message: '请上传头像' }]}
            >
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue, setFieldValue }) => {
                  const url = getFieldValue('avatar');
                  return (
                    <Upload
                      maxCount={1}
                      listType="picture-card"
                      fileList={url ? [{ uid: '-1', name: 'avatar', status: 'done', url }] : []}
                      customRequest={async ({ file, onSuccess }) => {
                        const newUrl = await handleUploadCoverImage(file as File);
                        if (newUrl) {
                          setFieldValue('avatar', newUrl);
                          onSuccess?.(newUrl);
                        }
                      }}
                      onRemove={() => setFieldValue('avatar', undefined)}
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
