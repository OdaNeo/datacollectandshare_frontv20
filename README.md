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
7. ~~form 结构 dialog(v-modal, prop(title,btn), form-slots(for headers-form), auto renew provider/reject, dynamic create form/provider)~~
8. ~~上传文件校验 文件名重复~~
9. ~~统一非空校验~~
10. ~~更人性化的搜索体验~~
11. ~~table 添加 loading 图~~
12. ~~topicTable 类型优化~~
13. ~~统一的空数据表示（null || data.length===0 || list.length===0）~~
14. ~~实时主题 统计~~
15. ~~搜索体验优化~~
16. ~~侧边栏根据路由表排序~~
17. rest protobuf sql 文件上传方式创建主题 文件示例
18. ~~首页登陆以及搜索框支持 Enter~~
19. ~~this.formProvide.title 优化（区分修改和创建）~~
20. ~~h-table 动态设置 header（需要新字段） 已在统一运维平台实现~~
21. ~~监控日志页面 重构 (考虑手撕)~~
22. ~~日志主题创建 loading 图优化，改的不那么浮夸~~
23. ~~实时数据监控：仅显示一天内的数据，纵轴显示作业 ID ( 有分类 )，横轴按照作业起止时间实时显示数据流速度，（视频 ：视频流速度；事务、日志：数据读写速度）~~
24. ~~去掉面包屑~~
25. add e2e test
26. ~~multi-checkbox 组件构建~~
27. ~~文件下载动画，浏览器自带~~
28. ~~作业监控页面 data-zoom 优化~~
29. ~~视频监控页面修改~~
30. ~~视频搜索页面loading~~
31. ~~火狐隐藏滚轮~~
32. ~~表格最小宽度设定~~
33. ~~首页loading， 首页加载速度优化， 削减请求数量， 目前有7个请求~~
34. ~~icon-font 改 svg~~
35. 资源管理 新添权限切换 bug-fix
36. 侧边栏样式构建
37. ~~作业监控轮询 权限bugfix~~
38. 字段名 noRepeatKey 提示优化
39. 如果表单内没有修改，禁止提交
40. 使用 非prop $attr，抽象表单内组件
41. ~~实时监控自动延长x轴可视区域~~
42. 事务数据启停重跑后查看日志
43. ~~500 错误码拦截~~
44. ~~http请求重写，合并整合上传文件的逻辑~~
45. ~~统一http超时、权限、断网等错误处理，与现有业务报错逻辑整合~~
46. 生产环境错误上报
47. ~~REQUEST_NAME_TYPE 类型校验~~
48. 主题名未开始验证要阻止提交
49. HConfirm 重构
50. 刷新logout 会重置session?
51. H_Vue 类型修改
52. 主题名创建重复bug fix
53. ~~button 添加loading（附加信息）~~
54. Body示例整合？

## 常见问题

- 新增接口后 需要在权限管理处进行配置 否则会报错 401 身份验证失败
- 后端接口配置在 src/config.ts > VUE_APP_BASE_API
- 页面左侧菜单栏顺序 配置在 src/router/index.ts > routes, 可同时修改一级列表和二级列表顺序，不依赖后端 callback 顺序
- 线上查看 git 版本页面 /private/bulkCreateTopic
