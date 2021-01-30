import { VueConstructor } from 'vue'
import HttpInit from '../api/httpDecoratorInit'
import { headerObj } from '../type/http-request.type'

const upload = (header: Array<headerObj>) => {
  return (Vue: VueConstructor): void => {
    Vue.prototype['h_upload'] = new HttpInit().httpRequestInit(header)
  }
}
export default upload
