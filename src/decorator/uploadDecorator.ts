import { VueConstructor } from 'vue'
import RequestData from '../api/index'
import { headerObj } from '../type/http-request.type'
import { rootStoreModule } from '@/store/modules/root'

const header: Array<headerObj> = [
  {
    headerKey: 'Content-Type',
    headerVal: 'multipart/form-data'
  },
  {
    headerKey: 'Authorization',
    headerVal: rootStoreModule.UserState.token
  }
]

// 上传300000超时
const upload = (Vue: VueConstructor): void => {
  Vue.prototype['h_upload'] = new RequestData(header, { timeout: 300000 })
}

export default upload
