import request, { type ResponseData } from '@/lib/request';
import { getCookie } from '@/utils';

export const dataTransferService = {
  exportAll: async () => {
    const token = getCookie('token');
    const res = await fetch('/api/data-transfer/export', {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      throw new Error(`导出失败: ${res.status}`);
    }

    const blob = await res.blob();

    const disposition = res.headers.get('content-disposition') ?? '';
    const match = disposition.match(/filename="([^"]+)"/i);
    const fileName = match?.[1] ?? `blog-db-export-${Date.now()}.zip`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  importAll: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ tables: number; rows: number }>(`/data-transfer/import?mode=truncate`, {
      method: 'POST',
      body: formData,
      timeout: 60 * 60 * 1000,
    }) as Promise<ResponseData<{ tables: number; rows: number }>>;
  },
};

