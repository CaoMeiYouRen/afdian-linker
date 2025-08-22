<template>
    <div class="about-page  d-flex  justify-center  min-vh-100">
        <div class="about-card elevation-3 pa-8 rounded text-center">
            <h1 class="font-weight-bold mb-4 text-h4">
                关于 afdian-linker
            </h1>
            <p class="mb-4">
                <b>afdian-linker</b> 是一个基于 Nuxt 3 &amp; TypeScript 的全栈项目，集成了爱发电 API，提供统一的订单管理、赞助支付和外部查询能力。
            </p>
            <ul class="about-list mb-4">
                <li>支持多支付渠道扩展（如爱发电等）</li>
                <li>统一订单生命周期管理</li>
                <li>安全的 API 查询接口</li>
                <li>丰富的后台管理功能（订单、用户、商品、Webhook 日志等）</li>
                <li>邮箱验证、第三方登录（Auth0）、初始密码/邮箱安全提醒</li>
                <li>支持多种推送渠道（Server酱、钉钉、企业微信、邮件等）</li>
            </ul>
            <p class="mb-4">
                项目地址：
                <a
                    href="https://github.com/CaoMeiYouRen/afdian-linker"
                    target="_blank"
                    rel="noopener"
                >GitHub 仓库</a>
            </p>
            <p class="mb-4">
                作者：
                <a
                    href="https://github.com/CaoMeiYouRen"
                    target="_blank"
                    rel="noopener"
                >CaoMeiYouRen</a>
            </p>
            <p>
                欢迎提出建议或贡献代码！详细贡献指南请见
                <a
                    href="https://github.com/CaoMeiYouRen/afdian-linker/blob/master/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener"
                >CONTRIBUTING.md</a>
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.about-page {
  /* min-height: 100vh; */
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
}
.about-card {
  max-width: 530px;
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 24px 0 rgba(60,60,60,0.08);
  min-height: 500px;
  margin-top: 20px;
}
.about-list {
  display: inline-block;
  text-align: left;
  margin: 0 auto 1.5rem auto;
  padding-left: 1.2em;
}
@media (max-width: 600px) {
  .about-card {
    margin-top: 2px;
    padding: 2rem 1rem;
    max-width: 98vw;
  }
}
</style>
