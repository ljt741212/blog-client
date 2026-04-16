import { useState } from 'react';

import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router';

import { userService } from '@/services';
import { setCookie } from '@/utils';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    const { data } = await userService.login(values).finally(() => {
      setLoading(false);
    });
    setCookie('token', data.token, 7);
    window.localStorage.setItem('currentUser', JSON.stringify(data.user ?? {}));
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
      bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.10),transparent_40%),
          radial-gradient(circle_at_85%_25%,rgba(124,58,237,0.08),transparent_45%),
          linear-gradient(to_bottom,#f8fafc,#ffffff)]"
    >
      <Card
        className="w-full max-w-md rounded-2xl border border-[#e5e7eb]
        bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
        style={{ animation: 'login-card-in 420ms cubic-bezier(0.19,1,0.22,1) both' }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-[26px] font-semibold tracking-tight text-gray-900">欢迎登录</h2>
          <p className="mt-2 text-sm text-gray-500">使用你的账号管理博客内容</p>
          <div className="mx-auto mt-5 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]" />
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
          className="space-y-4"
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              className="rounded-xl border border-[#e5e7eb] bg-white text-gray-900
              placeholder:text-gray-400
              hover:border-[#c7d2fe]
              focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10
              transition-colors"
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
              className="rounded-xl border border-[#e5e7eb] bg-white text-gray-900
              placeholder:text-gray-400
              hover:border-[#c7d2fe]
              focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10
              transition-colors"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] border border-[#1d4ed8]/20
              shadow-sm hover:shadow-md transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-[#2563eb]/20"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div className="text-center">
            <a
              href="#"
              className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors duration-150"
            >
              忘记密码？
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
