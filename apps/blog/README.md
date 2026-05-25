# Blog 博客前端

博客系统用户端，基于 Next.js 16 App Router 构建的 SSR 应用。

## 技术栈

- **Next.js 16** — React 框架（App Router，SSR）
- **React 19** — UI 框架
- **Tailwind CSS 4** — 原子化样式
- **Ant Design 6** — UI 组件库（部分页面）
- **TypeScript** — 类型系统
- **Geist** — 字体

## 功能

- 文章列表（分页 + 搜索）
- 文章详情（Markdown 渲染 + 目录导航）
- 文章分类浏览
- 文章评论
- 访客留言板
- 更新日志
- 关于博客 / 关于我
- 暗色主题（CSS 变量色系）
- SEO 优化（动态 generateMetadata）
- 雪花特效、悬浮面板

## 路由

| 路由             | 页面                               |
| ---------------- | ---------------------------------- |
| `/`              | 首页（文章列表 + 分类侧栏 + 搜索） |
| `/articles/[id]` | 文章详情（含侧栏目录、评论区）     |
| `/aboutBlog`     | 关于博客                           |
| `/aboutMe`       | 关于我                             |
| `/changeLog`     | 更新日志                           |
| `/messageBoard`  | 留言板                             |

## 项目结构

```
apps/blog/
├── app/
│   ├── aboutBlog/       # 关于博客
│   ├── aboutMe/         # 关于我
│   ├── articles/[id]/   # 文章详情
│   ├── changeLog/       # 更新日志
│   ├── messageBoard/    # 留言板
│   ├── components/      # 组件
│   │   ├── article/     # 文章相关（卡片、内容、评论、侧栏、目录）
│   │   ├── messageBoard/# 留言板组件
│   │   ├── navBar/      # 导航栏
│   │   ├── footer/      # 页脚
│   │   ├── Snowfall.tsx     # 雪花特效
│   │   └── SuspensionPanel.tsx  # 悬浮面板
│   ├── lib/             # 工具库（api.ts, request.ts）
│   ├── types/           # 类型定义
│   ├── layout.tsx       # 根布局（SEO + 主题）
│   └── page.tsx         # 首页
├── next.config.ts
└── package.json
```

## 启动

在 monorepo 根目录：

```bash
pnpm dev:blog
```

或在此目录：

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

## API 代理

开发环境下 Next.js 将 `/api/:path*` 请求 rewrite 到 `http://localhost:3004`，配置见 `next.config.ts`。

## 主题

采用暗色主题，色系变量定义在 `globals.css` 中，详细说明见 `docs/color-system.md`。

- 主背景：slate-900 (`#0f172a`)
- 主色调：blue-400 (`#60a5fa`)
- 辅色：purple-400 / pink-400 渐变

## 构建

```bash
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务器
```
