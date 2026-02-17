import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Table, Switch, message, Button } from 'antd';
import dayjs from 'dayjs';

import { useQuery } from '@/hooks';
import { guestMessageService } from '@/services/guestMessage';
import type {
  GuestMessage,
  GuestMessageAdminPageQueryDto,
  GuestMessageStatus,
} from '~/types/guestMessage';
import type { Pagination } from '@/types/index';

type SearchParams = Partial<GuestMessageAdminPageQueryDto>;

export default function GuestMessagePage() {
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
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

  const fetchGuestMessageList = async (params?: SearchParams) => {
    const { current, pageSize } = pagination;
    const res = await guestMessageService.getGuestMessageList({
      current,
      pageSize,
      searchValue,
      ...params,
    });
    setPagination(res.meta);
    return res.items;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'guestMessageList',
    queryFn: (params?: SearchParams) => fetchGuestMessageList(params),
  });

  const deleteGuestMessage = async (id: number) => {
    await guestMessageService.deleteGuestMessage(id);
    message.success('删除成功');
    await refetch();
  };

  const changeStatus = async (record: GuestMessage, status: GuestMessageStatus) => {
    await guestMessageService.updateGuestMessageStatus(record.id, status);
    message.success('状态修改成功');
    await refetch();
  };

  const columns = [
    {
      title: '留言内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '留言者昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '留言者邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '留言时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '留言状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: GuestMessageStatus, record: GuestMessage) => (
        <Switch
          checked={status === 'approved'}
          checkedChildren="已通过"
          unCheckedChildren="未通过"
          onChange={checked => {
            changeStatus(record, checked ? 'approved' : 'rejected');
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: GuestMessage) => {
        return (
          <Button type="link" onClick={() => deleteGuestMessage(record.id)}>
            删除
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="请输入留言内容"
          value={searchValue}
          onChange={async e => {
            setSearchValue(e.target.value);
            await refetch({ searchValue: e.target.value });
          }}
          style={{ width: 200 }}
        />
      </div>
      <Table
        dataSource={data ?? []}
        columns={columns}
        loading={isLoading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ y: 55 * 7, x: 'max-content' }}
      />
    </div>
  );
}
