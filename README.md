# Blog Client

<p align="center">
  博客系统前端项目 - 基于 Monorepo 架构的现代化前端应用
</p>

## 项目简介

这是一个基于 Monorepo 架构的博客系统前端项目，使用 pnpm workspace 管理多个应用和共享包。项目包含用户端博客应用和管理后台应用，采用现代化的前端技术栈，提供完整的博客功能和管理功能。

## 项目结构

```
client/
├── apps/                    # 应用目录
│   ├── blog/               # 博客前端应用（Next.js）
│   └── admin/              # 管理后台应用（React Router）
├── packages/                # 共享包目录
│   ├── behaviorMonitor/    # 行为监控 SDK
│   └── markdownEditor/     # Markdown 编辑器组件
├── package.json            # 根 package.json
├── pnpm-workspace.yaml     # pnpm workspace 配置
├── tsconfig.json           # TypeScript 配置
└── README.md
```

## 技术栈

### 核心框架
- **React** ^19.2.3 - UI 框架
- **TypeScript** ^5.3.3 - 类型系统
- **Next.js** ^16.1.1 - 博客应用框架（SSR/SSG）
- **React Router** ^7.10.1 - 管理后台路由框架

### UI 框架与样式
- **Ant Design** ^6.1.3 - UI 组件库
- **Tailwind CSS** ^4.1.6 - 原子化 CSS 框架
- **@ant-design/icons** ^6.1.0 - 图标库
- **@ant-design/plots** ^2.6.8 - 数据可视化

### Markdown 编辑
- **bytemd** ^1.21.0 - Markdown 编辑器核心
- **@bytemd/react** ^1.21.0 - React 封装
- **@bytemd/plugin-gfm** - GitHub Flavored Markdown 支持
- **@bytemd/plugin-highlight** - 代码高亮
- **@bytemd/plugin-math** - 数学公式支持
- **@bytemd/plugin-medium-zoom** - 图片缩放
- **highlight.js** ^11.10.0 - 代码高亮库
- **katex** ^0.16.11 - 数学公式渲染

### 工具库
- **dayjs** ^1.11.13 - 日期处理
- **lodash-es** ^4.17.21 - 工具函数库
- **clsx** ^2.1.1 - 条件类名工具

### 开发工具
- **pnpm** ^10.6.3 - 包管理器
- **ESLint** ^8.57.0 - 代码检查
- **Prettier** ^3.2.5 - 代码格式化
- **Husky** ^9.0.11 - Git hooks
- **lint-staged** ^15.2.2 - 暂存文件检查
- **@commitlint/cli** ^19.8.1 - Commit 信息规范

## 应用说明

### Blog 应用（用户端）

基于 Next.js 16 构建的博客前端应用，提供完整的博客浏览功能。

#### 主要功能
- ✅ **文章列表** - 分页展示文章列表，支持搜索
- ✅ **文章详情** - 文章详情页，支持 Markdown 渲染
- ✅ **文章分类** - 按分类浏览文章
- ✅ **评论系统** - 文章评论功能
- ✅ **留言板** - 访客留言功能
- ✅ **更新日志** - 系统更新日志展示
- ✅ **关于页面** - 关于博客、关于我等页面
- ✅ **SEO 优化** - 服务端渲染，SEO 友好
- ✅ **响应式设计** - 适配移动端和桌面端

#### 技术特点
- 使用 Next.js App Router
- 服务端渲染（SSR）和静态生成（SSG）
- 支持暗色/亮色主题切换
- Tailwind CSS 样式系统

#### 启动方式
```bash
pnpm dev:blog
# 或
cd apps/blog
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

### Admin 应用（管理后台）

基于 React Router 7 构建的管理后台应用，提供完整的博客管理功能。

#### 主要功能
- ✅ **仪表盘** - 数据统计和可视化
- ✅ **用户管理** - 用户列表、创建、编辑、删除
- ✅ **文章管理** - 文章列表、创建、编辑、删除、状态管理
- ✅ **评论管理** - 评论审核和管理
- ✅ **分类管理** - 文章分类管理
- ✅ **标签管理** - 文章标签管理
- ✅ **网站设置** - 基础设置、个人资料、留言管理、更新日志、工具

#### 技术特点
- 使用 React Router 7 进行路由管理
- 服务端渲染（SSR）支持
- Ant Design 组件库
- 完整的权限控制和认证

#### 启动方式
```bash
pnpm dev:admin
# 或
cd apps/admin
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

## 共享包说明

### behaviorMonitor

行为监控 SDK，用于追踪用户行为。

- **构建工具**: Rollup
- **输出格式**: CJS、ESM、UMD
- **用途**: 用户行为数据收集和分析

### markdownEditor

Markdown 编辑器组件包，基于 ByteMD 构建。

- **核心库**: ByteMD
- **功能**: 支持 GFM、代码高亮、数学公式、图片缩放等
- **用途**: 在管理后台中用于文章编辑

## 快速开始

### 系统要求

- Node.js >= 16.x
- pnpm >= 8.x

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd Blog-project/client
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动开发服务器**

```bash
# 启动博客应用
pnpm dev:blog

# 启动管理后台
pnpm dev:admin
```

## 可用脚本

### 根目录脚本

