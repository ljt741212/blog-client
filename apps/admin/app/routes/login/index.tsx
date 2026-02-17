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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
      <Card
        className="w-full max-w-md shadow-[0_20px_45px_rgba(15,23,42,0.9)] transform hover:scale-[1.02] transition-all duration-300 border-0"
        style={{
          backdropFilter: 'blur(16px)',
          background: 'linear-gradient(145deg, rgba(31,41,55,0.92), rgba(15,23,42,0.96))',
          borderRadius: '18px',
        }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          欢迎登录
        </h2>

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
              className="rounded-lg bg-[#020617] border-[#273549] text-gray-100 placeholder:text-gray-500 hover:border-[#6366f1] focus:border-[#6366f1] transition-colors"
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
              className="rounded-lg bg-[#020617] border-[#273549] text-gray-100 placeholder:text-gray-500 hover:border-[#6366f1] focus:border-[#6366f1] transition-colors"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#4f46e5] border-none shadow-lg hover:shadow-xl transition-all duration-300"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div className="text-center">
            <a
              href="#"
              className="text-[#6366f1] hover:text-[#818cf8] transition-colors duration-300"
            >
              忘记密码？
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
