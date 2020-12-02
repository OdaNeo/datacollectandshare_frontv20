import { VueConstructor } from 'vue';
import HttpInit from "../api/httpDecoratorInit"

type httpHeader = {
  methodName?: string,
  header?:Array<any>  
}

const http2 = (httpHeader?:httpHeader) => {
  return (target: VueConstructor) => {
    if (!httpHeader||JSON.stringify(httpHeader)==="{}") {
      target.prototype["h_request"] = new HttpInit().httpRequestInit();
    } else {
      target.prototype[httpHeader.methodName?httpHeader.methodName:"h_request"] = new HttpInit().httpRequestInit(httpHeader.header?httpHeader.header:[]);
    }
  }
}

export default http2