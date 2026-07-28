# CX330 Blog — 部署文档

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (ubuntu-latest)                         │
│                                                         │
│  ci-admin.yml:  typecheck → build → docker build+push   │
│  ci-blog.yml:   lint → build → docker build+push        │
└──────────────────────┬──────────────────────────────────┘
                       │ docker push
                       ▼
┌──────────────────────────────────────────────────────────┐
│  阿里云 ACR (容器镜像服务)                                  │
│                                                          │
│  实例: crpi-xxx.cn-hongkong.personal.cr.aliyuncs.com      │
│  ├── blog-client/nginx    (nginx + admin 静态文件)        │
│  └── blog-client/blog     (Next.js standalone)            │
└──────────────────────┬───────────────────────────────────┘
                       │ docker pull
                       ▼
┌──────────────────────────────────────────────────────────┐
│  轻量应用服务器 (上海)                                       │
│                                                          │
│  /opt/blog-client/docker-compose.yml                     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  blog-nginx (nginx:alpine ACR)  ← port 80         │   │
│  │  ├── /admin/  → admin 静态文件                     │   │
│  │  ├── /       → blog-client:3005                   │   │
│  │  └── /api/   → blog-server:3004                   │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                         │
│  ┌──────────────▼───────────────────────────────────┐   │
│  │  blog-client (Next.js SSR ACR)  ← :3005          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  blog-server (NestJS ACR)  ← :3004               │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  blog-mysql (MySQL 8.0 ACR)  ← :3306             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  网络: blog-server_blog_network (bridge)                  │
└──────────────────────────────────────────────────────────┘
```

---

## 一、前置准备

### 1.1 基础设施

| 资源                     | 说明                                    |
| ------------------------ | --------------------------------------- |
| 阿里云容器镜像服务 (ACR) | 个人版，香港节点                        |
| 阿里云轻量应用服务器     | 上海地域，CentOS 8.2，需安装 Docker     |
| GitHub 仓库              | `github.com/<your-account>/blog-client` |

### 1.2 本地环境

- Node.js >= 20
- pnpm >= 10
- Docker（用于本地调试镜像构建）

---

## 二、ACR 镜像仓库

### 2.1 实例信息

- **实例地址**：`crpi-<instance-id>.cn-hongkong.personal.cr.aliyuncs.com`
- **命名空间**：`blog-client`
- **仓库**：

| 仓库名              | 用途                                |
| ------------------- | ----------------------------------- |
| `blog-client/nginx` | nginx + admin 静态文件 + nginx 配置 |
| `blog-client/blog`  | Next.js 16 standalone SSR 服务      |

> 使用阿里云 RAM 账号的 ACR 固定密码进行登录。个人版实例的 `docker login` 地址从控制台获取。

---

## 三、GitHub Secrets

在仓库 `Settings → Secrets and variables → Actions` 中添加以下 Secrets：

| Secret 名      | 说明                                           |
| -------------- | ---------------------------------------------- |
| `ACR_USERNAME` | 阿里云 ACR 用户名（RAM 账号全名）              |
| `ACR_PASSWORD` | ACR 固定密码                                   |
| `SSH_HOST`     | 服务器公网 IP                                  |
| `SSH_USERNAME` | 服务器 SSH 用户（通常为 `root`）               |
| `SSH_PORT`     | SSH 端口（默认 `22`）                          |
| `SSH_KEY`      | SSH 私钥内容（完整 PEM 格式，含 BEGIN/END 行） |

---

## 四、服务器初始化

以下操作在轻量应用服务器上执行一次。

### 4.1 SSH 密钥配置

将 GitHub Actions 使用的 SSH 公钥追加到 `/root/.ssh/authorized_keys`：

```bash
cat /root/.ssh/github_actions.pub >> /root/.ssh/authorized_keys
```

### 4.2 登录 ACR

```bash
docker login crpi-<instance-id>.cn-hongkong.personal.cr.aliyuncs.com
# 输入用户名和密码
```

登录凭证保存在 `/root/.docker/config.json`，docker compose 会使用此凭证拉取镜像。

### 4.3 创建部署目录并放置 docker-compose.yml

```bash
mkdir -p /opt/blog-client
```

将 `deploy/docker-compose.yml` 复制到 `/opt/blog-client/docker-compose.yml`：

```yaml
services:
  nginx:
    image: crpi-<instance-id>.cn-hongkong.personal.cr.aliyuncs.com/blog-client/nginx:latest
    container_name: blog-nginx
    restart: always
    ports:
      - '80:80'
    networks:
      - blog_network

  blog:
    image: crpi-<instance-id>.cn-hongkong.personal.cr.aliyuncs.com/blog-client/blog:latest
    container_name: blog-client
    restart: always
    expose:
      - '3005'
    environment:
      NODE_ENV: production
      PORT: '3005'
      API_URL: http://blog-server:3004/api
      NEXT_PUBLIC_API_URL: /api
    networks:
      - blog_network

networks:
  blog_network:
    name: blog-server_blog_network
    external: true
