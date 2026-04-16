import { useState } from 'react';

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, Input, Table, message, Image } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import { useQuery } from '@/hooks';
import { articleService } from '@/services/article';
import type { Pagination } from '@/types/index';

import type { SaveArticleDto, ArticlePageQueryDto } from '~/types/article';
import { ArticleStatusEnum } from '~/types/article';

const ArticleStatusMap = {
  [ArticleStatusEnum.DRAFT]: '草稿',
  [ArticleStatusEnum.PUBLISHED]: '发布',
  [ArticleStatusEnum.ARCHIVED]: '归档',
};

export default function ArticlePage() {
  const navigate = useNavigate();
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

  const editArticle = async (articleId?: string) => {
    if (articleId) {
      navigate(`/article/save?articleId=${articleId}`);
      return;
    }
    navigate(`/article/save`);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'articleList',
    queryFn: (params?: Partial<ArticlePageQueryDto>) => fetchArticleList(params),
  });

  const deleteArticle = async (id: string) => {
    await articleService.deleteArticle(id);
    message.success('删除成功');
    await refetch();
  };

  const importArticle = async () => {
    // await articleService.importArticle();
    message.success('导入成功');
    await refetch();
  };

  const changeStatus = async (id: number, status: ArticleStatusEnum) => {
    await articleService.updateArticleStatus(id, status);
    message.success('状态修改成功');
    await refetch();
  };

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '封面图片',
      dataIndex: 'coverImage',
      key: 'coverImage',
      render: (text: string) => <Image src={text} width={60} height={40} />,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      key: 'tags',
    },
    {
      title: '文章分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '文章状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ArticleStatusEnum) => (
        <p className="max-w-[200px] truncate text-sm">{ArticleStatusMap[status]}</p>
      ),
    },
    {
      title: '操作',
      key: 'action',
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
            {record.status === ArticleStatusEnum.PUBLISHED ? (
              <CheckOutlined
                className="text-green-500 hover:text-green-600 cursor-pointer text-lg"
                onClick={() =>
                  changeStatus(record.id as unknown as number, ArticleStatusEnum.DRAFT)
                }
              />
            ) : (
              <CloseOutlined
                className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
                onClick={() =>
                  changeStatus(record.id as unknown as number, ArticleStatusEnum.PUBLISHED)
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
        <div className="flex items-center gap-2">
          <Button type="default" onClick={() => editArticle()}>
            添加文章
          </Button>
          <Button type="default" onClick={() => importArticle()}>
            批量导入
          </Button>
        </div>
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
