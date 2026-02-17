import { useState } from 'react';

import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Table, Switch, message, Button } from 'antd';

import { useQuery } from '@/hooks';
import { userService } from '@/services/user';
import { UserStatusEnum } from '~/types/user';
import type { User , UserPageQueryDto } from '~/types/user';

import SaveUserModal from './components/saveUserModal';

export default function UserPage() {
  const [searchValue, setSearchValue] = useState('');
  const [editUserInfo, setEditUserInfo] = useState<User>();
  const [saveUserModalVisible, setSaveUserModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const paginationConfig = {
    ...pagination,
    onChange: async (current: number, pageSize: number) => {
      setPagination({ ...pagination, current, pageSize });
      await refetch({ current, pageSize });
    },
    onShowSizeChange: async (current: number, pageSize: number) => {
      setPagination({ ...pagination, current, pageSize });
      await refetch({ current, pageSize });
    },
  };

  const fetchUserList = async (params?: Partial<UserPageQueryDto>) => {
    const { current, pageSize } = pagination;
    const res = await userService.getUserList({
      current,
      pageSize,
      searchValue,
      ...(params ?? {}),
    });
    const { items, meta } = res.data;
    setPagination(meta);
    return items;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'userList',
    queryFn: (params?: Partial<UserPageQueryDto>) => fetchUserList(params),
  });

  const deleteUser = async (id: string) => {
    await userService.deleteUser(id);
    message.success('删除成功');
    await refetch();
  };

  const openSaveUserModal = (userInfo?: User) => {
    setSaveUserModalVisible(true);
    setEditUserInfo(userInfo);
  };

  const saveUser = async (userInfo: Partial<User>) => {
    await userService.saveUser(userInfo as User as User);
    message.success('保存成功');
    setSaveUserModalVisible(false);
    await refetch();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'gitHub账号',
      dataIndex: 'github',
      key: 'github',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => <Switch checked={status === UserStatusEnum.ENABLED} />,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: User) => {
        return (
          <div className="flex items-center gap-2">
            <DeleteOutlined
              className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
              onClick={() => deleteUser(record.id as unknown as string)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="请输入用户名"
          value={searchValue}
          onChange={async e => {
            setSearchValue(e.target.value);
            await refetch({ searchValue: e.target.value });
          }}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={() => openSaveUserModal()}>
          添加用户
        </Button>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ y: 55 * 7, x: 'max-content' }}
      />
      <SaveUserModal
        onSave={async (userInfo: User) => {
          await saveUser(userInfo as User);
          return undefined;
        }}
        open={saveUserModalVisible}
        onCancel={() => setSaveUserModalVisible(false)}
        userInfo={editUserInfo}
      />
    </div>
  );
}
