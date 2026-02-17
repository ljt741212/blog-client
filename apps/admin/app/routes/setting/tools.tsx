import { useState } from 'react';

import {
  ImportOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { Card, Button, Space, Typography, Upload, message } from 'antd';

import { uploadService } from '@/services/upload';

import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';


export default function Tools() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList.slice(-1));
  };
  const handleImport = async () => {
    if (!fileList.length || !fileList[0].originFileObj) {
      message.warning('请先选择要上传的文件');
      return;
    }

    try {
      const res = await uploadService.upload(fileList[0].originFileObj as File);
      message.success('上传成功');
      console.log('上传结果：', res);
    } catch (error) {
      console.error(error);
      message.error('上传失败，请稍后重试');
    }
  };
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 w-full">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card
            title={
              <Space align="center">
                <ImportOutlined />
                <span>文章导入</span>
              </Space>
            }
            extra={<Typography.Text type="secondary">从其他平台迁移内容</Typography.Text>}
          >
            <Typography.Paragraph type="secondary">
              支持将外部文章批量导入到当前博客系统。此区域仅展示操作入口，具体导入逻辑可在后续接入。
            </Typography.Paragraph>
            <Space size="middle">
              <Upload fileList={fileList} onChange={handleUpload} beforeUpload={() => false}>
                <Button type="primary" icon={<ImportOutlined />}>
                  <span>选择文件</span>
                </Button>
              </Upload>
              <Button type="primary" icon={<ImportOutlined />} onClick={handleImport}>
                导入文章
              </Button>
              <Typography.Text type="secondary">
                点击按钮目前不会触发实际导入，仅用于界面展示。
              </Typography.Text>
            </Space>
          </Card>

          <Card
            title={
              <Space align="center">
                <DatabaseOutlined />
                <span>数据备份</span>
              </Space>
            }
            extra={<Typography.Text type="secondary">保障站点数据安全</Typography.Text>}
          >
            <Typography.Paragraph type="secondary">
              提供站点数据的备份与恢复入口，方便在需要时快速恢复。此处同样只负责界面展示，备份与恢复逻辑可在后续实现。
            </Typography.Paragraph>
            <Space size="middle">
              <Button type="primary" icon={<CloudUploadOutlined />}>
                立即备份
              </Button>
              <Button icon={<CloudDownloadOutlined />}>恢复数据</Button>
            </Space>
            <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
              建议在接入实际功能时，补充备份策略说明、最近备份时间等信息。
            </Typography.Paragraph>
          </Card>
        </Space>
      </div>
    </div>
  );
}
