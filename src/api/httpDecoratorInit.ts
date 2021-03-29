import RequestData from './index'
import { headerObj } from '../type/http-request.type'
import { BASE_REQUEST_TIME_OUT } from '../../config'
class Init {
  // public static requestData: RequestData
  // public static httpAll:HttpAll
  // 超时默认60000
  public httpRequestInit(timeout = BASE_REQUEST_TIME_OUT, headers?: Array<headerObj>): RequestData {
    return new RequestData(headers || [], timeout)
  }
}
export default Init
