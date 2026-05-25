# Admin 管理后台

博客系统管理后台，基于 React Router 7 + Vite 构建的 SPA 应用。

## 技术栈

- **React Router 7** — 路由框架（纯客户端 SPA，SSR 关闭）
- **Vite 6** — 构建工具
- **Ant Design 6** — UI 组件库
- **Tailwind CSS 4** — 原子化样式
- **bytemd** — Markdown 编辑器（含 GFM、代码高亮、数学公式、图片缩放插件）
- **@ant-design/plots** — 数据可视化
- **TypeScript** — 类型系统

## 功能模块

| 路由                    | 功能               |
| ----------------------- | ------------------ |
| `/login`                | 登录页             |
| `/`                     | 数据看板（仪表盘） |
| `/user`                 | 用户管理           |
| `/article`              | 文章列表管理       |
| `/article/save`         | 新建/编辑文章      |
| `/comment`              | 评论审核管理       |
| `/category`             | 文章分类管理       |
| `/tag`                  | 文章标签管理       |
| `/setting/baseSetting`  | 网站基础设置       |
| `/setting/userInfo`     | 个人信息设置       |
| `/setting/guestMessage` | 留言管理           |
| `/setting/updateLog`    | 更新日志管理       |
| `/setting/tools`        | 工具箱             |

## 项目结构

```
apps/admin/
├── app/
│   ├── components/       # 共享组件（Logo, MarkdownEditor, Loading, Layout）
│   ├── hooks/            # 自定义 hooks（useQuery）
│   ├── lib/              # 工具库（request.ts — fetch 封装 + JWT 拦截器）
│   ├── routes/           # 页面组件（按业务模块分目录）
│   ├── services/         # API 服务层
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数（cookie 等）
│   ├── routes.ts         # 路由配置
│   └── root.tsx          # 根组件 + ErrorBoundary
├── vite.config.ts
├── react-router.config.ts
└── package.json
```

## 启动

在 monorepo 根目录：

```bash
pnpm dev:admin
```

或在此目录：

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

## API 代理

开发环境下 Vite 将 `/api` 请求代理到 `http://localhost:3004`，配置见 `vite.config.ts`。

生产环境通过环境变量 `VITE_API_URL` 指定后端地址，参考 `.env.example`。

## 认证

采用 JWT Bearer Token 认证，登录后 token 存入 cookie，每次请求自动携带。401 时自动清除 token 并跳转登录页。

## 构建

```bash
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务器
```
