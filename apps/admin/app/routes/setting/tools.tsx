import { useState } from 'react';

import {
  ImportOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { Card, Button, Space, Typography, Upload, message, Modal } from 'antd';

import { dataTransferService } from '@/services/dataTransfer';

import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

export default function Tools() {
  const [wpFileList, setWpFileList] = useState<UploadFile[]>([]);
  const [dbFileList, setDbFileList] = useState<UploadFile[]>([]);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [wpImporting, setWpImporting] = useState(false);

  const handleWpFileChange = (info: UploadChangeParam<UploadFile>) => {
    setWpFileList(info.fileList.slice(-1));
  };

  const handleWpImport = async () => {
    if (!wpFileList.length || !wpFileList[0].originFileObj) {
      message.warning('请先选择 WordPress 导出的 XML 文件');
      return;
    }

    Modal.confirm({
      title: '确认导入 WordPress 文章？',
      content: '将从 XML 文件中解析并导入文章，已存在的文章会跳过。',
      okText: '确认导入',
      cancelText: '取消',
      onOk: async () => {
        setWpImporting(true);
        try {
          const res = await dataTransferService.importWordPress(
            wpFileList[0].originFileObj as File
          );
          message.success(
            `导入完成：成功导入 ${res.data.imported} 篇，跳过 ${res.data.skipped} 篇`
          );
          setWpFileList([]);
        } catch {
          message.error('导入失败，请检查文件格式或稍后重试');
        } finally {
          setWpImporting(false);
        }
      },
    });
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
                <span>导入 WordPress 文章</span>
              </Space>
            }
            extra={
              <Typography.Text type="secondary">
                从 WordPress 导出的 XML 文件迁移内容
              </Typography.Text>
            }
          >
            <Typography.Paragraph type="secondary">
              上传 WordPress 导出的 WXR
              文件（.xml），系统将解析其中的文章并导入到当前博客。已存在的文章会自动跳过。
            </Typography.Paragraph>
            <Space size="middle">
              <Upload
                fileList={wpFileList}
                onChange={handleWpFileChange}
                beforeUpload={() => false}
                maxCount={1}
                accept=".xml"
              >
                <Button icon={<ImportOutlined />}>选择 XML 文件</Button>
              </Upload>
              <Button
                type="primary"
                icon={<ImportOutlined />}
                loading={wpImporting}
                onClick={handleWpImport}
              >
                开始导入
              </Button>
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
