import { useState } from 'react';

import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Switch, Table, message, Image } from 'antd';
import dayjs from 'dayjs';

import { useQuery } from '@/hooks';
import { articleService } from '@/services/article';
import type { Pagination } from '@/types/index';

import type { SaveArticleDto, ArticlePageQueryDto } from '~/types/article';
import { ArticleStatusEnum } from '~/types/article';

import type { ColumnsType } from 'antd/es/table';

export default function ArticlePage() {
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

  const fetchArticleList = async (params?: Partial<ArticlePageQueryDto>) => {
    const { current, pageSize } = pagination;
    const res = await articleService.getArticleList({
      current,
      pageSize,
      searchValue,
      ...(params ?? {}),
    });
    const { items, meta } = res.data;
    setPagination(meta);
    return items;
  };

  const editArticle = (articleId?: string) => {
    const url = articleId ? `/admin/article/save?articleId=${articleId}` : '/admin/article/save';
    window.open(url, '_blank');
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'articleList',
    queryFn: (params?: Partial<ArticlePageQueryDto>) => fetchArticleList(params),
  });

  const deleteArticle = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？此操作不可撤销。',
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        await articleService.deleteArticle(id);
        message.success('删除成功');
        await refetch();
      },
    });
  };

  const changeStatus = async (id: number, status: ArticleStatusEnum) => {
    await articleService.updateArticleStatus(id, status);
    message.success('状态修改成功');
    await refetch();
  };

  const columns: ColumnsType<SaveArticleDto> = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '封面图片',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 100,
      render: (text: string) => <Image src={text} width={60} height={40} />,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
    },
    {
      title: '文章分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '文章状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      render: (_status: ArticleStatusEnum, record: SaveArticleDto) => (
        <Switch
          checked={record.status === ArticleStatusEnum.PUBLISHED}
          disabled={record.status === ArticleStatusEnum.ARCHIVED}
          checkedChildren="发布"
          unCheckedChildren="草稿"
          onChange={checked =>
            changeStatus(
              record.id as unknown as number,
              checked ? ArticleStatusEnum.PUBLISHED : ArticleStatusEnum.DRAFT
            )
          }
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_: string, record: SaveArticleDto) => {
        return (
          <div className="flex items-center gap-2">
            <EditOutlined
              className="text-blue-500 hover:text-blue-600 cursor-pointer text-lg"
              onClick={() => editArticle(record.id as unknown as string)}
            />
            <DeleteOutlined
              className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
              onClick={() => deleteArticle(record.id as unknown as string)}
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
          placeholder="全量检索文章"
          value={searchValue}
          onChange={async e => {
            setSearchValue(e.target.value);
            await refetch({ searchValue: e.target.value, current: 1 });
          }}
          style={{ width: 200 }}
        />
        <Button type="default" onClick={() => editArticle()}>
          添加文章
        </Button>
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
