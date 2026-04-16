import { useRef, useState } from 'react';

import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Switch, Modal, message, Form } from 'antd';

import { useQuery } from '@/hooks';
import { tagService } from '@/services/tag';
import type { Pagination } from '@/types/index';

import type { Tag, TagPageQueryDto } from '~/types/tag';
import { TagStatusEnum } from '~/types/tag';

export default function TagPage() {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const currentEditorTag = useRef<Tag | null>(null);
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

  const fetchTagList = async (params?: Partial<TagPageQueryDto>) => {
    const { current, pageSize } = pagination;
    const res = await tagService.getTagList({
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
    queryKey: 'tagList',
    queryFn: (params?: Partial<TagPageQueryDto>) => fetchTagList(params),
  });

  const deleteTag = async (id: string) => {
    await tagService.deleteTag(id);
    await refetch();
    message.success('删除成功');
  };

  const saveTag = async () => {
    const { name, description } = form.getFieldsValue();
    const { id, status } = currentEditorTag.current ?? {};
    await tagService.saveTag({ name, description, id, status }).finally(() => {
      setIsModalOpen(false);
    });
    currentEditorTag.current = null;
    message.success('保存成功');
    await refetch();
  };

  const changeStatus = async (record: Tag, status: number) => {
    const { id, name, description } = record;
    await tagService.saveTag({ id, name, description, status });
    message.success('状态修改成功');
    await refetch();
  };

  const columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <p className="max-w-[200px] truncate text-sm" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: '标签描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <p className="max-w-[200px] truncate text-sm text-gray-500" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: '标签状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: Tag) => (
        <Switch
          checked={status === TagStatusEnum.ENABLED}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={() => {
            changeStatus(
              record,
              status === TagStatusEnum.ENABLED ? TagStatusEnum.DISABLED : TagStatusEnum.ENABLED
            );
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: Tag) => {
        return (
          <div className="flex items-center gap-4">
            <EditOutlined
              className="text-blue-500 hover:text-blue-600 cursor-pointer text-lg"
              onClick={() => {
                form.setFieldsValue(record);
                currentEditorTag.current = record;
                setIsModalOpen(true);
              }}
            />
            {record.status === TagStatusEnum.ENABLED ? (
              <DeleteOutlined
                className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
                onClick={() => deleteTag(record.id)}
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
          placeholder="请输入标签名称"
          value={searchValue}
          onChange={async e => {
            setSearchValue(e.target.value);
            await refetch({ searchValue: e.target.value });
          }}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            currentEditorTag.current = null;
            setIsModalOpen(true);
          }}
        >
          添加标签
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
        onOk={() => saveTag()}
        title={'标签'}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="horizontal">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="标签描述"
            rules={[{ required: true, message: '请输入标签描述' }]}
          >
            <Input placeholder="请输入标签描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
