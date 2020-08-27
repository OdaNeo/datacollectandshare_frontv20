import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueProtoInstall from './plugins/vueProtoInstall'
import {rootStoreModule} from './store/modules/root'
import { Route, NavigationGuardNext } from 'vue-router'

const { UserState, logout } = rootStoreModule

Vue.config.productionTip = false

Vue.use(vueProtoInstall)

router.beforeEach(async({path:toPath,name:toName}: Route, {path:formPath}: Route, next: NavigationGuardNext<Vue>) => {
  const refresh = await rootStoreModule.refresh()
  if (refresh) {
    const routeRootString = JSON.stringify(UserState.routeRoot)
    if (routeRootString.indexOf('"' + toPath + '"') !== -1) {
      next()
    } else {
      if(['/login'].indexOf(toPath)!==-1){
        logout()
        next();
      }else if (['/login'].indexOf(formPath) !== -1){
        if (toName == "welcome") {
            next();
        }else{
            next({
                path:'/statePage/welcome'
            });
        }
      }else if (['/statePage/welcome'].indexOf(toPath) !== -1) {
        next();
      }else{
        if (toName == "page404") {
            next();
        } else {
            next({
                path: '/statePage/page404'
            });
        }
      }
    }
  } else {
    if (['/login'].indexOf(toPath) !== -1) {
      next()
    } else {
      next({
        path:"/login"
      })
    }
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
