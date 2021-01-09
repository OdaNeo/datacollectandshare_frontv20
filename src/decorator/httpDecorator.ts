import { VueConstructor } from 'vue'
import HttpInit from '../api/httpDecoratorInit'

const http = (target: VueConstructor): void => {
  target.prototype.h_request = new HttpInit().httpRequestInit()
}

export default http
