<p align="center">
  <a href="https://www.cx330.cloud" target="_blank">
    <img src="https://img.shields.io/badge/🌐-cx330.cloud-blue?style=for-the-badge" alt="Blog" />
  </a>
  <a href="https://github.com/ljt741212/blog-server" target="_blank">
    <img src="https://img.shields.io/badge/🔧-后端仓库-blue?style=for-the-badge" alt="Backend" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&style=for-the-badge" alt="React 19" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=for-the-badge" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-ISC-green?style=for-the-badge" alt="License" />
</p>

<h1 align="center">CX330 Blog</h1>

<p align="center">
  一个现代化的全栈博客系统前端，Monorepo 架构，含用户端博客和管理后台。<br/>
  深度集成 AI 写作助手，暗色主题，SSR 服务端渲染。
</p>

<p align="center">
  <b>🏠 博客地址：</b><a href="https://www.cx330.cloud" target="_blank">https://www.cx330.cloud</a> &nbsp;|&nbsp;
  <b>🔧 后端仓库：</b><a href="https://github.com/ljt741212/blog-server" target="_blank">blog-server</a>
</p>

---

## ✨ 功能亮点

### 📝 博客（用户端）

| 模块             | 功能                                                    |
| ---------------- | ------------------------------------------------------- |
| 🏠 **首页**      | 文章列表分页、分类筛选、关键词搜索                      |
| 📄 **文章详情**  | Markdown 渲染、代码高亮、自动目录导航、评论区、点赞分享 |
| 🏷️ **分类/标签** | 按分类浏览文章，侧栏快速切换                            |
| 💬 **评论系统**  | 文章评论、回复                                          |
| 📋 **留言板**    | 访客留言，管理员可回复                                  |
| 📝 **更新日志**  | 系统更新记录展示                                        |
| 👤 **关于页面**  | 关于博客 / 关于我                                       |
| 🔗 **友情链接**  | 友链展示 + 在线申请                                     |
| 🌙 **暗色主题**  | CSS 变量驱动的深色主题，蓝紫粉渐变配色                  |
| 🔍 **SEO**       | SSR + 动态 generateMetadata                             |
| 📡 **RSS**       | 自动生成 RSS 订阅源                                     |
| ❄️ **特效**      | 雪花特效、悬浮快捷面板                                  |

### 🤖 AI 写作助手（管理后台）

| 功能            | 说明                                           |
| --------------- | ---------------------------------------------- |
| ✏️ **AI 续写**  | 选中文字或光标位置，AI 自动续写，保持风格一致  |
| ✨ **AI 润色**  | 打磨句式，让表达更清晰流畅                     |
| 📝 **生成摘要** | 自动提取文章核心内容，180 字以内               |
| 💡 **标题建议** | 根据文章内容生成 5 个标题方案                  |
| 💬 **文章建议** | 全栈工程师视角 review 文章，指出改进点         |
| 🔌 **多模型**   | 支持 OpenAI / DeepSeek / Anthropic，后台可切换 |

### 🛠️ 管理后台

| 模块             | 功能                                                    |
| ---------------- | ------------------------------------------------------- |
| 📊 **数据看板**  | 核心指标可视化                                          |
| 📝 **文章管理**  | 新建/编辑/删除/草稿/发布，Markdown 编辑器 + AI 助手     |
| 👥 **用户管理**  | 注册用户管理，权限控制                                  |
| 💬 **评论管理**  | 评论审核、删除                                          |
| 🏷️ **分类/标签** | 文章分类和标签的 CRUD                                   |
| 🔗 **友链管理**  | 友情链接审核、管理                                      |
| ⚙️ **网站设置**  | 基础配置、个人资料、留言管理、更新日志、工具箱、AI 配置 |

---

## 🏗️ 技术栈

| 分类       | 技术                                                    |
| ---------- | ------------------------------------------------------- |
| **框架**   | React 19 · Next.js 16 · React Router 7                  |
| **语言**   | TypeScript 5                                            |
| **样式**   | Tailwind CSS 4 · Ant Design 6                           |
| **编辑器** | ByteMD + GFM + 代码高亮 + 数学公式 + Mermaid + 图片缩放 |
| **构建**   | Vite 6 · Turbopack                                      |
| **包管理** | pnpm 10 · Monorepo workspace                            |
| **质量**   | ESLint · Prettier · Husky · Commitlint · lint-staged    |
| **认证**   | JWT Bearer Token                                        |
| **监控**   | behaviorMonitor 自研 SDK（页面生命周期 + 行为上报）     |
| **部署**   | Docker + GitHub Actions CI/CD · Nginx                   |

