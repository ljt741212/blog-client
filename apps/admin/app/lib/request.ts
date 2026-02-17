import { message } from 'antd';
import { isNil } from 'lodash-es';

import { getCookie, removeCookie } from '@/utils';

/** 可作为 URL query 参数的值（会按需转为 string） */
interface RequestConfig extends RequestInit {
  timeout?: number;
  params?: object;
}

interface ResponseData<T = object> {
  code: number;
  data: T;
  msg: string;
}

class RequestError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_API_URL || '/api';
  }
  return process.env.VITE_API_URL || '/api';
};

const createRequest = (baseURL: string) => {
  const requestInterceptor = (config: RequestConfig): RequestConfig => {
    const token = getCookie('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  };

  // 响应拦截器
  const responseInterceptor = async <T>(response: Response): Promise<ResponseData<T>> => {
    if (!response.ok) {
      if (response.status === 401) {
        // token 过期或未授权，清除 token 并跳转到登录页
        removeCookie('token');
             message.error('未授权，请重新登录');
        window.location.href = '/login';
        throw new RequestError(401, '未授权，请重新登录');
      }
      throw new RequestError(response.status, response.statusText ?? '请求失败');
    }

    const data = await response.json();

    if (data.code !== 200) {
      message.error(data.msg ?? '请求失败');
      throw new RequestError(data.code, data.msg ?? '请求失败');
    }
    return data;
  };

  // 统一的请求方法
  return async <T>(url: string, config: RequestConfig = {}): Promise<ResponseData<T>> => {
    try {
      const { params, ...restConfig } = config;
      const isFormData = restConfig.body instanceof FormData;
      const finalConfig = requestInterceptor({
        ...restConfig,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...restConfig.headers,
        },
      });

      // 设置超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), restConfig.timeout || 10000);
      finalConfig.signal = controller.signal;

      // 处理 query 参数
      let finalUrl = `${baseURL}${url}`;
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (isNil(value)) return;
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        if (queryString) {
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
        }
      }
      const response = await fetch(finalUrl, finalConfig);
      clearTimeout(timeoutId);
      const data = await responseInterceptor<T>(response);
      return data;
    } catch (error) {
      // message.error('请求失败，请稍后重试');
      throw new RequestError(0, '请求失败');
    }
  };
};

const request = createRequest(getBaseURL());

const get = <T>(url: string, config?: RequestConfig) =>
  request<T>(url, { ...config, method: 'GET' });

const post = <T>(url: string, data?: object, config?: RequestConfig) =>
  request<T>(url, { ...config, method: 'POST', body: JSON.stringify(data) });

const put = <T>(url: string, data?: object, config?: RequestConfig) =>
  request<T>(url, { ...config, method: 'PUT', body: JSON.stringify(data) });

const del = <T>(url: string, config?: RequestConfig) =>
  request<T>(url, { ...config, method: 'DELETE' });

export type { ResponseData, RequestConfig };
export { get, post, put, del, RequestError };
export default request;
