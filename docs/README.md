# afdian-linker 使用说明

## 项目简介

afdian-linker 是一个基于 Nuxt 3 & TypeScript 的全栈项目，集成了爱发电 API，提供统一的订单管理、赞助支付、用户管理和外部查询能力。适用于个人或团队进行赞助管理、订单同步、Webhook 处理等场景。

## 主要功能

- 多支付渠道扩展（如爱发电、可扩展其它渠道）
- 统一订单生命周期管理（创建、支付、过期、同步等）
- 支持 Webhook 自动同步订单
- 丰富的后台管理功能（订单、用户、商品方案管理）
- 邮箱注册、登录、第三方登录（如 Auth0）
- API Key 机制，支持外部系统安全查询订单
- 支持多种推送方式（Server 酱、邮件、钉钉、企业微信、Telegram、Discord 等）
- 支持 Docker 部署

## 系统架构

- 前端：Nuxt 3 + Vue 3 + TypeScript + Vuetify
- 后端：Node.js + TypeORM + PostgreSQL
- 邮件/推送：支持多种推送服务
- 部署：支持本地、Docker、云服务器等多种方式

## 快速开始

### 1. 克隆项目

```sh
git clone https://github.com/CaoMeiYouRen/afdian-linker.git
cd afdian-linker
```

### 2. 安装依赖

```sh
npm install
# 或 yarn
# 或 pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，根据实际情况填写：

- `DATABASE_URL`：PostgreSQL 数据库连接字符串
- `JWT_SECRET`：JWT 密钥
- `AFDIAN_USER_ID`、`AFDIAN_TOKEN`：爱发电 API 配置
- `WEBHOOK_TOKEN`：Webhook 安全令牌
- 邮件推送、第三方推送等可选配置

### 4. 初始化数据库

首次运行会自动初始化数据库和管理员账号（用户名：admin，密码/邮箱见 `.env` 或默认值）。

### 5. 启动开发环境

```sh
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可。

---

## Vercel 部署

点击下方按钮一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCaoMeiYouRen%2Fafdian-linker.git)


## Docker 部署

### 1. 配置环境变量

建议使用 `.env` 文件或在 `docker-compose.yml` 中设置环境变量。

### 2. 启动服务

```sh
docker-compose up -d
```

### 3. 访问服务

默认端口为 3000，可通过 `http://<服务器IP>:3000` 访问。

---

## 常用命令

- `npm run dev`：本地开发启动
- `npm run build`：编译生产环境
- `npm run lint`：代码检查
- `npm run start`：生产环境启动

---

## API 简介

- `/api/orders`：用户订单查询
- `/api/admin/orders`：管理员订单管理
- `/api/plans`：商品方案查询
- `/api/user/info`：获取当前用户信息
- `/api/auth/login`、`/api/auth/register`：登录/注册
- `/api/afdian/webhook`：爱发电 Webhook 回调
- `/api/afdian/sync`：手动同步爱发电订单

详细接口参数请参考源码或 Swagger 文档（如有）。

---

## 常见问题

### 1. 如何修改管理员密码/邮箱？

首次启动会自动创建管理员账号，登录后可在后台修改密码和邮箱。

### 2. 邮件/推送收不到？

请检查环境变量配置，确认 SMTP/推送服务参数填写正确。

### 3. 数据库连接失败？

请确认 `DATABASE_URL` 配置正确，数据库已启动并允许连接。

---

## 贡献与支持

欢迎提交 PR、Issue 或建议！详细贡献指南见 [CONTRIBUTING.md](../CONTRIBUTING.md)。

---

如需更多帮助，请查阅主项目仓库或提交 Issue。

