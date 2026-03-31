import { useEffect, useRef, useState } from 'react';

import {
  SettingOutlined,
  UserOutlined,
  FileOutlined,
  CommentOutlined,
  FolderOutlined,
  TagOutlined,
  HomeOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Menu, Dropdown, Switch as AntSwitch, Form, Modal, Input, message } from 'antd';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';

import { userService } from '@/services/user';
import { getCookie, removeCookie } from '@/utils';

import Logo from './Logo';

import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '',
    label: '仪表盘',
    icon: <HomeOutlined />,
  },
  {
    key: 'user',
    label: '用户管理',
    icon: <UserOutlined />,
  },
  {
    key: 'article',
    label: '文章管理',
    icon: <FileOutlined />,
  },
  {
    key: 'comment',
    label: '评论管理',
    icon: <CommentOutlined />,
  },

  {
    key: 'category',
    label: '文章分类管理',
    icon: <FolderOutlined />,
  },
  {
    key: 'tag',
    label: '文章标签管理',
    icon: <TagOutlined />,
  },
  {
    key: 'setting',
    label: '网站设置',
    icon: <SettingOutlined />,
    children: [
      { key: 'baseSetting', label: '基础设置' },
      { key: 'userInfo', label: '个人资料' },
      { key: 'guestMessage', label: '留言管理' },
      { key: 'updateLog', label: '更新日志' },
      { key: 'tools', label: '工具' },
    ],
  },
];

const Layout: React.FC = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    setLoading(true);
    const values = await form.validateFields();
    await userService.changePassword(values).finally(() => {
      setLoading(false);
    });
    message.success('密码修改成功');
    removeCookie('token');
    navigate('/login');
  };

  const settingItems: MenuItem[] = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: () => {
        removeCookie('token');
        navigate('/login');
      },
    },
    {
      key: 'changePassword',
      label: '修改密码',
      icon: <LockOutlined />,
      onClick: () => setOpen(true),
    },
  ];

  const onClick: MenuProps['onClick'] = e => {
    if (e.key !== pathname) {
      navigate(e.keyPath.reverse().join('/'));
    }
  };

  const menuRef = useRef<MenuProps['items']>(items);

  useEffect(() => {
    menuRef.current = items;
  }, []);

  const isLogin = getCookie('token');
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#f3f4f6] text-gray-900">
        <div className="h-12 w-full border-b border-[#e5e7eb] flex items-center justify-between pr-8 pl-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-lg font-bold">
            <Logo /> Admin
          </div>
          <div className="flex items-center gap-3">
            <AntSwitch checkedChildren="暗系" unCheckedChildren="亮系" defaultChecked={false} />
            <Dropdown menu={{ items: settingItems }}>
              <SettingOutlined className="text-2xl cursor-pointer" />
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-1 min-h-0">
          <Menu
            onClick={onClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="light"
            items={items}
          />
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 m-8 p-8 rounded-2xl overflow-auto bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-[#e5e7eb]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={changePassword}
        confirmLoading={loading}
        title="修改密码"
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            name="oldPassword"
            label="旧密码"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Layout;
