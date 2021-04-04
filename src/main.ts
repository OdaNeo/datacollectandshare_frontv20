import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { rootStoreModule } from './store/modules/root'
import { Route, NavigationGuardNext } from 'vue-router'
import alertUtil from './utils/alertUtil'
import VueClipboard from 'vue-clipboard2'
import './directive' // 绑定的指令
import { cancelTokenModule } from '@/store/modules/request'
const { UserState, logout } = rootStoreModule

Vue.config.productionTip = false

Vue.use(VueClipboard)

router.beforeEach(
  async ({ path: toPath, name: toName, meta: toMeta }: Route, from: Route, next: NavigationGuardNext<Vue>) => {
    // 取消上一页的请求
    cancelTokenModule.clearToken()

    if (toPath === '/login') {
      logout()
      next()
    }
    const refresh = await rootStoreModule.refresh()
    if (refresh) {
      const routeRootString = JSON.stringify(UserState.routeRoot)
      if (routeRootString.indexOf('"' + toPath + '"') !== -1) {
        next()
      } else {
        if (toName) {
          if (toMeta.access) {
            alertUtil.open('您没有权限访问' + toName + '页面', true, 'error')
            next({
              path: '/statePage/welcome'
            })
          } else {
            next()
          }
        } else {
          next({
            path: '/statePage/404'
          })
        }
        // if(['/login'].indexOf(toPath)!==-1){
        //   logout()
        //   next();
        // }else if (['/login'].indexOf(formPath) !== -1){
        //   if (toName == "welcome") {
        //       next();
        //   }else{
        //       next({
        //           path:'/statePage/welcome'
        //       });
        //   }
        // }else if (['/statePage/welcome'].indexOf(toPath) !== -1) {
        //   next();
        // }else{
        //   if (toName == "page404") {
        //       next();
        //   } else {
        //       next({
        //           path: '/statePage/page404'
        //       });
        //   }
        // }
      }
    } else {
      if (['/login'].indexOf(toPath) !== -1) {
        next()
      } else {
        next({ path: '/login' })
      }
    }
  }
)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
