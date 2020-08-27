const userList = require("./mock/user.json")
module.exports = {
  //"publicPath":"/tsweb2/",
  "devServer": {
    port: 8080,
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