```

> **注意**：`blog_network` 是后端 `blog-server` 创建的 Docker 网络，必须使用 `external: true` 加入。确保后端项目的网络名为 `blog-server_blog_network`。

---

## 五、CI/CD 流程

推送代码到 `main` 或 `master` 分支即触发部署。也可通过 GitHub Actions 页面手动触发（`workflow_dispatch`）。

### 5.1 Admin CI/CD (`ci-admin.yml`)

**触发条件**：推送时变更涉及 `apps/admin/**`、`packages/**`、`deploy/**`、`Dockerfile.admin` 等。

```
TypeCheck → Build & Deploy
```

| 阶段         | 操作                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| typecheck    | `pnpm --filter admin typecheck`                                            |
| build        | `pnpm build:admin`（React Router SPA → 输出 `apps/admin/build/client/`）   |
| docker build | `docker build -f Dockerfile.admin` → 生成 `blog-client/nginx` 镜像         |
| docker push  | 推送至 ACR                                                                 |
| deploy       | SSH 到服务器执行 `docker compose pull nginx && docker compose up -d nginx` |

**Dockerfile.admin** 内容：

```dockerfile
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx-blog.conf /etc/nginx/conf.d/blog.conf
COPY apps/admin/build/client/ /usr/share/nginx/html/admin/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5.2 Blog CI/CD (`ci-blog.yml`)

**触发条件**：推送时变更涉及 `apps/blog/**`、`packages/**`、`Dockerfile.blog`、`deploy/**` 等。

```
Lint → Build & Deploy
```

| 阶段         | 操作                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| lint         | `pnpm --filter blog lint`                                                    |
| build        | `pnpm build:blog`（Next.js standalone → 输出 `apps/blog/.next/standalone/`） |
| docker build | `docker build -f Dockerfile.blog` → 生成 `blog-client/blog` 镜像             |
| docker push  | 推送至 ACR                                                                   |
| deploy       | SSH 到服务器执行 `docker compose pull blog && docker compose up -d blog`     |

**Dockerfile.blog** 内容：

```dockerfile
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3005
COPY apps/blog/.next/standalone ./
COPY apps/blog/.next/static ./apps/blog/.next/static
COPY apps/blog/public ./apps/blog/public
EXPOSE 3005
CMD ["node", "apps/blog/server.js"]
```

---

## 六、Nginx 路由规则

`deploy/nginx-blog.conf` 随 Admin 镜像构建打包进容器，路由规则如下：

| 路径            | 行为     | 目标                                     |
| --------------- | -------- | ---------------------------------------- |
| `/nginx-health` | 返回 200 | nginx 自身                               |
| `/admin/`       | 静态文件 | `/usr/share/nginx/html/admin/`（容器内） |
| `/api/`         | 反向代理 | `blog-server:3004`                       |
| `/`             | 反向代理 | `blog-client:3005`                       |

> Nginx 通过 Docker 容器名解析后端和 Blog 服务，无需固定 IP。

---

## 七、部署验证

部署完成后，通过以下命令在服务器上检查状态：

```bash
# 查看所有容器
docker ps -a

# 查看 nginx 日志
docker logs blog-nginx --tail 50

# 查看 blog 日志
docker logs blog-client --tail 50

# 验证各端点
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/nginx-health  # 期望 200
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/admin/         # 期望 200
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/               # 期望 200
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/api/            # 期望 200
```

确认后通过浏览器访问：

- **Blog**：`http://<服务器IP>/`
- **Admin**：`http://<服务器IP>/admin/`

---

## 八、常见问题

### Q: CI 构建成功但服务器没拉取最新镜像？

**A**: 检查服务器上的 ACR 登录状态：

```bash
docker pull crpi-<instance-id>.cn-hongkong.personal.cr.aliyuncs.com/blog-client/nginx:latest
```

如果提示未授权，重新执行 `docker login`。

### Q: 浏览器访问 502？

**A**: Blog 容器可能未启动或崩溃。检查日志：

```bash
docker logs blog-client --tail 50
```

### Q: Admin 页面加载但 API 请求失败？

**A**: 检查后端 `blog-server` 容器是否在 `blog-server_blog_network` 网络上且正常运行：

```bash
docker ps | grep blog-server
```

### Q: 域名配置？

**A**: 将域名 A 记录指向服务器公网 IP。nginx 配置中已监听所有请求，无需修改即可通过 IP 或域名访问。

### Q: HTTPS / SSL？

**A**: 当前为 HTTP。后续可在 docker-compose 中添加 Certbot 或使用阿里云 SSL 证书，修改 nginx 配置监听 443 端口即可。

---

## 九、文件清单

| 文件                             | 用途                                           |
| -------------------------------- | ---------------------------------------------- |
| `Dockerfile.admin`               | Admin-nginx 镜像构建                           |
| `Dockerfile.blog`                | Blog Next.js 镜像构建                          |
| `.github/workflows/ci-admin.yml` | Admin CI/CD 流水线                             |
| `.github/workflows/ci-blog.yml`  | Blog CI/CD 流水线                              |
| `deploy/docker-compose.yml`      | 服务器容器编排（需复制到 `/opt/blog-client/`） |
| `deploy/nginx-blog.conf`         | nginx 路由配置（随 Admin 镜像打包）            |
