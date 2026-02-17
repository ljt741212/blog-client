import React, { useEffect, useState } from 'react';

import { GlobalOutlined, LinkOutlined, SettingOutlined , PlusOutlined} from '@ant-design/icons';
import { Form, Input, Button, Space, Switch, Card, Row, Col, Typography, message, Upload } from 'antd';

import { settingService } from '@/services/setting';
import { uploadService } from '@/services/upload';
import type { Setting as SiteSetting } from '~/types/setting';

// 博客基础设置页
export default function Setting() {
  const [form] = Form.useForm<SiteSetting>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data } = await settingService.getSetting().finally(() => {
        setLoading(false);
      });
      form.setFieldsValue(data);
    };
    init();
  }, [form]);

  const handleSubmit = async (values: SiteSetting) => {
    setLoading(true);
    const payload: SiteSetting = {
      seo: values.seo,
      links: values.links ?? [],
      icp: values.icp,
    };
    await settingService.saveSetting(payload).finally(() => {
      setLoading(false);
    });
      message.success('保存成功');
  };

  const handleUploadImages = async (
    files: File[]
  ): Promise<{ url: string; alt?: string; title?: string }[]> => {
    const results: { url: string; alt?: string; title?: string }[] = [];
    for (const file of files) {
      const res = await uploadService.upload(file, 'setting');
      if (res?.data?.url) {
        results.push({ url: res.data.url });
      } else {
        message.error(`上传失败: ${file.name}`);
      }
    }
    return results;
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 w-full">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24} style={{ display: 'flex', flexDirection: 'column', rowGap: 24 }}>
            <Col span={24}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card
                  title={<SectionTitle icon={<GlobalOutlined />} title="SEO 设置" />}
                  extra={<Typography.Text type="secondary">提升搜索表现</Typography.Text>}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="SEO 标题"
                        name={['seo', 'title']}
                        rules={[{ required: true, message: '请输入站点标题' }]}
                      >
                        <Input placeholder="用于搜索引擎展示的标题（title）" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="SEO 关键词"
                        name={['seo', 'keywords']}
                        rules={[{ required: true, message: '请输入关键词' }]}
                      >
                        <Input placeholder="多个关键词用逗号分隔" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="SEO 描述"
                    name={['seo', 'description']}
                    rules={[{ required: true, message: '请输入站点描述' }]}
                  >
                    <Input.TextArea rows={3} placeholder="站点简介与核心内容（description）" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Sitemap URL"
                        name={['seo', 'sitemapUrl']}
                        rules={[{ required: false }]}
                      >
                        <Input placeholder="例如：https://example.com/sitemap.xml" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Canonical URL"
                        name={['seo', 'canonicalUrl']}
                        rules={[{ required: false }]}
                      >
                        <Input placeholder="例如：https://example.com" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Robots 设置" name={['seo', 'robots']}>
                    <Input.TextArea rows={3} placeholder={`例如：User-agent: *Disallow: /admin`} />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Open Graph 标题" name={['seo', 'ogTitle']}>
                        <Input placeholder="社交分享卡片标题（og:title）" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Open Graph 图片" name={['seo', 'ogImage']}>
                      <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue, setFieldValue }) => {
                    const url = getFieldValue(['seo', 'ogImage']);
                    return (
                      <Upload
                        maxCount={1}
                        listType="picture-card"
                        fileList={url ? [{ uid: '-1', name: 'ogImage', status: 'done', url }] : []}
                        customRequest={async ({ file, onSuccess }) => {
                          const newUrl = await handleUploadImages([file as File]);
                          if (newUrl?.length) {
                            setFieldValue(['seo', 'ogImage'], newUrl[0].url);
                            onSuccess?.(newUrl);
                          }
                        }}
                        onRemove={() => setFieldValue(['seo', 'ogImage'], undefined)}
                      >
                        <PlusOutlined />
                        <div className="ant-upload-text">Upload</div>
                      </Upload>
                    );
                  }}
                </Form.Item>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Open Graph 描述" name={['seo', 'ogDescription']}>
                    <Input.TextArea rows={3} placeholder="社交分享卡片描述（og:description）" />
                  </Form.Item>

                  <Form.Item label="Schema 标记（JSON-LD）" name={['seo', 'schemaMarkup']}>
                    <Input.TextArea
                      rows={4}
                      placeholder='粘贴 JSON-LD 结构化数据，例如 {"@context": "https://schema.org", ...}'
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Meta 作者" name={['seo', 'metaAuthor']}>
                        <Input placeholder="作者或站点名称（author）" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Meta 视口" name={['seo', 'metaViewport']}>
                        <Input placeholder="一般为：width=device-width, initial-scale=1.0" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card
                  title={<SectionTitle icon={<LinkOutlined />} title="友情链接" />}
                  extra={<Typography.Text type="secondary">展示合作与推荐</Typography.Text>}
                >
                  <Form.List name="links">
                    {(fields, { add, remove }) => (
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} type="inner" size="small">
                            <Row gutter={12} align="middle">
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  label="名称"
                                  name={[name, 'name']}
                                  rules={[{ required: true, message: '请输入名称' }]}
                                >
                                  <Input placeholder="名称" />
                                </Form.Item>
                              </Col>
                              <Col span={16}>
                                <Form.Item
                                  {...restField}
                                  label="链接"
                                  name={[name, 'url']}
                                  rules={[{ required: true, message: '请输入链接' }]}
                                >
                                  <Input placeholder="https://example.com" />
                                </Form.Item>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Button danger type="text" onClick={() => remove(name)}>
                                  删除
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block>
                          新增友情链接
                        </Button>
                      </Space>
                    )}
                  </Form.List>
                </Card>
              </Space>
            </Col>
            <Col span={24}>
              <Card title="ICP备案">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="备案号" name={['icp', 'icpNumber']}>
                      <Input placeholder="例如：京ICP备00000000号" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="备案链接" name={['icp', 'icpUrl']}>
                      <Input placeholder="例如：https://beian.miit.gov.cn" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="网站名称" name={['icp', 'websiteName']}>
                      <Input placeholder="例如：某某技术博客" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title={<SectionTitle icon={<SettingOutlined />} title="其他" />}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="开启评论" name="enableComment" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="开启统计" name="enableAnalytics" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="统计代码（可选）" name="analyticsCode">
                    <Input.TextArea rows={3} placeholder="粘贴统计脚本或埋点代码" />
                  </Form.Item>
                </Card>
                <Card style={{ textAlign: 'right' }}>
                  <Space size="middle">
                    <Button onClick={() => form.resetFields()}>重置</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存更改
                    </Button>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Space align="center" size="middle">
      <div className="w-9 h-9 rounded-[10px] grid place-items-center bg-[rgba(0,0,0,0.04)]">
        {icon}
      </div>
      <Typography.Text strong>{title}</Typography.Text>
    </Space>
  );
}
