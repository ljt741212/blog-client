import { useState } from 'react';

import {
  ImportOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { Card, Button, Space, Typography, Upload, message, Modal } from 'antd';

import { uploadService } from '@/services/upload';
import { dataTransferService } from '@/services/dataTransfer';

import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

export default function Tools() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dbFileList, setDbFileList] = useState<UploadFile[]>([]);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
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

  const handleDbFileChange = (info: UploadChangeParam<UploadFile>) => {
    setDbFileList(info.fileList.slice(-1));
  };

  const handleExportDb = async () => {
    setExporting(true);
    try {
      await dataTransferService.exportAll();
      message.success('导出已开始（浏览器将下载文件）');
    } catch (error) {
      console.error(error);
      message.error('导出失败，请稍后重试');
    } finally {
      setExporting(false);
    }
  };

  const handleImportDb = async () => {
    if (!dbFileList.length || !dbFileList[0].originFileObj) {
      message.warning('请先选择要导入的备份文件（zip）');
      return;
    }

    Modal.confirm({
      title: '确认导入数据库备份？',
      content: '导入会先清空现有数据（TRUNCATE 全表），此操作不可恢复，请谨慎操作。',
      okText: '确认导入',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setImporting(true);
        try {
          const res = await dataTransferService.importAll(dbFileList[0].originFileObj as File);
          message.success(`导入成功：${res.data.tables} 张表，${res.data.rows} 行数据`);
          setDbFileList([]);
        } catch (error) {
          console.error(error);
          message.error('导入失败，请检查备份包或稍后重试');
        } finally {
          setImporting(false);
        }
      },
    });
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
              导出站点数据库全量数据，用于迁移或恢复。导入会清空当前库数据后回放备份包，请谨慎操作。
            </Typography.Paragraph>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space size="middle" wrap>
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  loading={exporting}
                  onClick={handleExportDb}
                >
                  导出备份（zip）
                </Button>
                <Typography.Text type="secondary">将下载一个包含全库数据的备份包</Typography.Text>
              </Space>

              <Space size="middle" wrap>
                <Upload
                  fileList={dbFileList}
                  onChange={handleDbFileChange}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".zip"
                >
                  <Button icon={<CloudDownloadOutlined />}>选择备份文件</Button>
                </Upload>
                <Button
                  type="primary"
                  danger
                  icon={<CloudDownloadOutlined />}
                  loading={importing}
                  onClick={handleImportDb}
                >
                  导入恢复
                </Button>
                <Typography.Text type="secondary">仅超级管理员可执行</Typography.Text>
              </Space>
            </Space>
            <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
              建议在迁移前先导出备份；导入后请重新登录并检查站点数据是否完整。
            </Typography.Paragraph>
          </Card>
        </Space>
      </div>
    </div>
  );
}
