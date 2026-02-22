import { useState, useRef } from 'react';

import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Table,
  Tag,
  Typography,
  message,
  Form,
  DatePicker,
  Select,
  Modal,
  Switch,
} from 'antd';
import dayjs from 'dayjs';

import { useQuery } from '@/hooks';
import { updateLogService } from '@/services/updateLog';
import type { Pagination } from '@/types';
import type { UpdateLog, UpdateLogType, UpdateLogPageQueryDto } from '~/types/updateLog';

const { TextArea } = Input;

const typeColorMap: Record<UpdateLogType, string> = {
  feature: 'green',
  improvement: 'blue',
  bugfix: 'red',
  security: 'purple',
};

const typeLabelMap: Record<UpdateLogType, string> = {
  feature: '新功能',
  improvement: '功能优化',
  bugfix: '问题修复',
  security: '安全更新',
};

const typeOptions = (Object.entries(typeLabelMap) as [UpdateLogType | 'all', string][]).map(
  ([key, _]) => ({
    label: key,
    value: key === 'all' ? undefined : key,
  })
);

export default function UpdateLogPage() {
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<UpdateLogType | 'all'>('all');
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const currentUpdateLog = useRef<Partial<UpdateLog> | null>(null);
  const [form] = Form.useForm<Partial<UpdateLog>>();
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'updateLogList',
    queryFn: (params?: Partial<UpdateLogPageQueryDto>) => fetchUpdateLogList(params),
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

  const fetchUpdateLogList = async (params?: Partial<UpdateLogPageQueryDto>) => {
    try {
      const { current, pageSize } = pagination;
      const res = await updateLogService.getUpdateLogList({
        current,
        pageSize,
        searchValue,
        type: filterType === 'all' ? undefined : filterType,
        ...(params ?? {}),
      });
      const { items, meta } = res.data;
      setPagination(meta);
      return items;
    } catch {
      return [];
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const { id, title } = currentUpdateLog.current ?? {};
    const { releaseDate, ...restValues } = values;
    const payload: Partial<UpdateLog> = {
      id,
      title,
      releaseDate: dayjs(releaseDate).format('YYYY-MM-DD'),
      ...restValues,
    };

    await updateLogService.saveUpdateLog(payload);
    message.success('保存成功');
    setModalVisible(false);
    await refetch();
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除该更新日志？',
      content: '删除后不可恢复，请谨慎操作。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await updateLogService.deleteUpdateLog(id);
        message.success('删除成功');
        await refetch();
      },
    });
  };

  const handlePublish = async (id: string, isPublished: boolean) => {
    const { code, msg } = await updateLogService.updateUpdateLogStatus(id, isPublished);
    if (code !== 200) {
      message.error(msg);
      return;
    }
    message.success('发布状态更新成功');
    await refetch();
  };

  const columns = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 120,
    },
    {
      title: '发布日期',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      width: 140,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: UpdateLogType) => <Tag color={typeColorMap[type]}>{typeLabelMap[type]}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 120,
      render: (isPublished: boolean, record: UpdateLog) => (
        <Switch
          checked={isPublished}
          onChange={checked => handlePublish(record.id, checked)}
          checkedChildren="已发布"
          unCheckedChildren="已下架"
        />
      ),
    },
    {
      title: '内容概览',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <Typography.Text type="secondary">{text?.split('\n')[0] ?? '--'}</Typography.Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: string, record: UpdateLog) => (
        <div className="flex items-center gap-2">
          <EditOutlined
            className="text-blue-500 hover:text-blue-600 cursor-pointer text-lg"
            onClick={() => {
              currentUpdateLog.current = record;
              setModalVisible(true);
              form.setFieldsValue({
                ...record,
                releaseDate: dayjs(record.releaseDate) as unknown as string,
              });
            }}
          />
          <DeleteOutlined
            className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="按版本号 / 标题搜索"
            value={searchValue}
            onChange={async e => {
              const value = e.target.value;
              setSearchValue(value);
              await refetch({ searchValue: value, current: 1 });
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            style={{ width: 240 }}
          />
          <Select
            value={filterType}
            style={{ width: 140 }}
            onChange={async value => {
              setFilterType(value);
              await refetch({ type: value, current: 1 });
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            options={[{ label: '全部类型', value: 'all' }, ...typeOptions]}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            currentUpdateLog.current = null;
            setModalVisible(true);
            form.resetFields();
          }}
        >
          新增更新日志
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
        title={'更新日志'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          currentUpdateLog.current = null;
          form.resetFields();
        }}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        destroyOnClose
        width={640}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'feature',
            releaseDate: dayjs(),
          }}
        >
          <Form.Item
            label="版本号"
            name="version"
            rules={[{ required: true, message: '请输入版本号，例如 v1.2.0' }]}
          >
            <Input placeholder="例如：v1.2.0" />
          </Form.Item>

          <Form.Item
            label="发布日期"
            name="releaseDate"
            rules={[{ required: true, message: '请选择发布日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Select options={typeOptions} />
          </Form.Item>

          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="简要描述本次更新，例如：后台管理体验优化" />
          </Form.Item>

          <Form.Item
            label="更新内容"
            name="content"
            rules={[{ required: true, message: '请输入更新内容' }]}
            extra="支持多行输入，每一行会被视为一条更新说明"
          >
            <TextArea rows={6} placeholder="一行一条更新说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
