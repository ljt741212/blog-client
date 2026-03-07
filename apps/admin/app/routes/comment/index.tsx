import { useState } from 'react';

import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Table, message, Switch } from 'antd';

import { useQuery } from '@/hooks';
import { commentService } from '@/services/comment';
import type { Pagination } from '@/types/index';

import type { Comment, CommentAdminPageQueryDto } from '~/types/comment';
import { CommentStatusEnum } from '~/types/comment';

export default function CommentPage() {
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCommentList = async (params?: Partial<CommentAdminPageQueryDto>) => {
    const { current, pageSize } = pagination;
    const { data } = await commentService.getCommentList({
      current,
      pageSize,
      ...(params ?? {}),
    });
    const { items, meta } = data ?? {};
    setPagination(meta);
    return items;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'commentList',
    queryFn: (params?: Partial<CommentAdminPageQueryDto>) => fetchCommentList(params),
  });

  const deleteComment = async (id: string) => {
    await commentService.deleteComment(id);
    message.success('删除成功');
    await refetch();
  };

  const updateCommentStatus = async (id: number, status: CommentStatusEnum) => {
    await commentService.updateCommentStatus(id, status);
    message.success('更新状态成功');
    await refetch();
  };

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

  const columns = [
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '评论用户',
      dataIndex: 'user',
      key: 'user',
      render: (_: unknown, record: Comment) => record.user?.username ?? record.visitor?.ip ?? '-',
    },
    {
      title: '评论时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '评论状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: CommentStatusEnum, record: Comment) => {
        return (
          <Switch
            checked={status === CommentStatusEnum.APPROVED}
            checkedChildren="已通过"
            unCheckedChildren="待审核"
            onChange={() =>
              updateCommentStatus(
                record.id,
                status === CommentStatusEnum.APPROVED
                  ? CommentStatusEnum.PENDING
                  : CommentStatusEnum.APPROVED
              )
            }
          />
        );
      },
    },
    {
      title: '评论文章',
      dataIndex: 'post',
      key: 'post',
      render: (post: Comment['post']) => post?.title ?? '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: Comment) => {
        return (
          <div className="flex items-center gap-2">
            <DeleteOutlined
              className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
              onClick={() => deleteComment(String(record.id))}
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
          placeholder="请输入评论内容"
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
