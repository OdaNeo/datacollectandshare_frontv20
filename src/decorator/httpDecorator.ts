import { VueConstructor } from 'vue';
import HttpInit from "../api/httpDecoratorInit"

const a = {
  h_request:HttpInit.requestData
}

const http = (target: VueConstructor): void => {
  // const {requests} = require("../assets/json/request.json")
  target.prototype["h_request"] = HttpInit.requestData;
  // target.prototype["h_request2"]
  // requests.forEach((element:any) => {
  //   target.prototype["h_request2"][`${element.method.tolocaleUpperCase()}_${element.url.tolocaleUpperCase()}`] = () => {
      
  //   }
  // });
}

export default http