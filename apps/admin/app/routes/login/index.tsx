import { useState, useRef, useEffect } from 'react';

import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router';

import { RequestError } from '@/lib/request';
import { userService } from '@/services';
import { setCookie } from '@/utils';

type LoginMode = 'password' | 'code';

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<LoginMode>('password');
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.warning('请先输入邮箱');
        return;
      }
      setSending(true);
      await userService.sendCode({ email });
      message.success('验证码已发送');
      startCountdown();
    } catch (err) {
      if (err instanceof RequestError) {
        message.error(err.message);
      }
    } finally {
      setSending(false);
    }
  };

  const onFinish = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      let data: { token: string; user: unknown };

      if (mode === 'password') {
        const res = await userService.login({
          username: values.username,
          password: values.password,
        });
        data = res.data;
      } else {
        const res = await userService.loginByCode({
          email: values.email,
          code: values.code,
        });
        data = res.data;
      }

      setCookie('token', data.token, 7);
      window.localStorage.setItem('currentUser', JSON.stringify(data.user ?? {}));
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof RequestError) {
        message.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] p-4">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-8 text-2xl font-semibold text-center text-[#1e293b]">博客管理后台</h1>

        <div className="bg-white rounded-lg border border-[#e5e7eb] p-8">
          {/* 模式切换 */}
          <div className="flex border-b border-[#e5e7eb] mb-6 -mx-2">
            <button
              type="button"
              onClick={() => {
                setMode('password');
                form.resetFields();
              }}
              className={`flex-1 pb-3 text-sm border-b-2 transition-colors ${
                mode === 'password'
                  ? 'border-[#2563eb] text-[#2563eb] font-medium'
                  : 'border-transparent text-[#6b7280] hover:text-[#374151]'
              }`}
            >
              密码登录
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('code');
                form.resetFields();
              }}
              className={`flex-1 pb-3 text-sm border-b-2 transition-colors ${
                mode === 'code'
                  ? 'border-[#2563eb] text-[#2563eb] font-medium'
                  : 'border-transparent text-[#6b7280] hover:text-[#374151]'
              }`}
            >
              验证码登录
            </button>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            requiredMark={false}
            key={mode}
          >
            {mode === 'password' ? (
              <>
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                  <Input prefix={<UserOutlined />} placeholder="用户名" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="邮箱" />
                </Form.Item>

                <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                  <div className="flex gap-2">
                    <Input
                      prefix={<SafetyCertificateOutlined />}
                      placeholder="验证码"
                      maxLength={6}
                    />
                    <Button onClick={handleSendCode} loading={sending} disabled={countdown > 0}>
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </Form.Item>
              </>
            )}

            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
