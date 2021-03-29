import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { rootStoreModule } from '../store/modules/root'
import { httpAllParams, returnType, headerObj } from '../type/http-request.type'
import alertUtil from '../utils/alertUtil'
import REQUEST_NAME from './requestName'
import { VUE_APP_BASE_API } from '../../config'

class HttpRequest {
  private axiosIns: AxiosInstance = axios.create({
    baseURL: VUE_APP_BASE_API,
    headers: {
      post: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    // withCredentials: true
  })

  constructor(headers: Array<headerObj>, timeout: number) {
    this.axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
      if (headers?.length > 0) {
        // 自定义headers
        headers.forEach((header: headerObj) => {
          config.headers[header.headerKey] = header.headerVal
        })
      } else {
        // 默认发token
        config.headers['Authorization'] = rootStoreModule.UserState.token
      }
      // config.headers["x-auth-token"] = 1234
      config.timeout = timeout
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
    try {
      const response: returnType = await this.axiosIns.get(url, {
        params: data
      })
      this.codeType(response, callback)
    } catch (err) {
      this.httpErrorHandle(new Error(err), callback)
    }
  }

  public post = async <T>(url: string, data: T, callback: Function): Promise<void> => {
    try {
      const response: returnType = await this.axiosIns.post(url, data)
      this.codeType(response, callback)
    } catch (err) {
      this.httpErrorHandle(new Error(err), callback)
    }
  }

  public put = async <T>(url: string, data: T, callback: Function): Promise<void> => {
    try {
      const response: returnType = await this.axiosIns.put(url, data)
      this.codeType(response, callback)
    } catch (err) {
      this.httpErrorHandle(new Error(err), callback)
    }
  }

  public all = async <T extends httpAllParams>(data: Array<T>, callback: Function): Promise<void> => {
    const httpList = data.map(
      (item: T): Promise<returnType> => {
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

    try {
      const response: Array<returnType> = await axios.all(httpList)
      this.codeType(response, callback)
    } catch (err) {
      this.httpErrorHandle(new Error(err), callback, data)
    }
  }
  // 捕捉业务上的错误
  private codeType(response: Array<returnType> | returnType, callback: Function) {
    let code = 0
    let message = ''
    let _error: {} | Array<{}>
    if (Array.isArray(response)) {
      code = response[0].code
      message = response[0].message
      _error = response.map(() => ({}))
    } else {
      code = response.code
      message = response.message
      _error = {}
    }
    switch (code) {
      case 200:
        callback(response)
        break

      default:
        alertUtil.open('错误代码：' + code + '，错误信息：' + message, true, 'error')
        // 如果请求失败，默认返回{}
        callback(_error)
        break
    }
  }
  // 捕捉http错误
  // 超时 Error: timeout
  private httpErrorHandle(err: Error, callback: Function, data?: Array<unknown>) {
    if (err.message.includes('Network Error')) {
      // 断网 Error: Network Error
      alertUtil.open('网络错误，请检查网络连接', true, 'error')
    } else if (err.message.includes('timeout')) {
      // 超时 Error: timeout
      alertUtil.open('请求超时，请稍候再试', true, 'error')
    } else if (err.message.includes('400')) {
      // 400
      alertUtil.open('请求失败', true, 'error')
    } else if (err.message.includes('500')) {
      // 500
      alertUtil.open('服务器错误，请稍候再试', true, 'error')
    } else {
      console.log(err)
      alertUtil.open('未知错误', true, 'error')
    }
    // 统一认为请求失败
    let _error: {} | Array<{}>
    data ? (_error = data.map(() => ({}))) : (_error = {})
    // 如果请求失败，默认返回{}
    callback(_error)
  }
}

export default HttpRequest
