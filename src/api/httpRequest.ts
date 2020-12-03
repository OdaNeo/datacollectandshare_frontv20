import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import RequestHelper from './requestHelper'
import { rootStoreModule } from '../store/modules/root'
import { httpAllParams, returnDataType } from '../type/http-request.type'
import alertUtil from '../utils/alertUtil'

class HttpRequest {
  private axiosIns: AxiosInstance = axios.create({
    baseURL: 'http://112.126.65.241:9002', // 测试环境
    // baseURL: "http://192.168.62.13:9000",
    //baseURL: "http://172.16.1.111:9000",
    //baseURL: "http://192.168.62.84:9000",
    // baseURL: "http://192.168.60.214:9002/", // 郝帅本地服务
    // baseURL: 'http://192.168.59.65:9002',
     //baseURL: 'http://192.168.57.136:9002',
    timeout: 500000,
    headers: {
      post: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  })
  private requestHelper: RequestHelper = new RequestHelper(this.axiosIns)
  constructor() {
    // this.axiosIns.defaults.baseURL = "http://localhost:9000"
    // this.axiosIns.defaults.timeout = 10000
    // this.axiosIns.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8"
    this.axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers['Authorization'] = rootStoreModule.UserState.token
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
