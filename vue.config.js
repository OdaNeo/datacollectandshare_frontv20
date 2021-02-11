/* eslint-disable @typescript-eslint/no-var-requires */
// const userList = require('./mock/user.json')

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
  }
}
