import HttpRequest from './httpRequest'
import REQUEST_NAME from './requestName'
import { returnDataType, httpAllParams, headerObj } from '../type/http-request.type'

class RequestData {
  public httpRequest: HttpRequest
  constructor(headers: Array<headerObj>) {
    this.httpRequest = new HttpRequest(headers)
  }

  public httpGET = <T>(requestName: string, params: T, ...urlArr: Array<string>): Promise<returnDataType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    return new Promise(resolve => {
      this.httpRequest.get<T>(url, params, (data: returnDataType) => {
        resolve(data)
      })
    })
  }

  public httpPOST = <T>(requestName: string, params: T, ...urlArr: Array<string>): Promise<returnDataType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    return new Promise(resolve => {
      this.httpRequest.post<T>(url, params, (data: returnDataType) => {
        resolve(data)
      })
    })
  }

  public httpPUT = <T>(requestName: string, params: T, ...urlArr: Array<string>): Promise<returnDataType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    return new Promise(resolve => {
      this.httpRequest.put<T>(url, params, (data: returnDataType) => {
        resolve(data)
      })
    })
  }

  public httpAll = (params: Array<httpAllParams>): Promise<returnDataType[]> => {
    return new Promise(resolve => {
      this.httpRequest.all<httpAllParams>(params, (data: Array<returnDataType>) => {
        resolve(data)
      })
    })
  }

  private urlFormat(url: string, urlArr: Array<string>): string {
    let u: string = url
    if (urlArr.length > 0) {
      urlArr.forEach(element => {
        u += `/${element}`
      })
    }
    return u
  }
}

export default RequestData