---

## 📁 项目结构

```
blog-client/
├── apps/
│   ├── blog/                    # 用户端博客（Next.js 16 SSR）
│   │   └── app/
│   │       ├── page.tsx              # 首页（文章列表 + 搜索 + 分类）
│   │       ├── articles/[id]/        # 文章详情（Markdown + 目录 + 评论）
│   │       ├── messageBoard/         # 留言板
│   │       ├── changeLog/            # 更新日志
│   │       ├── aboutMe/              # 关于我
│   │       ├── friendLinks/          # 友情链接 + 申请表单
│   │       ├── rss.xml/              # RSS 订阅源（Route Handler）
│   │       ├── components/           # NavBar · Footer · 文章卡片 · 评论区 · 侧栏
│   │       │                         # Snowfall · GeometricRibbons · SuspensionPanel
│   │       ├── lib/                  # API 封装 · 请求工具 · Cookie
│   │       └── types/                # TypeScript 类型
│   │
│   └── admin/                   # 管理后台（React Router 7 SPA）
│       └── app/
│           ├── routes/
│           │   ├── home/               # 仪表盘（数据概览）
│           │   ├── data/               # 数据统计
│           │   ├── article/            # 文章管理 + 编辑页（含 AI 写作助手）
│           │   ├── user/               # 用户管理
│           │   ├── comment/            # 评论管理
│           │   ├── category/           # 分类管理
│           │   ├── tag/                # 标签管理
│           │   ├── friendLink/         # 友链管理
│           │   ├── setting/            # 基础设置 · 个人资料 · 留言 · 更新日志 · 工具 · AI 配置
│           │   └── login/              # 登录
│           ├── components/             # Layout · Loading · Logo
│           │                           # EditorAiPanel（编辑器内 AI 助手）
│           │                           # FloatingAiPanel（可拖拽浮动窗口）
│           ├── services/               # 文章 · 用户 · 评论 · 分类 · 标签 · 友链
│           │                           # AI · 编辑器AI · 访客 · 仪表盘 · 上传 · 站点配置 等
│           ├── hooks/                  # useQuery 自定义 hook
│           └── utils/                  # Cookie 工具
│
├── packages/
│   ├── ai-chat/                 # AI 聊天面板（SSE 流式 · 会话管理 · 工具调用 · 浮动/全屏模式）
│   ├── markdownEditor/          # ByteMD 编辑器和预览组件封装
│   └── behaviorMonitor/         # 访客行为监控 SDK（Rollup 构建）
│
├── deploy/
│   ├── docker-compose.yml       # 服务器容器编排
│   └── nginx-blog.conf          # Nginx 路由配置
├── Dockerfile.admin             # Admin nginx 镜像
├── Dockerfile.blog              # Blog Next.js 镜像
├── package.json                 # Monorepo 根配置
├── pnpm-workspace.yaml
└── tsconfig.json
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 20
- **pnpm** >= 10

### 安装

```bash
git clone https://github.com/ljt741212/blog-client.git
cd blog-client
pnpm install
```

### 启动

```bash
# 启动用户端博客（http://localhost:3000）
pnpm dev:blog

# 启动管理后台（http://localhost:5173/admin/）
pnpm dev:admin
```

> 两个应用通过 Vite proxy / Next.js rewrite 将 `/api` 转发到后端，默认 `http://localhost:3004`。

---

## 🔧 可用脚本

```bash
pnpm dev:blog      # 启动博客开发服务器
pnpm dev:admin     # 启动管理后台开发服务器
pnpm build         # 构建所有应用
pnpm lint          # ESLint 检查
pnpm lint:fix      # ESLint 自动修复
pnpm format        # Prettier 格式化
pnpm typecheck     # TypeScript 类型检查
```

---

## 🌍 环境变量

### Blog（`apps/blog/.env.local`）

```env
NEXT_PUBLIC_API_URL=http://localhost:3004/api
```

### Admin（`apps/admin/.env`）

```env
VITE_API_URL=http://localhost:3004/api
```

---

## 📄 许可证

ISC License

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ljt741212">linzai</a>
</p>
