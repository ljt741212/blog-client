'use client';

import { useEffect, useState } from 'react';

import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { getCookie } from '@/lib/cookie';

export default function EditArticleButton({ articleId }: { articleId: string }) {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getCookie('token'));
  }, []);

  if (!hasToken) return null;

  return (
    <Button
      icon={<EditOutlined />}
      onClick={() => {
        window.location.href = `/admin/article/save?articleId=${articleId}`;
      }}
    >
      编辑
    </Button>
  );
}
