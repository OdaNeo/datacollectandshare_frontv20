/* eslint-disable @typescript-eslint/no-var-requires */
// const userList = require('./mock/user.json')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

// 生产环境版本号
// 版本号 3.[月份].[自增打包次数]，自增打包次数每月一日重置
if (process.env.NODE_ENV === 'production' && !process.env.VUE_APP_NINJA_CAT) {
  const fs = require('fs')
  const packageJSON = require('./package.json')

  const date = new Date().getMonth() + 1
  const day = new Date().getDate()
  const _version = Number(packageJSON.version.split('.')[2])

  const times = day === 1 && _version !== 1 ? 0 : _version

  packageJSON.version = `3.${date}.${times + 1}`

  //同步写入package.json文件
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2))
}

module.exports = {
  // publicPath:"/tsweb2/",
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    port: 8080,
    open: true
    // proxy: {
    //   '/': {
    //     target: 'http://192.168.60.214:8080',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/': '/'
    //     }
    //   }
    // }
    // before(app){
    //   app.post("/user/findAllUser",(req,res,next)=>{
    //     res.json(userList)
    //   })
    // }
  },
  transpileDependencies: ['vuetify'],
  // 生产环境去掉console和注释，开发环境启用source-map
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions = {
        compress: {
          drop_console: true // 移除console
        },
        output: {
          comments: false // 移除js中的注释
        }
      }
      config.devtool = undefined
    } else {
      config.devtool = 'cheap-module-eval-source-map'
    }
    // 添加线上环境查看git版本号
    config.plugins = config.plugins.concat([gitRevisionPlugin])
    // 解决 keepalive 失效的问题
    // config.optimization.minimizer[0].options.terserOptions.keep_fnames = true
  },
  // 配置环境变量
  chainWebpack: config => {
    //  https://github.com/vuejs/vue-cli/issues/1671
    config.plugin('define').tap(args => {
      // [ { 'process.env': { NODE_ENV: '"development"', BASE_URL: '"/"' } } ]
      args[0]['process.env']['COMMITHASH'] = JSON.stringify(gitRevisionPlugin.commithash())
      args[0]['process.env']['BRANCH'] = JSON.stringify(gitRevisionPlugin.branch())
      return args
    })
  }
}
