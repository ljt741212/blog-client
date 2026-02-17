'use client';

import { useMemo, useState } from 'react';

import { Card, Space, Tree, Typography } from 'antd';
import Link from 'next/link';

import {
  buildTocTree,
  extractHeadingsFromMarkdown,
  scrollPageToHeading,
  type TocTreeNode,
} from './toc';


export type ArticleSidebarProps = {
  markdown: string;
  scrollRootId: string;
  recentTitles?: string[];
};

export default function ArticleSidebar({
  markdown,
  scrollRootId,
  recentTitles = ['近期文章标题 1', '近期文章标题 2', '近期文章标题 3', '近期文章标题 4'],
}: ArticleSidebarProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const tocTree = useMemo(() => buildTocTree(extractHeadingsFromMarkdown(markdown)), [markdown]);

  return (
    <Space orientation="vertical" size={16} className="w-full">
      <Card title="目录" size="small">
        <Tree
          showLine
          selectable
          selectedKeys={selectedKeys}
          treeData={tocTree}
          onSelect={(keys, info: { node?: TocTreeNode }) => {
            setSelectedKeys(keys as string[]);
            const node = info?.node;
            if (!node) return;
            scrollPageToHeading(scrollRootId, {
              level: node.level,
              normTitle: node.normTitle,
              occurrence: node.occurrence,
            });
          }}
        />
      </Card>

      <Card title="近期文章" size="small">
        <Space orientation="vertical" size={8} className="w-full">
          {recentTitles.map((title, index) => (
            <Link key={`${title}-${index}`} href="/articles/placeholder" className="block">
              <Typography.Text>{title}</Typography.Text>
            </Link>
          ))}
        </Space>
      </Card>
    </Space>
  );
}
