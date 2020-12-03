import HttpRequest from './httpRequest';
import REQUEST_NAME from './requestName';
import { returnDataType,httpAllParams } from "../type/http-request.type"



class RequestData{
  public httpRequest: HttpRequest
  constructor(headers: Array<any>) {
    this.httpRequest = new HttpRequest(headers)
  }
  public httpGET: Function = <T = any>(requestName: string, params: T,...urlArr:Array<string>) => {
    const url = this.urlFormat(REQUEST_NAME[requestName],[...urlArr])
    return new Promise((resolve, reject) => {
      this.httpRequest.get<T>(url, params, (data: returnDataType) => {
        resolve(data)    
      })
    })
  }

  public httpPOST: Function = <T = any>(requestName: string, params: T,...urlArr:Array<string>) => {
    const url = this.urlFormat(REQUEST_NAME[requestName],[...urlArr])
    return new Promise((resolve, reject) => {
      this.httpRequest.post<T>(url, params, (data: returnDataType) => {
        resolve(data)    
      })
    })
  }

  public httpPUT: Function = <T = any>(requestName: string, params: T,...urlArr:Array<string>) => {
    const url = this.urlFormat(REQUEST_NAME[requestName],[...urlArr])
    return new Promise((resolve, reject) => {
      this.httpRequest.put<T>(url, params, (data: returnDataType) => {
        resolve(data)    
      })
    })
  }

  public httpAll:Function = (params: Array<httpAllParams>)=> {
    return new Promise((resolve, reject) => {
      this.httpRequest.all<httpAllParams>(params, (data: Array<returnDataType>) => {
        resolve(data)    
      })
    })
  }

  private urlFormat(url:string,urlArr:Array<string>):string {
    let u: string = url
    if (urlArr.length>0) {
      urlArr.forEach(element => {
        u+=`/${element}`
      });
    }
    return u
  }
}

export default RequestData;