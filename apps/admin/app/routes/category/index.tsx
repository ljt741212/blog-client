import { useState, useRef } from 'react';

import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Switch, Modal, message, Form } from 'antd';

import { useQuery } from '@/hooks';
import { categoryService } from '@/services/category';
import type { Category, CategoryPageQueryDto } from '~/types/category';
import { CategoryStatusEnum } from '~/types/category';
import type { Pagination } from '@/types/index';

export default function CategoryPage() {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const currentCategory = useRef<Category | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'categoryList',
    queryFn: (params?: Partial<CategoryPageQueryDto>) => fetchCategoryList(params),
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

  const fetchCategoryList = async (params?: Partial<CategoryPageQueryDto>) => {
    const { current, pageSize } = pagination;
    const res = await categoryService.getCategoryList({
      current,
      pageSize,
      searchValue,
      ...(params ?? {}),
    });
    const { items, meta } = res?.data ?? {};
    setPagination(meta);
    return items;
  };

  const deleteCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    message.success('删除成功');
    await refetch();
  };

  const changeStatus = async (record: Category, status: number) => {
    await categoryService.updateCategoryStatus(record.id as unknown as string, status);
    message.success('状态修改成功');
    await refetch();
  };

  const saveCategory = async () => {
    const { name, description } = form.getFieldsValue();
    const { status, id } = currentCategory.current ?? {};
    await categoryService.saveCategory({ name, description, status, id }).finally(() => {
      setIsModalOpen(false);
    });
    currentCategory.current = null;
    message.success('保存成功');
    await refetch();
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <p className="max-w-[200px] truncate text-sm">{text}</p>,
    },
    {
      title: '分类描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <p className="max-w-[200px] truncate text-sm text-gray-500">{text}</p>
      ),
    },
    {
      title: '分类状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: Category) => (
        <Switch
          checked={status === CategoryStatusEnum.ENABLED}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={() => {
            changeStatus(
              record,
              status === CategoryStatusEnum.ENABLED
                ? CategoryStatusEnum.DISABLED
                : CategoryStatusEnum.ENABLED
            );
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: Category) => {
        return (
          <div className="flex items-center gap-2">
            <EditOutlined
              className="text-blue-500 hover:text-blue-600 cursor-pointer text-lg"
              onClick={() => {
                form.setFieldsValue(record);
                currentCategory.current = record;
                setIsModalOpen(true);
              }}
            />
            {record.status === 0 ? (
              <DeleteOutlined
                className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
                onClick={() => deleteCategory(record.id as unknown as string)}
              />
            ) : null}
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
          placeholder="请输入分类名称"
          value={searchValue}
          onChange={async e => {
            setSearchValue(e.target.value);
            await refetch({ searchValue: e.target.value, current: 1 });
          }}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            currentCategory.current = null;
            setIsModalOpen(true);
          }}
        >
          添加分类
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
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={saveCategory}
        title={'文章分类'}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="horizontal">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            label="分类描述"
            name="description"
            rules={[{ required: true, message: '请输入分类描述' }]}
          >
            <Input placeholder="请输入分类描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
