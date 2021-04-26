import { rootStoreModule } from '@/store/modules/root'
import router from '@/router'

export default class authUtil {
  public static logout() {
    // 清除vuex 的状态
    rootStoreModule.logout()
    // 跳转
    router.replace({
      path: '/login'
    })
  }
}
