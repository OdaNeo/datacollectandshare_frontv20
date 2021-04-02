import { VueConstructor } from 'vue'
import RequestData from '../api/index'
import { headerObj } from '../type/http-request.type'
import { rootStoreModule } from '@/store/modules/root'

const header: Array<headerObj> = [
  {
    headerKey: 'Authorization',
    headerVal: rootStoreModule.UserState.token
  }
]

// 下载300000超时
const download = (Vue: VueConstructor): void => {
  Vue.prototype['h_download'] = new RequestData(header, { timeout: 500000, responseType: 'blob' })
}

export default download
