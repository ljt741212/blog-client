import request, { type ResponseData } from '@/lib/request';

export const uploadService = {
  /**
   * 上传文件到 OSS（统一使用 request 封装）
   * 对应后端：POST /oss/upload?dir=xxx
   * 字段名：file（multipart/form-data）
   */
  upload: (file: File, dir = 'article') => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string }>(`/oss/upload?dir=${encodeURIComponent(dir)}`, {
      method: 'POST',
      body: formData,
    }) as Promise<ResponseData<{ url: string }>>;
  },
};
