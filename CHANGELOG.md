# afdian-linker

## [1.4.3](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.4.2...v1.4.3) (2026-06-27)


### 🐛 Bug 修复

* **deps:** add overrides for high-severity transitive deps ([9657cba](https://github.com/CaoMeiYouRen/afdian-linker/commit/9657cba)), closes [hi#severity](https://github.com/hi/issues/severity)


### 📦 代码重构

* 优化用户验证逻辑 ([015b0b5](https://github.com/CaoMeiYouRen/afdian-linker/commit/015b0b5))
* 重构代码以提高可读性和一致性 ([a897bc0](https://github.com/CaoMeiYouRen/afdian-linker/commit/a897bc0))

## [1.4.2](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.4.1...v1.4.2) (2025-08-30)


### 🐛 Bug 修复

* **deps:** update dependency @vueuse/core to v13.7.0 ([#65](https://github.com/CaoMeiYouRen/afdian-linker/issues/65)) ([0e9b1bc](https://github.com/CaoMeiYouRen/afdian-linker/commit/0e9b1bc))
* **deps:** update dependency zod to v4.1.1 ([#67](https://github.com/CaoMeiYouRen/afdian-linker/issues/67)) ([558735a](https://github.com/CaoMeiYouRen/afdian-linker/commit/558735a))

## [1.4.1](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.4.0...v1.4.1) (2025-08-23)


### ♻ 代码重构

* **auth:** 仅在客户端初始化 Auth0，优化 Auth0 使用逻辑 ([8d39294](https://github.com/CaoMeiYouRen/afdian-linker/commit/8d39294))
* **layouts:** 优化布局组件结构和用户信息获取逻辑 ([a59bbff](https://github.com/CaoMeiYouRen/afdian-linker/commit/a59bbff))


### 🐛 Bug 修复

* **deps:** update dependency typeorm to v0.3.26 ([a5b857b](https://github.com/CaoMeiYouRen/afdian-linker/commit/a5b857b))
* **deps:** update dependency vue to v3.5.19 ([#57](https://github.com/CaoMeiYouRen/afdian-linker/issues/57)) ([e4c9308](https://github.com/CaoMeiYouRen/afdian-linker/commit/e4c9308))

# [1.4.0](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.3.0...v1.4.0) (2025-08-02)


### ♻ 代码重构

* **login:** 优化登录页面代码结构 ([e1746fb](https://github.com/CaoMeiYouRen/afdian-linker/commit/e1746fb))


### ✨ 新功能

* **profile:** 显示 OAuth ID，优化用户信息展示; 修复重定向消息编码问题 ([9be7b4b](https://github.com/CaoMeiYouRen/afdian-linker/commit/9be7b4b))


### 🐛 Bug 修复

* **dependencies:** 添加 ms 库及其类型定义，优化缓存过期时间设置 ([f7afebf](https://github.com/CaoMeiYouRen/afdian-linker/commit/f7afebf))
* **oauth:** 修复 OAuth 用户信息标准化，增加对用户名的支持; 优化配置端口设置 ([c0b3dfb](https://github.com/CaoMeiYouRen/afdian-linker/commit/c0b3dfb))

# [1.3.0](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.2.1...v1.3.0) (2025-07-26)


### ♻ 代码重构

* **app:** 调整模板结构，优化组件嵌套顺序 ([4d2c05b](https://github.com/CaoMeiYouRen/afdian-linker/commit/4d2c05b))
* **auth:** 优化第三方登录连接处理逻辑 ([5e99bc9](https://github.com/CaoMeiYouRen/afdian-linker/commit/5e99bc9))


### ✨ 新功能

* **oauth:** 添加 OAuth 2.0 支持，包含配置、登录和回调处理 ([7fb5b5f](https://github.com/CaoMeiYouRen/afdian-linker/commit/7fb5b5f))

## [1.2.1](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.2.0...v1.2.1) (2025-06-07)


### ♻ 代码重构

* **auth:** 重构重置密码流程，简化邮件发送逻辑并添加HTML转义功能 ([aa43cfe](https://github.com/CaoMeiYouRen/afdian-linker/commit/aa43cfe))
* **cache:** 重构缓存存储，复用基础 Redis 和 LRU 存储类 ([77831f4](https://github.com/CaoMeiYouRen/afdian-linker/commit/77831f4))
* **email:** 优化邮箱验证流程，简化一次性token生成逻辑 ([0f978ab](https://github.com/CaoMeiYouRen/afdian-linker/commit/0f978ab))


### 🐛 Bug 修复

* **auth:** 增强用户注册流程的邮箱验证功能 ([1759de2](https://github.com/CaoMeiYouRen/afdian-linker/commit/1759de2))

# [1.2.0](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.1.0...v1.2.0) (2025-05-17)


### ♻ 代码重构

* **auth0:** 清理无用导入，优化缓存逻辑和变量命名 ([1e9ec1a](https://github.com/CaoMeiYouRen/afdian-linker/commit/1e9ec1a))
* 增加 nuxt 测试相关配置 ([8a36405](https://github.com/CaoMeiYouRen/afdian-linker/commit/8a36405))


### ✨ 新功能

* **auth0:** 添加 Auth0 连接获取功能，优化登录体验 ([992abb5](https://github.com/CaoMeiYouRen/afdian-linker/commit/992abb5))
* **responsive:** 添加通用响应式样式，优化各页面适配手机端 ([634b7f0](https://github.com/CaoMeiYouRen/afdian-linker/commit/634b7f0))


### 🐛 Bug 修复

* **about:** 调整关于页面卡片最大宽度，优化样式适配 ([ee33453](https://github.com/CaoMeiYouRen/afdian-linker/commit/ee33453))
* **auth0:** 优化 Auth0 登录流程，改善用户体验和错误提示 ([33babc7](https://github.com/CaoMeiYouRen/afdian-linker/commit/33babc7))
* **auth0:** 修复 Auth0 初始化逻辑，确保在使用前正确设置 ([c5d0651](https://github.com/CaoMeiYouRen/afdian-linker/commit/c5d0651))
* **auth0:** 修复缓存过期时间设置，确保连接数据有效性 ([ea61914](https://github.com/CaoMeiYouRen/afdian-linker/commit/ea61914))
* **change-password:** 优化修改密码页面样式，增强响应式适配 ([061d986](https://github.com/CaoMeiYouRen/afdian-linker/commit/061d986))
* **forgot-password:** 优化忘记密码页面样式，调整卡片宽度和响应式适配 ([08a3055](https://github.com/CaoMeiYouRen/afdian-linker/commit/08a3055))
* **layout:** 修复布局样式，确保宽度适应视口 ([ab25648](https://github.com/CaoMeiYouRen/afdian-linker/commit/ab25648))
* **layout:** 修改宽度设置，避免滚动条导致溢出，增强响应式适配 ([da4dbfe](https://github.com/CaoMeiYouRen/afdian-linker/commit/da4dbfe))
* **login:** 优化登录页面样式，增强手机端响应式适配 ([1f84bd3](https://github.com/CaoMeiYouRen/afdian-linker/commit/1f84bd3))
* **login:** 修复登录页面容器宽度，确保在不同状态下适配 ([f5ded21](https://github.com/CaoMeiYouRen/afdian-linker/commit/f5ded21))
* **nuxt.config:** 忽略 SCSS 导入和遗留 JS API 的警告 ([dbcba4b](https://github.com/CaoMeiYouRen/afdian-linker/commit/dbcba4b))
* **orders:** 优化订单表格样式，增强手机端响应式适配 ([df6f803](https://github.com/CaoMeiYouRen/afdian-linker/commit/df6f803))
* **orders:** 优化订单详情页面样式，增强手机端响应式适配 ([b2edfbe](https://github.com/CaoMeiYouRen/afdian-linker/commit/b2edfbe))
* **register:** 调整注册页面样式，优化响应式适配，修复宽度设置 ([0143450](https://github.com/CaoMeiYouRen/afdian-linker/commit/0143450))
* 修复布局样式，确保在不同状态下宽度一致; 添加开发环境下的固定连接返回值 ([8559777](https://github.com/CaoMeiYouRen/afdian-linker/commit/8559777))

# [1.1.0](https://github.com/CaoMeiYouRen/afdian-linker/compare/v1.0.0...v1.1.0) (2025-05-10)


### ✨ 新功能

* 重构订单和验证码处理逻辑，添加过期订单和验证码清理功能 ([857414e](https://github.com/CaoMeiYouRen/afdian-linker/commit/857414e))
* 集成 Sentry 错误监控系统 ([c28f353](https://github.com/CaoMeiYouRen/afdian-linker/commit/c28f353))


### 🐛 Bug 修复

* **auth:** 优化认证中间件路由处理逻辑 ([8157bc6](https://github.com/CaoMeiYouRen/afdian-linker/commit/8157bc6))
* **auth:** 修复登录重定向逻辑，确保未登录用户正确跳转至登录页面 ([16bbc48](https://github.com/CaoMeiYouRen/afdian-linker/commit/16bbc48))
* **auth:** 修复重定向逻辑以正确处理登录页面路径 ([da1fca9](https://github.com/CaoMeiYouRen/afdian-linker/commit/da1fca9))
* **auth:** 修正 URL 构造和 API 请求路径匹配逻辑 ([8e4d6fe](https://github.com/CaoMeiYouRen/afdian-linker/commit/8e4d6fe))
* **deps:** 固定 import-in-the-middle 版本为 1.13.1，移除不必要的 overrides ([72e1555](https://github.com/CaoMeiYouRen/afdian-linker/commit/72e1555))
* **layout:** 添加加载状态指示器以改善用户体验 ([c293d3e](https://github.com/CaoMeiYouRen/afdian-linker/commit/c293d3e))
* **login:** 修复登录页面容器宽度设置 ([e7a4d77](https://github.com/CaoMeiYouRen/afdian-linker/commit/e7a4d77))
* **plans:** 将 channelPlanId 字段设为可选，并简化请求体解析逻辑 ([1035886](https://github.com/CaoMeiYouRen/afdian-linker/commit/1035886))
* **plans:** 调整套餐创建接口的月份验证规则 ([b7c230a](https://github.com/CaoMeiYouRen/afdian-linker/commit/b7c230a))
* **profile:** 仅当 auth0Id 存在时显示第三方账号信息 ([a76aaef](https://github.com/CaoMeiYouRen/afdian-linker/commit/a76aaef))
* **sentry:** 注释掉 Sentry 初始化代码以避免未配置 DSN 时的错误 ([bf0f240](https://github.com/CaoMeiYouRen/afdian-linker/commit/bf0f240))
* 优化按钮样式，调整订单和方案管理页面的按钮布局，增强用户体验 ([531f26e](https://github.com/CaoMeiYouRen/afdian-linker/commit/531f26e))
* 修复 docker-compose 配置和环境变量问题; 优化认证中间件逻辑 ([9bb0d7c](https://github.com/CaoMeiYouRen/afdian-linker/commit/9bb0d7c))
* 修复 Sentry 配置导出方式; 更新订单创建接口以处理产品类型的可选性 ([be4f052](https://github.com/CaoMeiYouRen/afdian-linker/commit/be4f052))
* 修复用户认证流程问题 ([2f975db](https://github.com/CaoMeiYouRen/afdian-linker/commit/2f975db))
* 将 Promise.all 替换为 Promise.allSettled，以处理所有异步操作的结果 ([a558617](https://github.com/CaoMeiYouRen/afdian-linker/commit/a558617))
* 更新路径处理逻辑以使用上下文路径; 修改数据库健康检查以使用数据源实例 ([a412b9e](https://github.com/CaoMeiYouRen/afdian-linker/commit/a412b9e))

# 1.0.0 (2025-05-03)


### ♻ 代码重构

* **api:** 优化API代码结构 ([e9f4f53](https://github.com/CaoMeiYouRen/afdian-linker/commit/e9f4f53))
* 优化管理员路由权限验证逻辑，简化错误处理流程 ([d502c6c](https://github.com/CaoMeiYouRen/afdian-linker/commit/d502c6c))
* 更新订单ID生成逻辑，使用UUID替代时间戳和随机数 ([e9305d1](https://github.com/CaoMeiYouRen/afdian-linker/commit/e9305d1))
* 重构会话管理逻辑，使用 JWT 令牌替代原有的 cookie 处理方式 ([d55b6d5](https://github.com/CaoMeiYouRen/afdian-linker/commit/d55b6d5))


### ✨ 新功能

* add Prisma setup with MySQL datasource and update TypeScript configuration ([e252a9c](https://github.com/CaoMeiYouRen/afdian-linker/commit/e252a9c))
* **afdian:** 优化Webhook处理逻辑，添加错误处理和数据库事务支持 ([56daf6a](https://github.com/CaoMeiYouRen/afdian-linker/commit/56daf6a))
* **auth:** 添加管理员登录功能，集成bcrypt进行密码验证 ([e4f0ca5](https://github.com/CaoMeiYouRen/afdian-linker/commit/e4f0ca5))
* **login:** 添加管理员登录页面，集成Vuetify和PrimeVue的Toast服务 ([f9aacb3](https://github.com/CaoMeiYouRen/afdian-linker/commit/f9aacb3))
* **prisma:** 更新 Prisma 配置，调整客户端路径和输出目录 ([991f1c1](https://github.com/CaoMeiYouRen/afdian-linker/commit/991f1c1))
* **prisma:** 添加 Prisma 客户端单例支持，集成 @prisma/nuxt ([a8b6f95](https://github.com/CaoMeiYouRen/afdian-linker/commit/a8b6f95))
* **prisma:** 添加数据库连接管理，更新订单同步和Webhook处理逻辑 ([9311673](https://github.com/CaoMeiYouRen/afdian-linker/commit/9311673))
* **prisma:** 添加用户和同步模型，更新订单和WebhookLog模型 ([0564411](https://github.com/CaoMeiYouRen/afdian-linker/commit/0564411))
* **vuetify:** 集成 Vuetify，优化应用布局和样式 ([7f4be2c](https://github.com/CaoMeiYouRen/afdian-linker/commit/7f4be2c))
* 为用户列表添加工具提示，优化ID和Auth0 ID的显示格式 ([bc89acc](https://github.com/CaoMeiYouRen/afdian-linker/commit/bc89acc))
* 为计划列表添加支付渠道和渠道方案ID的工具提示，优化显示格式 ([60833d3](https://github.com/CaoMeiYouRen/afdian-linker/commit/60833d3))
* 为订单列表中的ID、定制订单号和渠道订单号添加工具提示，优化显示格式 ([d594db4](https://github.com/CaoMeiYouRen/afdian-linker/commit/d594db4))
* 为订单列表中的ID添加工具提示，优化显示格式 ([b6db797](https://github.com/CaoMeiYouRen/afdian-linker/commit/b6db797))
* 优化 Auth0 登录流程，添加 Auth0 回调处理和用户信息同步 ([98b8fe3](https://github.com/CaoMeiYouRen/afdian-linker/commit/98b8fe3))
* 优化健康检查和创建订单的参数验证，增加字段长度限制 ([d164a91](https://github.com/CaoMeiYouRen/afdian-linker/commit/d164a91))
* 优化实体定义，添加缺失的类型和属性，确保数据一致性 ([d954f5f](https://github.com/CaoMeiYouRen/afdian-linker/commit/d954f5f))
* 优化支付渠道展示逻辑，更新订单和计划页面的支付渠道格式化 ([8e66615](https://github.com/CaoMeiYouRen/afdian-linker/commit/8e66615))
* 优化支付渠道显示，添加颜色映射功能 ([bc1ea3d](https://github.com/CaoMeiYouRen/afdian-linker/commit/bc1ea3d))
* 优化欢迎区样式；调整背景和文本阴影以提升视觉效果 ([e42f299](https://github.com/CaoMeiYouRen/afdian-linker/commit/e42f299))
* 优化用户欢迎信息，添加管理员访问管理页面的提示和按钮 ([f21851b](https://github.com/CaoMeiYouRen/afdian-linker/commit/f21851b))
* 优化登录页面布局和样式；增强用户体验 ([526a60e](https://github.com/CaoMeiYouRen/afdian-linker/commit/526a60e))
* 优化登录验证逻辑，使用 $fetch 替代 useFetch，简化状态处理 ([026cad3](https://github.com/CaoMeiYouRen/afdian-linker/commit/026cad3))
* 优化管理界面布局，调整按钮组位置，提升用户体验 ([c29b2ca](https://github.com/CaoMeiYouRen/afdian-linker/commit/c29b2ca))
* 优化订单列表显示，添加货币格式化和更新时间，增强错误提示功能 ([333259e](https://github.com/CaoMeiYouRen/afdian-linker/commit/333259e))
* 优化订单同步逻辑，添加现有订单检查，避免不必要的更新 ([e054d86](https://github.com/CaoMeiYouRen/afdian-linker/commit/e054d86))
* 优化订单数据获取逻辑，添加错误处理和状态更新；重构自动轮询功能 ([a596184](https://github.com/CaoMeiYouRen/afdian-linker/commit/a596184))
* 优化邮箱修改逻辑，添加邮箱格式和非空校验 ([7d677d3](https://github.com/CaoMeiYouRen/afdian-linker/commit/7d677d3))
* 优化邮箱验证流程，添加一次性token生成与验证逻辑 ([2d43719](https://github.com/CaoMeiYouRen/afdian-linker/commit/2d43719))
* 优化错误处理，统一返回格式为createApiResponse ([160fcc6](https://github.com/CaoMeiYouRen/afdian-linker/commit/160fcc6))
* 优化首页欢迎信息样式；增强用户体验和交互性 ([bea59f6](https://github.com/CaoMeiYouRen/afdian-linker/commit/bea59f6))
* 优化验证码列表页面，添加用户信息显示及验证码类型和代码的格式化展示 ([bda38a2](https://github.com/CaoMeiYouRen/afdian-linker/commit/bda38a2))
* 修改用户实体，重命名密码字段为 password，更新数据库初始化逻辑以创建管理员用户 ([85b8bfb](https://github.com/CaoMeiYouRen/afdian-linker/commit/85b8bfb))
* 修改订单金额类型为字符串，更新订单状态处理逻辑，优化订单ID生成规则 ([ccd04be](https://github.com/CaoMeiYouRen/afdian-linker/commit/ccd04be))
* 修正邮箱验证API路径并添加SMTP配置错误处理 ([3d3ec0b](https://github.com/CaoMeiYouRen/afdian-linker/commit/3d3ec0b))
* 在侧边导航栏中调整个人中心菜单项的位置，优化用户导航体验; 更新用户昵称、邮箱和发送验证邮件的请求方法，使用useFetch 替代 $fetch ([aa19660](https://github.com/CaoMeiYouRen/afdian-linker/commit/aa19660))
* 在修改密码页面添加提示信息和忘记密码链接 ([a09e20a](https://github.com/CaoMeiYouRen/afdian-linker/commit/a09e20a))
* 在用户列表中添加邮箱验证状态和初始密码字段 ([96f7b82](https://github.com/CaoMeiYouRen/afdian-linker/commit/96f7b82))
* 在用户昵称更新功能中优化成功提示的代码格式 ([618408a](https://github.com/CaoMeiYouRen/afdian-linker/commit/618408a))
* 在登录流程中添加初始密码警告，提醒用户修改密码以增强账户安全 ([c0aed54](https://github.com/CaoMeiYouRen/afdian-linker/commit/c0aed54))
* 在订单和计划中添加关联字段，优化订单查询和创建逻辑 ([d2bf0e0](https://github.com/CaoMeiYouRen/afdian-linker/commit/d2bf0e0))
* 在订单和计划中添加商品名称和描述字段，优化订单详情展示 ([f69e612](https://github.com/CaoMeiYouRen/afdian-linker/commit/f69e612))
* 在订单管理中添加用户信息显示，优化订单详情展示 ([f15965f](https://github.com/CaoMeiYouRen/afdian-linker/commit/f15965f))
* 在订单详情弹窗中添加“查看订单”按钮，优化用户操作体验 ([48290e6](https://github.com/CaoMeiYouRen/afdian-linker/commit/48290e6))
* 实现重置密码功能，添加验证码实体及相关逻辑 ([f4b4cc3](https://github.com/CaoMeiYouRen/afdian-linker/commit/f4b4cc3))
* 导出 OrderStatus 和 UserRole，优化用户和订单实体的类型定义 ([9b5d99a](https://github.com/CaoMeiYouRen/afdian-linker/commit/9b5d99a))
* 将 cron 作业配置添加到 Vercel，以执行计划的 API 路由 ([b787512](https://github.com/CaoMeiYouRen/afdian-linker/commit/b787512))
* 引入 BaseEntity 作为基础实体，重构用户、订单和 webhook 日志实体，优化字段命名和继承结构 ([d7bb905](https://github.com/CaoMeiYouRen/afdian-linker/commit/d7bb905))
* 提交订单时增加产品类型字段，以支持更多支付渠道 ([9bd2073](https://github.com/CaoMeiYouRen/afdian-linker/commit/9bd2073))
* 更新 API 响应格式，使用 statusCode 替代 success，添加 ApiResponse 类型 ([28a037e](https://github.com/CaoMeiYouRen/afdian-linker/commit/28a037e))
* 更新 API 错误处理，增强用户反馈信息 ([ff725ac](https://github.com/CaoMeiYouRen/afdian-linker/commit/ff725ac))
* 更新 Plan 接口，支持 amount、originalAmount 和 discount 字段为字符串类型，调整商品配置 ([1b722dd](https://github.com/CaoMeiYouRen/afdian-linker/commit/1b722dd))
* 更新 PrimeVue 依赖，添加主题支持；重构 app.vue 以优化 Toast 组件的使用 ([d599859](https://github.com/CaoMeiYouRen/afdian-linker/commit/d599859))
* 更新依赖版本为1.0.5，修复订单映射逻辑中的错误 ([d9c945a](https://github.com/CaoMeiYouRen/afdian-linker/commit/d9c945a))
* 更新修改密码按钮样式；添加 elevated 变体以提升视觉效果 ([b1353c8](https://github.com/CaoMeiYouRen/afdian-linker/commit/b1353c8))
* 更新关于页面，添加项目介绍和贡献指南 ([36f4792](https://github.com/CaoMeiYouRen/afdian-linker/commit/36f4792))
* 更新密码和登录功能的错误提示时间，延长至5秒以提升用户体验 ([95966be](https://github.com/CaoMeiYouRen/afdian-linker/commit/95966be))
* 更新密码重置和找回功能，优化界面和逻辑 ([a6a3558](https://github.com/CaoMeiYouRen/afdian-linker/commit/a6a3558))
* 更新支付页面，添加支付说明和金额展示，优化订单创建逻辑 ([301126b](https://github.com/CaoMeiYouRen/afdian-linker/commit/301126b))
* 更新支持方案卡片样式，添加选中状态样式和 id 字段 ([ec4a5b1](https://github.com/CaoMeiYouRen/afdian-linker/commit/ec4a5b1))
* 更新数据库初始化逻辑，添加连接超时和最大连接数配置，优化错误处理 ([c64dfb3](https://github.com/CaoMeiYouRen/afdian-linker/commit/c64dfb3))
* 更新数据源获取逻辑，确保在未初始化时自动初始化数据库连接 ([b6a6b94](https://github.com/CaoMeiYouRen/afdian-linker/commit/b6a6b94))
* 更新方案显示逻辑，增加条件判断以优化金额展示；提交订单时使用选定方案的支付渠道和计划ID ([433fe3d](https://github.com/CaoMeiYouRen/afdian-linker/commit/433fe3d))
* 更新方案管理，优化启用状态处理逻辑，添加_enabling字段 ([1f220b8](https://github.com/CaoMeiYouRen/afdian-linker/commit/1f220b8))
* 更新用户信息获取逻辑，替换为fetchUserInfo方法，移除verifyLogin方法的调用 ([3093474](https://github.com/CaoMeiYouRen/afdian-linker/commit/3093474))
* 更新用户实体，添加 WebhookLog 实体，优化数据库配置和类型定义 ([97588f3](https://github.com/CaoMeiYouRen/afdian-linker/commit/97588f3))
* 更新用户实体，添加初始密码、初始邮箱和邮箱验证字段；优化登录响应数据 ([99731ea](https://github.com/CaoMeiYouRen/afdian-linker/commit/99731ea))
* 更新用户实体，添加初始邮箱字段，修改管理员初始化逻辑以支持初始邮箱 ([8c7da1e](https://github.com/CaoMeiYouRen/afdian-linker/commit/8c7da1e))
* 更新用户昵称和邮箱的请求方法为POST，添加邮箱验证和昵称更新的API处理逻辑 ([0bff707](https://github.com/CaoMeiYouRen/afdian-linker/commit/0bff707))
* 更新用户欢迎信息，添加前往管理页面按钮，优化路由导航 ([09844c6](https://github.com/CaoMeiYouRen/afdian-linker/commit/09844c6))
* 更新用户角色判断逻辑，使用 UserRole 常量替代硬编码字符串 ([7745bc0](https://github.com/CaoMeiYouRen/afdian-linker/commit/7745bc0))
* 更新登录和修改密码功能，统一使用 PrimeVue 的 Toast 组件显示提示信息 ([92b90b6](https://github.com/CaoMeiYouRen/afdian-linker/commit/92b90b6))
* 更新登录按钮样式；添加 elevated 变体并修改文本颜色 ([332c4e1](https://github.com/CaoMeiYouRen/afdian-linker/commit/332c4e1))
* 更新获取方案的排序选项，支持按金额和显示金额排序 ([387d930](https://github.com/CaoMeiYouRen/afdian-linker/commit/387d930))
* 更新计划相关字段类型为字符串，添加渠道方案ID和支付渠道字段 ([c2069bf](https://github.com/CaoMeiYouRen/afdian-linker/commit/c2069bf))
* 更新订单创建逻辑，调整月份限制，添加产品类型支持 ([25fd2a5](https://github.com/CaoMeiYouRen/afdian-linker/commit/25fd2a5))
* 更新顶部导航栏样式；添加图标并优化按钮布局 ([ac8dd11](https://github.com/CaoMeiYouRen/afdian-linker/commit/ac8dd11))
* 添加 AFDIAN_WEBHOOK_TOKEN 配置，更新相关环境变量和文档 ([44ed5d4](https://github.com/CaoMeiYouRen/afdian-linker/commit/44ed5d4))
* 添加 API Key 验证功能，确保请求的安全性 ([20512c4](https://github.com/CaoMeiYouRen/afdian-linker/commit/20512c4))
* 添加 ApiResponse 类型和 createApiResponse 函数，统一 API 响应格式 ([25c4d28](https://github.com/CaoMeiYouRen/afdian-linker/commit/25c4d28))
* 添加 Auth0 Id 字段到用户列表和用户接口 ([3282a11](https://github.com/CaoMeiYouRen/afdian-linker/commit/3282a11))
* 添加 Auth0 一键登录功能，优化登录流程并返回用户信息 ([d716ad7](https://github.com/CaoMeiYouRen/afdian-linker/commit/d716ad7))
* 添加 Auth0 启用条件，优化登录按钮显示逻辑 ([8e625ac](https://github.com/CaoMeiYouRen/afdian-linker/commit/8e625ac))
* 添加 Auth0 回调页面，优化登录流程和重定向逻辑 ([89755f4](https://github.com/CaoMeiYouRen/afdian-linker/commit/89755f4))
* 添加 Auth0 认证支持，新增 JWT 校验逻辑和用户注册功能 ([ae9ce7d](https://github.com/CaoMeiYouRen/afdian-linker/commit/ae9ce7d))
* 添加 blank 布局；更新登录页面样式以使用新布局 ([28c8bbc](https://github.com/CaoMeiYouRen/afdian-linker/commit/28c8bbc))
* 添加 JWT 认证和请求限流功能，优化用户登录流程 ([6ed4edf](https://github.com/CaoMeiYouRen/afdian-linker/commit/6ed4edf))
* 添加 Pinia 状态管理，创建用户状态存储并实现登录验证功能 ([1b97b1d](https://github.com/CaoMeiYouRen/afdian-linker/commit/1b97b1d))
* 添加 PrimeVue 模块支持，更新配置和依赖项 ([7f0be4e](https://github.com/CaoMeiYouRen/afdian-linker/commit/7f0be4e))
* 添加 Redis 和 LRU 缓存支持的速率限制功能 ([45ca337](https://github.com/CaoMeiYouRen/afdian-linker/commit/45ca337))
* 添加 userId 字段到 Order 实体，更新订单创建逻辑以关联用户 ([0839170](https://github.com/CaoMeiYouRen/afdian-linker/commit/0839170))
* 添加 webhook 日志页面，支持分页和数据查看功能；重构订单和用户页面以支持分页；更新类型定义 ([ba962c1](https://github.com/CaoMeiYouRen/afdian-linker/commit/ba962c1))
* 添加 webhookToken 配置，增强 webhook 验证逻辑 ([e07caa6](https://github.com/CaoMeiYouRen/afdian-linker/commit/e07caa6))
* 添加修改密码功能；更新密码验证规则，确保新密码长度至少为6位 ([c0414cb](https://github.com/CaoMeiYouRen/afdian-linker/commit/c0414cb))
* 添加修改昵称功能，优化用户信息获取逻辑 ([6d2f766](https://github.com/CaoMeiYouRen/afdian-linker/commit/6d2f766))
* 添加健康检查接口，返回服务器和数据库状态 ([9a932a9](https://github.com/CaoMeiYouRen/afdian-linker/commit/9a932a9))
* 添加公共路径白名单，优化用户认证逻辑 ([69b62b7](https://github.com/CaoMeiYouRen/afdian-linker/commit/69b62b7))
* 添加分页功能，重构订单、用户和 webhook 日志查询接口以支持分页响应 ([e838504](https://github.com/CaoMeiYouRen/afdian-linker/commit/e838504))
* 添加刷新列表按钮，优化订单管理界面 ([a40dfe1](https://github.com/CaoMeiYouRen/afdian-linker/commit/a40dfe1))
* 添加加载动画以改善用户体验，优化用户信息卡片显示逻辑 ([3c38d3d](https://github.com/CaoMeiYouRen/afdian-linker/commit/3c38d3d))
* 添加同步 Afdian 订单的功能，重构相关 API 路由以支持异步处理 ([710f1cc](https://github.com/CaoMeiYouRen/afdian-linker/commit/710f1cc))
* 添加同步爱发电订单功能，优化订单管理体验 ([0144c05](https://github.com/CaoMeiYouRen/afdian-linker/commit/0144c05))
* 添加同步爱发电订单按钮及逻辑，优化订单管理体验 ([30cd5f4](https://github.com/CaoMeiYouRen/afdian-linker/commit/30cd5f4))
* 添加商品管理链接，更新计划管理表单以支持币种选择 ([f2b03b4](https://github.com/CaoMeiYouRen/afdian-linker/commit/f2b03b4))
* 添加基础字段和工具类型，重构订单和用户类型定义 ([0fc26f0](https://github.com/CaoMeiYouRen/afdian-linker/commit/0fc26f0))
* 添加处理超时订单功能及按钮，优化订单管理体验 ([aee691d](https://github.com/CaoMeiYouRen/afdian-linker/commit/aee691d))
* 添加工具提示以改善昵称和邮箱修改按钮的用户体验 ([e99e1fc](https://github.com/CaoMeiYouRen/afdian-linker/commit/e99e1fc))
* 添加批量推送功能，支持多种推送渠道并记录新订单通知 ([9c40a61](https://github.com/CaoMeiYouRen/afdian-linker/commit/9c40a61))
* 添加找回密码和重置密码功能，包括前端页面和后端API ([637ff26](https://github.com/CaoMeiYouRen/afdian-linker/commit/637ff26))
* 添加支付渠道和渠道方案ID字段，更新相关表单和API ([4272c03](https://github.com/CaoMeiYouRen/afdian-linker/commit/4272c03))
* 添加支付渠道格式化功能，优化订单展示 ([2afee84](https://github.com/CaoMeiYouRen/afdian-linker/commit/2afee84))
* 添加支付表单组件，支持选择支持方案和留言功能，优化订单提交逻辑 ([2cb769e](https://github.com/CaoMeiYouRen/afdian-linker/commit/2cb769e))
* 添加数据库连接和数据源管理功能，集成订单和用户实体 ([d0a843f](https://github.com/CaoMeiYouRen/afdian-linker/commit/d0a843f))
* 添加方案管理功能，包括方案列表、创建、编辑和删除操作 ([ab51b50](https://github.com/CaoMeiYouRen/afdian-linker/commit/ab51b50))
* 添加权限验证，确保只有管理员可以访问订单同步接口 ([cb8052e](https://github.com/CaoMeiYouRen/afdian-linker/commit/cb8052e))
* 添加清理无效验证码功能，支持一键清理并反馈清理结果 ([b0c68eb](https://github.com/CaoMeiYouRen/afdian-linker/commit/b0c68eb))
* 添加用户个人资料页面和路由中间件，优化用户认证流程 ([36b1967](https://github.com/CaoMeiYouRen/afdian-linker/commit/36b1967))
* 添加用户和 webhook 日志查询功能，重构相关查询逻辑和参数验证 ([64f5d07](https://github.com/CaoMeiYouRen/afdian-linker/commit/64f5d07))
* 添加用户和订单的基础接口及枚举，重构相关类型定义 ([4e5f0fc](https://github.com/CaoMeiYouRen/afdian-linker/commit/4e5f0fc))
* 添加用户密码修改功能，包含前端表单和后端验证逻辑 ([71ed080](https://github.com/CaoMeiYouRen/afdian-linker/commit/71ed080))
* 添加用户注册功能，包含表单验证和邮箱验证邮件发送 ([bf591e1](https://github.com/CaoMeiYouRen/afdian-linker/commit/bf591e1))
* 添加用户登录验证功能，支持获取用户信息并处理未登录状态 ([772142a](https://github.com/CaoMeiYouRen/afdian-linker/commit/772142a))
* 添加用户管理和Webhook日志页面，整合用户和Webhook日志的API接口 ([046b475](https://github.com/CaoMeiYouRen/afdian-linker/commit/046b475))
* 添加用户身份验证，确保用户只能查询自己的订单；更新订单查询逻辑以支持 userId 参数 ([1c47353](https://github.com/CaoMeiYouRen/afdian-linker/commit/1c47353))
* 添加用户邮箱验证状态到登录响应 ([13ad566](https://github.com/CaoMeiYouRen/afdian-linker/commit/13ad566))
* 添加登录限流和输入验证，优化用户注册流程 ([60053fc](https://github.com/CaoMeiYouRen/afdian-linker/commit/60053fc))
* 添加短文本格式化工具函数，并在用户和验证码列表中应用 ([6d7b05e](https://github.com/CaoMeiYouRen/afdian-linker/commit/6d7b05e))
* 添加管理员密码和邮箱配置到示例环境变量文件 ([20f9581](https://github.com/CaoMeiYouRen/afdian-linker/commit/20f9581))
* 添加计划查询功能，支持分页和过滤条件 ([fbe26c2](https://github.com/CaoMeiYouRen/afdian-linker/commit/fbe26c2))
* 添加计划查询接口，支持分页和参数验证 ([cbc6f97](https://github.com/CaoMeiYouRen/afdian-linker/commit/cbc6f97))
* 添加计划查询接口，支持加载状态和错误处理 ([555e2b2](https://github.com/CaoMeiYouRen/afdian-linker/commit/555e2b2))
* 添加计划管理API，包括创建、更新、删除和查询功能 ([84f1897](https://github.com/CaoMeiYouRen/afdian-linker/commit/84f1897))
* 添加订单元数据处理，优化订单创建和Webhook处理逻辑 ([bea7ab2](https://github.com/CaoMeiYouRen/afdian-linker/commit/bea7ab2))
* 添加订单创建功能，支持参数验证和支付渠道处理 ([3f2c6e2](https://github.com/CaoMeiYouRen/afdian-linker/commit/3f2c6e2))
* 添加订单同步功能，支持分页和每页数量配置 ([e42a51a](https://github.com/CaoMeiYouRen/afdian-linker/commit/e42a51a))
* 添加订单查询功能，支持分页、状态和时间范围过滤 ([14da489](https://github.com/CaoMeiYouRen/afdian-linker/commit/14da489))
* 添加订单查询功能，支持分页和筛选条件，优化订单数据处理逻辑 ([c5f93d8](https://github.com/CaoMeiYouRen/afdian-linker/commit/c5f93d8))
* 添加订单详情弹窗，优化订单查看体验 ([12f1d59](https://github.com/CaoMeiYouRen/afdian-linker/commit/12f1d59))
* 添加订单详情页面，支持显示订单信息和状态自动更新 ([e9fa6df](https://github.com/CaoMeiYouRen/afdian-linker/commit/e9fa6df))
* 添加订单页面，展示订单列表及详情弹窗，优化用户体验 ([fddcef5](https://github.com/CaoMeiYouRen/afdian-linker/commit/fddcef5))
* 添加返回首页按钮，优化管理页面用户体验 ([01d5016](https://github.com/CaoMeiYouRen/afdian-linker/commit/01d5016))
* 添加邮箱验证功能，优化用户信息管理逻辑 ([97b1d30](https://github.com/CaoMeiYouRen/afdian-linker/commit/97b1d30))
* 添加邮箱验证成功页面，更新邮箱验证回调逻辑，调整用户状态管理 ([5ec0d2d](https://github.com/CaoMeiYouRen/afdian-linker/commit/5ec0d2d))
* 添加限流功能以防止频繁请求，优化密码重置逻辑 ([239bb04](https://github.com/CaoMeiYouRen/afdian-linker/commit/239bb04))
* 添加限流功能以防止频繁请求，增强安全性 ([a48338b](https://github.com/CaoMeiYouRen/afdian-linker/commit/a48338b))
* 添加验证码列表页面及相关API，优化管理员权限检查 ([e468210](https://github.com/CaoMeiYouRen/afdian-linker/commit/e468210))
* 添加验证码清理功能，删除已过期或已使用的验证码 ([5f4e383](https://github.com/CaoMeiYouRen/afdian-linker/commit/5f4e383))
* 登录成功后验证用户登录状态 ([995a453](https://github.com/CaoMeiYouRen/afdian-linker/commit/995a453))
* 登录页和注册页添加互相跳转的按钮 ([fbe5148](https://github.com/CaoMeiYouRen/afdian-linker/commit/fbe5148))
* 移除各个认证和用户相关路由的登录限流逻辑，并添加全局请求频率限制中间件 ([e13362c](https://github.com/CaoMeiYouRen/afdian-linker/commit/e13362c))
* 统一实体文件名为小写，更新相关导入路径 ([05af4d4](https://github.com/CaoMeiYouRen/afdian-linker/commit/05af4d4))
* 调整卡片样式；将 elevation 从 3 修改为 2 以提升视觉一致性 ([160fb2f](https://github.com/CaoMeiYouRen/afdian-linker/commit/160fb2f))
* 重构 Auth0 登录回调逻辑，优化用户信息同步和错误处理 ([b59352a](https://github.com/CaoMeiYouRen/afdian-linker/commit/b59352a))
* 重构 cron API 路由，删除旧文件并更新调度路径 ([b1592b4](https://github.com/CaoMeiYouRen/afdian-linker/commit/b1592b4))
* 重构实体类，添加基础接口实现；更新类型导入路径 ([baf7f3b](https://github.com/CaoMeiYouRen/afdian-linker/commit/baf7f3b))
* 重构布局结构，优化导航栏和主体内容的显示 ([4d1aa9b](https://github.com/CaoMeiYouRen/afdian-linker/commit/4d1aa9b))
* 重构数据库连接和限流逻辑，添加命名策略以支持 snake_case ([9025cd1](https://github.com/CaoMeiYouRen/afdian-linker/commit/9025cd1))
* 重构用户实体，添加密码哈希处理，更新字段命名为 camelCase ([1915283](https://github.com/CaoMeiYouRen/afdian-linker/commit/1915283))
* 重构订单、用户和Webhook日志接口，移除不必要的继承关系 ([98ea843](https://github.com/CaoMeiYouRen/afdian-linker/commit/98ea843))
* 重构订单查询逻辑，确保非管理员用户只能查询自己的订单；优化权限验证流程 ([7fbeda5](https://github.com/CaoMeiYouRen/afdian-linker/commit/7fbeda5))
* 重构订单相关逻辑，优化数据获取和格式化功能，添加状态映射和颜色映射 ([88515d5](https://github.com/CaoMeiYouRen/afdian-linker/commit/88515d5))
* 重构认证中间件，恢复用户登录和管理员权限检查逻辑 ([6bf9bb5](https://github.com/CaoMeiYouRen/afdian-linker/commit/6bf9bb5))
* 重构邮箱验证逻辑，添加成功和失败状态的重定向处理 ([c751765](https://github.com/CaoMeiYouRen/afdian-linker/commit/c751765))


### 🐛 Bug 修复

* **prisma:** 更新Order和WebhookLog模型，添加created_at和status字段的索引 ([2d4425a](https://github.com/CaoMeiYouRen/afdian-linker/commit/2d4425a))
* 优化Webhook日志记录逻辑，移除冗余保存操作 ([f87777d](https://github.com/CaoMeiYouRen/afdian-linker/commit/f87777d))
* 优化参数验证错误处理，返回详细的错误信息 ([aed48c9](https://github.com/CaoMeiYouRen/afdian-linker/commit/aed48c9))
* 优化未登录用户的请求处理逻辑，区分API请求和页面请求的重定向 ([05aef37](https://github.com/CaoMeiYouRen/afdian-linker/commit/05aef37))
* 优化注册和订单获取逻辑，增强错误处理和用户体验 ([d203d44](https://github.com/CaoMeiYouRen/afdian-linker/commit/d203d44))
* 优化登录和注册错误处理逻辑，增强用户反馈 ([f5db322](https://github.com/CaoMeiYouRen/afdian-linker/commit/f5db322))
* 优化错误处理，确保在密码更改和订单创建时抛出详细错误信息 ([fbed97c](https://github.com/CaoMeiYouRen/afdian-linker/commit/fbed97c))
* 优化错误处理，返回详细的参数验证错误信息 ([20c535d](https://github.com/CaoMeiYouRen/afdian-linker/commit/20c535d))
* 修复 package.json 中的版本号，确保正确显示 ([2004162](https://github.com/CaoMeiYouRen/afdian-linker/commit/2004162))
* 修复未登录用户重定向逻辑，确保登录页请求不被重定向 ([202ca23](https://github.com/CaoMeiYouRen/afdian-linker/commit/202ca23))
* 修复超时订单处理逻辑，调整过期时间为当前时间减去2小时 ([3189264](https://github.com/CaoMeiYouRen/afdian-linker/commit/3189264))
* 修改无效Webhook数据处理逻辑，返回成功响应而非错误 ([1c4630d](https://github.com/CaoMeiYouRen/afdian-linker/commit/1c4630d))
* 修正公共路径检查逻辑，确保路径匹配准确 ([1470f55](https://github.com/CaoMeiYouRen/afdian-linker/commit/1470f55))
* 修正订单创建参数中的metadata拼写错误为metaData ([1c9e591](https://github.com/CaoMeiYouRen/afdian-linker/commit/1c9e591))
* 在公共路径中添加健康检查 API 路径 ([07612e4](https://github.com/CaoMeiYouRen/afdian-linker/commit/07612e4))
* 在处理现有订单时保存订单金额 ([9f3afd2](https://github.com/CaoMeiYouRen/afdian-linker/commit/9f3afd2))
* 增加密码、用户名、昵称和备注字段的最大长度限制，确保数据验证更严格 ([f25abf6](https://github.com/CaoMeiYouRen/afdian-linker/commit/f25abf6))
* 更新管理员用户创建逻辑，使用环境变量设置初始密码，并添加初始密码修改标志 ([99c3209](https://github.com/CaoMeiYouRen/afdian-linker/commit/99c3209))
* 更新订单查询参数，添加更新时间排序，修复订单映射逻辑 ([00df7bc](https://github.com/CaoMeiYouRen/afdian-linker/commit/00df7bc))
* 更新订单状态刷新逻辑，增加轮询计数器和超时处理，优化手动刷新功能 ([d57b4f2](https://github.com/CaoMeiYouRen/afdian-linker/commit/d57b4f2))
* 根据环境变量动态设置 nitro 预设为 vercel 或 node-server ([4eb9aa4](https://github.com/CaoMeiYouRen/afdian-linker/commit/4eb9aa4))
* 添加 '/api/auth/register' 到白名单路径 ([11f5e95](https://github.com/CaoMeiYouRen/afdian-linker/commit/11f5e95))
* 添加 Afdian 支付渠道，支持生成支付链接和处理 webhook ([7fdaf8f](https://github.com/CaoMeiYouRen/afdian-linker/commit/7fdaf8f))
* 添加 updatedAt 字段到用户列表，重构类型定义，分离 WebhookLog 接口 ([986471a](https://github.com/CaoMeiYouRen/afdian-linker/commit/986471a))
* 添加/api/cron到公共路径列表，以支持定时任务访问 ([1d3a338](https://github.com/CaoMeiYouRen/afdian-linker/commit/1d3a338))
* 添加全局变量以支持 nuxt 和 vue 组件 ([7102f54](https://github.com/CaoMeiYouRen/afdian-linker/commit/7102f54))
* 添加注册和邮箱验证的限流机制，防止频繁请求 ([76c625d](https://github.com/CaoMeiYouRen/afdian-linker/commit/76c625d))
* 添加用户状态准备就绪标志，优化布局加载逻辑 ([dd30c95](https://github.com/CaoMeiYouRen/afdian-linker/commit/dd30c95))
* 添加管理员权限检查，恢复忘记密码按钮功能 ([5207675](https://github.com/CaoMeiYouRen/afdian-linker/commit/5207675))
* 移除 afdianPlanId 配置项，更新支付链接生成逻辑以简化配置 ([8d22c03](https://github.com/CaoMeiYouRen/afdian-linker/commit/8d22c03))
* 重构样式和类名，优化计划卡片的交互效果 ([6cfc1e3](https://github.com/CaoMeiYouRen/afdian-linker/commit/6cfc1e3))
