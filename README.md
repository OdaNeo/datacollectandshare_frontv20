# tctdatacenter

## 生产环境
npm run build

## 测试预发布环境staging， 后端接口需要配置
npm run staging

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 常见问题

- 新增接口后 需要在权限管理处进行配置 否则会报错 401 身份验证失败

## 2.0 重构计划

1. topicList 页面代码重构，去除冗余代码 1 天 !
2. ~~cmdList videoList 页面创建主题代码重构 1 天 !~~
3. http 接口是否可用 1 天 !
4. ~~所有删除按钮添加弹框提示，打包 bundle 文件大小优化 1 天~~
5. ~~eslint（代码风格、缩进、自动部署、版本控制、线上查看版本添加 ? 天~~
6. ~~解耦 formobj~~
7. ~~form 结构 dialog(v-modal, prop(title,btn), form-slots(for headers-form), auto renew provider/reject, dynamic create form/provider)~~
8. ~~统一非空校验~~
