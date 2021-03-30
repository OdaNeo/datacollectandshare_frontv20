import { VueConstructor } from 'vue'
import RequestData from '../api/index'

const http = (target: VueConstructor): void => {
  target.prototype.h_request = new RequestData()
}

export default http

// import { VueConstructor } from 'vue'
// import HttpInit from '../api/httpDecoratorInit'

// type httpHeader = {
//   methodName?: string
//   header?: Array<{ headerKey: string; headerVal: number }>
// }

// const http2 = (httpHeader?: httpHeader) => {
//   return (target: VueConstructor): void => {
//     if (!httpHeader || JSON.stringify(httpHeader) === '{}') {
//       target.prototype.h_request = new HttpInit().httpRequestInit()
//     } else {
//       target.prototype[httpHeader.methodName ? httpHeader.methodName : 'h_request'] = new HttpInit().httpRequestInit(
//         httpHeader.header ? httpHeader.header : []
//       )
//     }
//   }
// }

// export default http2
