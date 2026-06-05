import { useEffect, useState } from 'react';

import {
  PlusOutlined,
  RobotOutlined,
  BarChartOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Tag,
  Popconfirm,
  message,
  Statistic,
  Row,
  Col,
} from 'antd';

import { aiService } from '@/services/ai';

import type { AiConfig, UsageStats } from '~/types/ai';
import { AiProvider } from '~/types/ai';

const providerOptions = [
  { value: AiProvider.OPENAI, label: 'OpenAI' },
  { value: AiProvider.DEEPSEEK, label: 'DeepSeek' },
  { value: AiProvider.ANTHROPIC, label: 'Anthropic' },
];

const providerLabelMap: Record<AiProvider, string> = {
  [AiProvider.OPENAI]: 'OpenAI',
  [AiProvider.DEEPSEEK]: 'DeepSeek',
  [AiProvider.ANTHROPIC]: 'Anthropic',
};

export default function AiConfigPage() {
  const [configs, setConfigs] = useState<AiConfig[]>([]);
  const [stats, setStats] = useState<UsageStats>({
    totalCalls: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [configRes, usageRes] = await Promise.all([
        aiService.getConfigs(),
        aiService.getUsage({ limit: 1 }),
      ]);
      setConfigs(configRes?.data ?? []);
      setStats(
        usageRes?.data?.stats ?? { totalCalls: 0, totalPromptTokens: 0, totalCompletionTokens: 0 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ maxTokens: 4096, temperature: 0.7 });
    setModalOpen(true);
  };

  const openEditModal = (record: AiConfig) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      apiKey: '',
      baseUrl: record.baseUrl ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    await aiService
      .saveConfig({
        ...values,
        id: editingId,
        baseUrl: values.baseUrl ?? '',
      })
      .finally(() => setSubmitting(false));
    message.success(editingId ? '更新成功' : '创建成功');
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: number) => {
    await aiService.deleteConfig(id);
    message.success('删除成功');
    await loadData();
  };

  const handleActivate = async (id: number) => {
    await aiService.activateConfig(id);
    message.success('已切换');
    await loadData();
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: '提供商',
      dataIndex: 'provider',
      key: 'provider',
      width: 100,
      render: (p: AiProvider) => <Tag>{providerLabelMap[p]}</Tag>,
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      width: 160,
    },
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      key: 'apiKey',
      width: 160,
      render: (key: string) => <Typography.Text code>{key}</Typography.Text>,
    },
    {
      title: 'Base URL',
      dataIndex: 'baseUrl',
      key: 'baseUrl',
      width: 200,
      ellipsis: true,
      render: (url: string | null) =>
        url || <Typography.Text type="secondary">默认</Typography.Text>,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 90,
      render: (active: boolean) =>
        active ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            已启用
          </Tag>
        ) : (
          <Tag>未启用</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_: unknown, record: AiConfig) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          {!record.isActive && (
            <>
              <Popconfirm
                title="确认删除？"
                description="删除后不可恢复"
                onConfirm={() => handleDelete(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
              <Button type="link" size="small" onClick={() => handleActivate(record.id)}>
                启用
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card
        title={
          <Space>
            <RobotOutlined />
            <span>模型配置</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            添加模型
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={configs}
          loading={loading}
          pagination={false}
          scroll={{ x: 1100 }}
        />
      </Card>

      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>用量概览</span>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col span={8}>
            <Statistic title="总调用次数" value={stats.totalCalls} />
          </Col>
          <Col span={8}>
            <Statistic title="输入 Token" value={stats.totalPromptTokens} />
          </Col>
          <Col span={8}>
            <Statistic title="输出 Token" value={stats.totalCompletionTokens} />
          </Col>
        </Row>
      </Card>

      <Modal
        title={editingId ? '编辑模型' : '添加模型'}
        open={modalOpen}
        onOk={handleSubmit}
        confirmLoading={submitting}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input placeholder="例如：我的 GPT-4o" />
          </Form.Item>

          <Form.Item
            name="provider"
            label="提供商"
            rules={[{ required: true, message: '请选择提供商' }]}
          >
            <Select options={providerOptions} placeholder="选择模型提供商" />
          </Form.Item>

          <Form.Item
            name="model"
            label="模型标识"
            rules={[{ required: true, message: '请输入模型标识' }]}
            extra="如 gpt-4o、deepseek-chat、claude-opus-4-20250514"
          >
            <Input placeholder="模型标识符" />
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API Key"
            rules={editingId ? [] : [{ required: true, message: '请输入 API Key' }]}
            extra={editingId ? '留空则不修改' : undefined}
          >
            <Input.Password placeholder="sk-..." />
          </Form.Item>

          <Form.Item name="baseUrl" label="API 地址" extra="选填，留空使用官方默认地址">
            <Input placeholder="https://api.openai.com/v1" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maxTokens" label="最大 Token">
                <InputNumber min={1} max={131072} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="temperature" label="Temperature">
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
