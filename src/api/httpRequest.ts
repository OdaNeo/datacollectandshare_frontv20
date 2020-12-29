import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import RequestHelper from './requestHelper'
import { rootStoreModule } from '../store/modules/root'
import { httpAllParams, returnDataType } from '../type/http-request.type'
import alertUtil from '../utils/alertUtil'

type headerObj = {
  headerKey: string,
  headerVal: string|number
}

class HttpRequest {
  private axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 500000,
    headers: {
      post: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  })
  private requestHelper: RequestHelper = new RequestHelper(this.axiosIns)
  constructor(headers:Array<any>) {
    this.axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
      if (headers.length > 0) {
        headers.forEach((header:headerObj) => {
          config.headers[header.headerKey] = header.headerVal
        })
      } else {
        config.headers['Authorization'] = rootStoreModule.UserState.token
      }
      //config.headers["x-auth-token"] = 1234
      return config
    })

    this.axiosIns.interceptors.response.use(({ data }: AxiosResponse) => {
      try {
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    })
  }

  public get = async <T>(url: string, data: T, callback: Function) => {
    const response: returnDataType = await this.requestHelper.getFun<T>(url, data)
    this.codeType(response, callback)
  }

  public post = async <T>(url: string, data: T, callback: Function) => {
    const response: returnDataType = await this.requestHelper.postFun<T>(url, data)
    this.codeType(response, callback)
  }

  public put = async <T>(url: string, data: T, callback: Function) => {
    const response: returnDataType = await this.requestHelper.putFun<T>(url, data)
    this.codeType(response, callback)
  }

  public all = async <T extends httpAllParams>(data: Array<T>, callback: Function) => {
    const response: Array<returnDataType> = await this.requestHelper.allFun<T>(data)
    this.codeType(response, callback)
  }

  private codeType(response: Array<returnDataType> | returnDataType, callback: Function) {
    let code: number = 0
    let message: string = ''
    if (Array.isArray(response)) {
      code = response[0].code
      message = response[0].message
    } else {
      code = response['code']
      message = response['message']
    }
    switch (code) {
      case 200:
        callback(response)
        break

      default:
        alertUtil.open('错误代码：' + code + '，错误信息：' + message, true, 'error')
        break
    }
  }
}

export default HttpRequest
