import React, { createContext, useContext, useMemo, useOptimistic, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';

import { HolderOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Table, Modal, Form, Input, InputNumber, Switch, Image, message } from 'antd';

import { useQuery } from '@/hooks';
import { friendLinkService } from '@/services/friendLink';

import type { FriendLink, SaveFriendLinkDto } from '~/types/friendLink';

import type { DragEndEvent } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { TableColumnsType } from 'antd';

interface DataType extends FriendLink {
  key: string;
}

const FriendLinkStatusEnum = { DISABLED: 0, ENABLED: 1 } as const;

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: React.FC<RowProps> = props => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const fetchFriendLinkList = async () => {
  const { data } = await friendLinkService.getList();
  return data.map(i => ({ key: `${i.id}`, ...i }));
};

const FriendLinkPage: React.FC = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: 'friendLink',
    queryFn: () => fetchFriendLinkList(),
  });

  const [optimisticData, addOptimistic] = useOptimistic<DataType[], DataType[]>(
    data ?? [],
    (_state, items) => items
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const currentRecord = useRef<FriendLink | null>(null);

  const openCreate = () => {
    form.resetFields();
    currentRecord.current = null;
    setIsModalOpen(true);
  };

  const openEdit = (record: FriendLink) => {
    form.setFieldsValue(record);
    currentRecord.current = record;
    setIsModalOpen(true);
  };

  const handleDelete = (record: FriendLink) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除友链「${record.name}」吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await friendLinkService.delete(record.id);
        message.success('删除成功');
        refetch();
      },
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const dto: SaveFriendLinkDto = {
      ...values,
      id: currentRecord.current?.id,
    };
    setSubmitting(true);
    await friendLinkService.save(dto);
    message.success(currentRecord.current ? '更新成功' : '添加成功');
    setIsModalOpen(false);
    setSubmitting(false);
    refetch();
  };

  const handleStatusChange = async (record: FriendLink, checked: boolean) => {
    const status = checked ? FriendLinkStatusEnum.ENABLED : FriendLinkStatusEnum.DISABLED;
    await friendLinkService.updateStatus(record.id, status);
    message.success('状态修改成功');
    refetch();
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const items = optimisticData ?? [];
      const activeIndex = items.findIndex(i => i.key === active.id);
      const overIndex = items.findIndex(i => i.key === over?.id);
      const reordered = arrayMove(items, activeIndex, overIndex);
      const total = reordered.length;
      addOptimistic(reordered);
      await friendLinkService.batchSort(
        reordered.map((item, index) => ({ id: item.id, sort: total - index }))
      );
      refetch();
    }
  };

  const columns: TableColumnsType<DataType> = [
    { key: 'sort', align: 'center', width: 60, render: () => <DragHandle /> },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      align: 'center',
      render: (avatar: string, record: DataType) =>
        avatar ? (
          <Image src={avatar} width={40} height={40} className="rounded" />
        ) : (
          <div className="w-10 h-10 rounded bg-blue-500 text-white flex items-center justify-center text-sm font-bold mx-auto">
            {record.name?.charAt(0) || '?'}
          </div>
        ),
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 150 },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      render: (url: string) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 truncate block max-w-[180px]"
        >
          {url}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <p className="truncate text-sm text-gray-500 max-w-[180px]">{text || '-'}</p>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status: number, record: DataType) => (
        <Switch
          checked={status === FriendLinkStatusEnum.ENABLED}
          onChange={checked => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: DataType) => (
        <div className="flex items-center gap-2">
          <EditOutlined
            className="text-blue-500 hover:text-blue-600 cursor-pointer text-lg"
            onClick={() => openEdit(record)}
          />
          <DeleteOutlined
            className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">友链管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          添加友链
        </Button>
      </div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={optimisticData.map(i => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table<DataType>
            rowKey="key"
            components={{ body: { row: Row } }}
            columns={columns}
            dataSource={optimisticData}
            loading={isLoading}
            pagination={false}
            tableLayout="fixed"
            scroll={{ x: 'max-content', y: 'calc(100vh - 240px)' }}
          />
        </SortableContext>
      </DndContext>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        title={currentRecord.current ? '编辑友链' : '添加友链'}
        okText="保存"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: '80px' }}
          wrapperCol={{ flex: 'auto' }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入友链名称' }]}
          >
            <Input placeholder="请输入友链名称" />
          </Form.Item>
          <Form.Item
            label="链接"
            name="url"
            rules={[{ required: true, message: '请输入链接地址' }]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="头像URL" name="avatar">
            <Input placeholder="可选，头像图片地址" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="可选，友链描述" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <InputNumber placeholder="越大越靠前" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FriendLinkPage;
