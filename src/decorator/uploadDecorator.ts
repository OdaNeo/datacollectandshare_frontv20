import { VueConstructor } from 'vue'
import HttpInit from '../api/httpDecoratorInit'
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

const upload = (Vue: VueConstructor): void => {
  Vue.prototype['h_upload'] = new HttpInit().httpRequestInit(header)
}

export default upload
