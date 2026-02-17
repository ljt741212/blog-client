import { useState, useEffect } from 'react';

import {
  SaveOutlined,
  EyeOutlined,
  CalendarOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Form, Input, Card, Select, DatePicker, Button, Space, message, Upload } from 'antd';
import dayjs from 'dayjs';
import { Editor as MarkdownEditor } from 'markdownEditor';
import { useSearchParams, useNavigate } from 'react-router';

import FullScreenLoading from '@/components/loading';
import { articleService } from '@/services/article';
import { categoryService } from '@/services/category';
import { tagService } from '@/services/tag';
import { uploadService } from '@/services/upload';
import type { SaveArticleDto } from '~/types/article';
import { ArticleStatusEnum } from '~/types/article';
import type { Category } from '~/types/category';
import type { Tag } from '~/types/tag';


const { TextArea } = Input;

export default function SaveArticlePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const articleId = searchParams.get('articleId');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [categoryRes, tagRes] = await Promise.all([
        categoryService.getCategoryAll(),
        tagService.getTagAll(),
      ]);
      setCategories(categoryRes?.data ?? []);
      setTags(tagRes?.data ?? []);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;
      const res = await articleService.getArticleById(articleId);
      const article = res?.data ?? {};
      form.setFieldsValue({
        ...article,
        publishTime: article.publishTime ? dayjs(article.publishTime) : undefined,
        tagIds: article.tags?.map(tag => tag.id) ?? [],
        categoryId: article.category?.id,
      });
    };
    loadArticle();
  }, [articleId, form]);

  const handleUploadImages = async (
    files: File[]
  ): Promise<{ url: string; alt?: string; title?: string }[]> => {
    const results: { url: string; alt?: string; title?: string }[] = [];
    for (const file of files) {
      const res = await uploadService.upload(file, 'article');
      if (res?.data?.url) {
        results.push({ url: res.data.url });
      } else {
        message.error(`上传失败: ${file.name}`);
      }
    }
    return results;
  };

  const handleUploadCoverImage = async (file: File) => {
    const res = await uploadService.upload(file, 'article');
    return res?.data?.url;
  };

  const handleSave = async (isPublish = false) => {
    const values = await form.validateFields();
    const articleData: Partial<SaveArticleDto> = {
      ...values,
      id: articleId ? parseInt(articleId) : undefined,
      status: isPublish ? ArticleStatusEnum.PUBLISHED : ArticleStatusEnum.DRAFT,
      publishTime: values.publishTime
        ? dayjs(values.publishTime).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };

    setLoading(true);
    await articleService
      .saveArticle(articleData as SaveArticleDto as SaveArticleDto)
      .finally(() => {
        setLoading(false);
      });
    message.success('保存成功');
    navigate('/article');
  };

  const goBack = () => {
    navigate('/article');
  };

  return (
    <div className="h-screen flex flex-col gap-4 bg-[#0f172a]">
      <header className="flex justify-between items-center bg-[#111827] border border-[#273549] text-gray-100 p-4 rounded-lg shadow-sm flex-shrink-0">
        <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
          返回上一页
        </Button>
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleSave(false)}>
            保存草稿
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(true)}>
            发布文章
          </Button>
          {/* <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(true)}>
            预览
          </Button> */}
        </Space>
      </header>

      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <Card className="flex-1 overflow-hidden flex flex-col border-[#273549]">
            <Form form={form} layout="vertical" className="flex-1 flex flex-col overflow-hidden">
              <Form.Item name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
                <Input placeholder="请输入文章标题" size="large" />
              </Form.Item>

              <Form.Item required name="content">
                <Form.Item noStyle shouldUpdate={(prev, cur) => prev.content !== cur.content}>
                  {({ getFieldValue, setFieldValue }) => (
                    <MarkdownEditor
                      value={getFieldValue('content') ?? ''}
                      onChange={value => setFieldValue('content', value)}
                      uploadImages={handleUploadImages}
                    />
                  )}
                </Form.Item>
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div className="w-90 flex flex-col gap-4 overflow-y-auto">
          <Card
            className="border-[#273549]"
            title={
              <Space>
                <CalendarOutlined />
                <span>发布设置</span>
              </Space>
            }
          >
            <Form form={form} layout="horizontal">
              <Form.Item
                label="发布时间"
                name="publishTime"
                rules={[{ required: true, message: '请选择发布时间' }]}
              >
                <DatePicker showTime style={{ width: '100%' }} placeholder="选择发布时间" />
              </Form.Item>
            </Form>
          </Card>

          <Card
            className="border-[#273549]"
            title={
              <Space>
                <TagOutlined />
                <span>文章信息</span>
              </Space>
            }
          >
            <Form form={form} layout="horizontal">
              <Form.Item
                label="文章分类"
                name="categoryId"
                rules={[{ required: true, message: '请选择文章分类' }]}
              >
                <Select
                  placeholder="请选择分类"
                  options={categories.map(cat => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="文章标签"
                name="tagIds"
                rules={[{ required: true, message: '请选择文章标签' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  options={tags.map(tag => ({
                    value: tag.id,
                    label: tag.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="封面图片"
                name="coverImage"
                rules={[{ required: true, message: '请上传封面图片' }]}
              >
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue, setFieldValue }) => {
                    const url = getFieldValue('coverImage');
                    return (
                      <Upload
                        maxCount={1}
                        listType="picture-card"
                        fileList={url ? [{ uid: '-1', name: 'cover', status: 'done', url }] : []}
                        customRequest={async ({ file, onSuccess }) => {
                          const newUrl = await handleUploadCoverImage(file as File);
                          if (newUrl) {
                            setFieldValue('coverImage', newUrl);
                            onSuccess?.(newUrl);
                          }
                        }}
                        onRemove={() => setFieldValue('coverImage', undefined)}
                      >
                        <PlusOutlined />
                        <div className="ant-upload-text">Upload</div>
                      </Upload>
                    );
                  }}
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="文章摘要"
                name="summary"
                rules={[{ required: true, message: '请输入文章摘要' }]}
              >
                <TextArea rows={4} placeholder="请输入文章摘要" maxLength={200} showCount />
              </Form.Item>
            </Form>
          </Card>

          {/* <Card
            className="border-[#273549]"
            title={
              <Space>
                <FileTextOutlined />
                <span>文章统计</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <p className="text-gray-400">文章字数</p>
              <p className="text-gray-400">阅读次数</p>
              <p className="text-gray-400">上次编辑时间</p>
            </Space>
          </Card> */}
        </div>
      </div>
      <FullScreenLoading loading={loading} />
    </div>
  );
}
