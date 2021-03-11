# tctdatacenter

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 3.0 重构计划

1. ~~topicList 页面代码重构，去除冗余代码 1 天 !~~
2. ~~cmdList videoList 页面创建主题代码重构 1 天 !~~
3. ~~http 接口是否可用 1 天 !~~
4. ~~所有删除按钮添加弹框提示，打包 bundle 文件大小优化 1 天~~
5. ~~eslint（代码风格、缩进）~~、自动部署、~~版本控制、线上查看版本添加 ? 天~~
6. ~~解耦 formobj~~
7. ~~form 结构
   dialog(v-modal, prop(title,btn), form-slots(for headers-form), auto renew provider/reject, dynamic create form/provider)~~
8. ~~统一非空校验~~
9. ~~更人性化的搜索体验~~
10. ~~table 添加 loading 图~~
11. ~~topicTable 类型优化~~
12. ~~统一的空数据表示（null || data.length===0 || list.length===0）~~
13. ~~实时主题 统计~~
14. ~~搜索体验优化~~
15. ~~侧边栏根据路由表排序~~
16. rest protobuf 文件上传方式创建主题 文件示例
17. ~~首页登陆以及搜索框支持 Enter~~
18. this.formProvide.title 修改

## 常见问题

- 新增接口后 需要在权限管理处进行配置 否则会报错 401 身份验证失败
- 后端接口配置在 src/config.ts > VUE_APP_BASE_API
- 页面左侧菜单栏顺序 配置在 src/router/index.ts > routes, 可同时修改一级列表和二级列表顺序，不依赖后端 callback 顺序
- 线上查看 git 版本页面 /private/bulkCreateTopic
