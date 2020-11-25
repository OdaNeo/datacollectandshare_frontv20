const userList = require("./mock/user.json")
module.exports = {
  "publicPath": process.env.NODE_ENV === 'development' ? '/' : '/tsweb2/',
  // "publicPath":"/tsweb2/",
  "devServer": {
    port: 8080,
    open: true,
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
  "configureWebpack": {
    "devtool": "source-map"
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
