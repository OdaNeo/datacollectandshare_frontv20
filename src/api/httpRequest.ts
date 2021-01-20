import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// import RequestHelper from './requestHelper'
import { rootStoreModule } from '../store/modules/root'
import { httpAllParams, returnDataType, headerObj } from '../type/http-request.type'
import alertUtil from '../utils/alertUtil'
import REQUEST_NAME from './requestName'
import { VUE_APP_BASE_API } from '@/config'

class HttpRequest {
  private axiosIns: AxiosInstance = axios.create({
    baseURL: VUE_APP_BASE_API,
    timeout: 500000,
    headers: {
      post: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  })

  // private requestHelper: RequestHelper = new RequestHelper(this.axiosIns)

  constructor(headers: Array<headerObj>) {
    this.axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
      if (headers.length > 0) {
        headers.forEach((header: headerObj) => {
          config.headers[header.headerKey] = header.headerVal
        })
      } else {
        config.headers.Authorization = rootStoreModule.UserState.token
      }
      // config.headers["x-auth-token"] = 1234
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

  public get = async <T>(url: string, data: T, callback: Function): Promise<void> => {
    const response: returnDataType = await this.axiosIns.get(url, {
      params: data
    })
    this.codeType(response, callback)
  }

  public post = async <T>(url: string, data: T, callback: Function): Promise<void> => {
    const response: returnDataType = await this.axiosIns.post(url, data)
    this.codeType(response, callback)
  }

  public put = async <T>(url: string, data: T, callback: Function): Promise<void> => {
    const response: returnDataType = await this.axiosIns.put(url, data)
    this.codeType(response, callback)
  }

  public all = async <T extends httpAllParams>(data: Array<T>, callback: Function): Promise<void> => {
    const httpList = data.map(
      (item: T): Promise<returnDataType> => {
        switch (item.method) {
          case 'get':
            return this.axiosIns.get(REQUEST_NAME[item.name], {
              params: item.data
            })
          case 'post':
            return this.axiosIns.post(REQUEST_NAME[item.name], item.data)
          case 'put':
            return this.axiosIns.put(REQUEST_NAME[item.name], item.data)
          default:
            return this.axiosIns.get(REQUEST_NAME[item.name], {
              params: item.data
            })
        }
      }
    )
    const response: Array<returnDataType> = await axios.all(httpList)
    this.codeType(response, callback)
  }

  private codeType(response: Array<returnDataType> | returnDataType, callback: Function) {
    let code = 0
    let message = ''
    if (Array.isArray(response)) {
      code = response[0].code
      message = response[0].message
    } else {
      code = response.code
      message = response.message
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
