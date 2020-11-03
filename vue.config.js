const userList = require("./mock/user.json")
module.exports = {
  //"publicPath":"/tsweb2/",
  "devServer": {
    // host:'192.168.59.192',
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
