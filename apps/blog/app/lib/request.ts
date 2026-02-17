interface RequestConfig extends RequestInit {
  timeout?: number;
  // Next.js特定的缓存配置
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

// 定义API响应接口
export interface ApiResponse<T = object> {
  code: number;
  data: T;
  // message: string;
  msg?: string; // 兼容不同的响应格式
}

// 定义请求错误类
export class RequestError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

// 获取 API 基础 URL
const getBaseURL = (): string => {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // 如果环境变量是完整 URL，直接返回（可用于生产环境）
  if (apiUrl && (apiUrl.startsWith('http://') || apiUrl.startsWith('https://'))) {
    return apiUrl;
  }

  // 客户端：使用相对路径 /api，交给 Next.js rewrite（/api -> http://localhost:3004/api）
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // 服务端：必须是绝对地址，否则 Node fetch 会报 “Failed to parse URL”
  // 与 admin 中 Vite 代理保持一致，指向同一个后端
  const basePath = apiUrl && !apiUrl.startsWith('http') ? apiUrl : '/api';
  return `http://localhost:3004${basePath.startsWith('/') ? '' : '/'}${basePath}`;
};

// 创建请求实例
const createRequest = () => {
  // 请求拦截器
  const requestInterceptor = (config: RequestConfig): RequestConfig => {
    // 添加默认headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    return {
      ...config,
      headers,
    };
  };

  // 响应拦截器
  const responseInterceptor = async <T>(response: Response): Promise<ApiResponse<T>> => {
    // 检查 HTTP 状态码
    if (!response.ok) {
      if (response.status === 401) {
        // token 过期或未授权
        // 可以在这里处理登录跳转等逻辑
        throw new RequestError(401, '未授权，请重新登录');
      }
      if (response.status === 404) {
        // 404错误，可能是API路径不存在或后端服务未运行
        const url = response.url || 'unknown';
        throw new RequestError(404, `资源未找到: ${url}。请检查API路径是否正确或后端服务是否运行`);
      }
      throw new RequestError(response.status, response.statusText || '请求失败');
    }

    // 检查响应内容类型
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new RequestError(0, '响应格式错误，期望JSON格式');
    }

    // 解析JSON响应
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch (error) {
      throw new RequestError(0, '响应解析失败，不是有效的JSON格式');
    }

    // 检查业务状态码
    if (data.code !== 200) {
      const errorMsg = data.msg ?? '请求失败';
      throw new RequestError(data.code, errorMsg);
    }

    return data;
  };

  // 统一的请求方法
  return async <T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
    // 设置超时（仅在客户端）
    // 使用 ReturnType<typeof setTimeout> 以兼容浏览器和 Node.js 环境
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    try {
      // 处理请求配置
      const finalConfig = requestInterceptor(config);

      // 提取Next.js特定的配置
      const { next, timeout, ...fetchConfig } = finalConfig;

      if (timeout && typeof window !== 'undefined') {
        controller = new AbortController();
        timeoutId = setTimeout(() => controller!.abort(), timeout);
        fetchConfig.signal = controller.signal;
      }

      // 构建完整的URL
      const baseURL = getBaseURL();
      const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

      // 构建fetch配置
      // Next.js 的 fetch 支持 next 选项，但 TypeScript 类型可能不包含
      // 使用类型断言来支持 Next.js 的扩展选项
      const fetchOptions = {
        ...fetchConfig,
        ...(next && { next }),
      } as RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

      // 发送请求
      const response = await fetch(fullUrl, fetchOptions);

      // 调试信息（仅在开发环境）
      if (process.env.NODE_ENV === 'development' && !response.ok) {
        console.log(`[Request Debug] URL: ${fullUrl}, Status: ${response.status}`);
      }

      // 处理响应
      const data = await responseInterceptor<T>(response);
      return data;
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new RequestError(0, '请求超时，请稍后重试');
        }
        throw new RequestError(0, error.message || '请求失败');
      } else {
        throw new RequestError(0, '请求失败');
      }
    } finally {
      // 确保清除超时
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
};

// 创建请求实例
const request = createRequest();

// GET 请求
export const get = <T>(url: string, config?: RequestConfig) =>
  request<T>(url, { ...config, method: 'GET' });

// POST 请求
export const post = <T>(url: string, data?: object, config?: RequestConfig) =>
  request<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

// PUT 请求
export const put = <T>(url: string, data?: object, config?: RequestConfig) =>
  request<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

// DELETE 请求
export const del = <T>(url: string, config?: RequestConfig) =>
  request<T>(url, { ...config, method: 'DELETE' });

// PATCH 请求
export const patch = <T>(url: string, data?: object, config?: RequestConfig) =>
  request<T>(url, {
    ...config,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

// 导出类型和函数
export type { RequestConfig };
export default request;
