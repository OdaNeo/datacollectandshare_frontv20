import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import vueProtoInstall from './plugins/vueProtoInstall'
import { rootStoreModule } from './store/modules/root'
import { Route, NavigationGuardNext } from 'vue-router'
import alertUtil from './utils/alertUtil'

const { UserState, logout } = rootStoreModule

Vue.config.productionTip = false

// Vue.use(vueProtoInstall)

Vue.directive('onlyNum', {
  bind: function (el, binding) {
    let ele: any[] | any = el.tagName === 'INPUT' ? el : el.querySelectorAll('input')
    switch (ele.length) {
      case 1:
        ele = ele[0]
        break
      case 2:
        ele = ele[1]
    }

    ele.oninput = function () {
      if (binding.value?.bool === undefined) {
        let val = ele.value
        val = val.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
        ele.value = val
        // const userID = val
        // binding.value.set[binding.value.name] = userID
      } else {
        if (binding.value.set[binding.value.bool]) {
          let val = ele.value
          val = val.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
          ele.value = val
          // const userID = val
          // binding.value.set[binding.value.name] = userID
        }
      }
    }
  }
})

router.beforeEach(
  async ({ path: toPath, name: toName, meta: toMeta }: Route, from: Route, next: NavigationGuardNext<Vue>) => {
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
