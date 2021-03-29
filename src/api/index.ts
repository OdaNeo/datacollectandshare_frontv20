import HttpRequest from './httpRequest'
import REQUEST_NAME from './requestName'
import { returnType, httpAllParams, headerObj } from '../type/http-request.type'

class RequestData {
  public httpRequest: HttpRequest
  constructor(headers: Array<headerObj>, timeout: number) {
    this.httpRequest = new HttpRequest(headers, timeout)
  }

  public httpGET = <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    return new Promise(resolve => {
      this.httpRequest.get<T>(url, params, (data: returnType) => {
        resolve(data)
      })
    })
  }

  public httpPOST = <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    return new Promise(resolve => {
      this.httpRequest.post<T>(url, params, (data: returnType) => {
        resolve(data)
      })
    })
  }

  public httpPUT = <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    return new Promise(resolve => {
      this.httpRequest.put<T>(url, params, (data: returnType) => {
        resolve(data)
      })
    })
  }

  public httpAll = (params: Array<httpAllParams>): Promise<returnType[]> => {
    return new Promise(resolve => {
      this.httpRequest.all<httpAllParams>(params, (data: Array<returnType>) => {
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