```bash
# 开发
pnpm dev:blog          # 启动博客应用开发服务器
pnpm dev:admin         # 启动管理后台开发服务器

# 构建
pnpm build             # 构建所有应用
pnpm build:blog        # 构建博客应用
pnpm build:admin       # 构建管理后台

# 代码质量
pnpm lint              # 运行 ESLint 检查
pnpm lint:fix          # 运行 ESLint 并自动修复
pnpm format            # 格式化代码（Prettier）
pnpm typecheck         # 类型检查（仅 admin）

# Git hooks
pnpm prepare           # 初始化 Husky
```

### Blog 应用脚本

```bash
cd apps/blog

pnpm dev               # 启动开发服务器
pnpm build             # 构建生产版本
pnpm start             # 启动生产服务器
pnpm lint              # 代码检查
```

### Admin 应用脚本

```bash
cd apps/admin

pnpm dev               # 启动开发服务器
pnpm build             # 构建生产版本
pnpm start             # 启动生产服务器
pnpm typecheck         # 类型检查
```

## 代码规范

项目遵循统一的代码规范：

### 格式化规则

- **单引号** - 字符串使用单引号
- **分号** - 语句末尾使用分号
- **缩进** - 2 个空格
- **行宽** - 100 字符
- **尾逗号** - ES5 兼容模式
- **箭头函数** - 单参数时省略括号

### 导入顺序

1. React
2. 第三方库（按字母序）
3. 内部别名（@/、~/）
4. 父级/兄弟/index
5. type 导入

各组之间空一行，组内按字母序排列。

### 路径别名

- `@/` - 应用根目录
- `~/` - 应用根目录（备用）
- `@components/*` - 组件目录
- `@markdownEditor/*` - Markdown 编辑器包

**注意**: 禁止使用 `../` 跨多级引用，应使用路径别名。

### 未使用变量

以 `_` 开头的参数或变量视为有意忽略，不会报未使用警告。

## 项目配置

### TypeScript 配置

项目使用统一的 `tsconfig.json` 配置，支持：
- 严格模式
- 路径别名解析
- 增量编译
- 声明文件生成

### ESLint 配置

- 使用 TypeScript ESLint 插件
- 支持 React Hooks 规则
- 导入顺序检查
- 禁止相对路径跨级引用

### Prettier 配置

统一的代码格式化规则，确保代码风格一致。

### Git Hooks

使用 Husky 和 lint-staged 进行：
- 提交前代码格式化
- 提交前 ESLint 检查
- Commit 信息规范检查

## 开发指南

### 添加新功能

1. **在 Blog 应用中添加页面**

```bash
cd apps/blog
# 在 app/ 目录下创建新的路由文件
```

2. **在 Admin 应用中添加路由**

```bash
cd apps/admin
# 在 app/routes/ 目录下创建新的路由文件
# 在 app/routes.ts 中注册路由
```

3. **创建共享组件**

```bash
# 在 packages/ 目录下创建新的包
# 或直接在应用中使用 @/ 别名引用组件
```

### 使用共享包

在应用中使用 workspace 包：

```json
{
  "dependencies": {
    "behaviorMonitor": "workspace:*",
    "markdownEditor": "workspace:*"
  }
}
```

### API 集成

两个应用都需要与后端 API 集成：

- Blog 应用：调用后端 API 获取文章、评论等数据
- Admin 应用：调用后端 API 进行 CRUD 操作

确保后端服务已启动并配置正确的 API 地址。

## 构建与部署

### 开发环境构建

```bash
# 构建所有应用
pnpm build

# 构建单个应用
pnpm build:blog
pnpm build:admin
```

### 生产环境部署

#### Blog 应用（Next.js）

```bash
cd apps/blog
pnpm build
pnpm start
```

Next.js 应用可以部署到：
- Vercel（推荐）
- 自托管 Node.js 服务器
- Docker 容器

#### Admin 应用（React Router）

```bash
cd apps/admin
pnpm build
pnpm start
```

React Router 应用可以部署到：
- Node.js 服务器
- Docker 容器
- 支持 SSR 的平台（AWS、GCP、Azure 等）

### Docker 部署

Admin 应用包含 Dockerfile，可以使用 Docker 部署：

```bash
cd apps/admin
docker build -t blog-admin .
docker run -p 3000:3000 blog-admin
```

## 环境变量

### Blog 应用

需要在 `apps/blog/.env.local` 中配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:3004/api
```

### Admin 应用

需要在 `apps/admin/.env` 中配置：

```env
API_URL=http://localhost:3004/api
```

## 常见问题

### 1. pnpm 安装失败

确保使用正确的 pnpm 版本：

```bash
corepack enable
corepack prepare pnpm@10.6.3 --activate
```

### 2. 类型错误

运行类型检查：

```bash
pnpm typecheck
```

### 3. 构建失败

清理缓存并重新安装：

```bash
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### 4. 路径别名不生效

检查 `tsconfig.json` 中的 `paths` 配置，确保与应用的路由配置一致。

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 UNLICENSED 许可证。

## 作者

linzai

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [React Router 文档](https://reactrouter.com/)
- [Ant Design 文档](https://ant.design/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [ByteMD 文档](https://bytemd.js.org/)
- [pnpm 文档](https://pnpm.io/)
