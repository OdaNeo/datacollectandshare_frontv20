import { VueConstructor } from 'vue';
import HttpInit from "../api/httpDecoratorInit"

const http2 = (https: Array<any>) => {
  return (target: VueConstructor) => {
    const httpInit = HttpInit.requestData
    let httpObj: { [key: string]: Function } = {}
    https.forEach((http) => {
      httpObj[http] = (params: any) => {
        return new Promise((resolve,reject) => {
          resolve(true)
        })
      }
    })
    target.prototype["h_request2"] = httpObj;
  }
}

export default http2