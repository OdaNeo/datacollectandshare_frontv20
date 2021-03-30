import REQUEST_NAME from './requestName'
import { returnType, httpAllParams, headerObj } from '../type/http-request.type'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { rootStoreModule } from '../store/modules/root'
import alertUtil from '../utils/alertUtil'
import { VUE_APP_BASE_API, BASE_REQUEST_TIME_OUT } from '../../config'

class RequestData {
  private axiosIns: AxiosInstance = axios.create({
    baseURL: VUE_APP_BASE_API,
    headers: {
      post: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    // withCredentials: true
  })

  constructor(headers: Array<headerObj> = [], timeout: number = BASE_REQUEST_TIME_OUT) {
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
      config.timeout = timeout
      return config
    })

    this.axiosIns.interceptors.response.use(
      ({ data }: AxiosResponse) => {
        return Promise.resolve(data)
      },
      (error: AxiosError) => {
        // console.log(error.response)
        let _msg = '其他'
        if (error.message.includes('Network Error')) {
          _msg = '网络错误'
        } else if (error.message.includes('timeout')) {
          _msg = '超时'
        }
        return Promise.reject({ code: error.response?.status || _msg })
      }
    )
  }

  public httpGET = async <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    try {
      const response: returnType = await this.axiosIns.get(url, {
        params
      })
      return new Promise(resolve => {
        this.codeType(response, (data: returnType) => {
          resolve(data)
        })
      })
    } catch (err) {
      return new Promise(resolve => {
        this.httpErrorHandle(err, (data: returnType) => {
          resolve(data)
        })
      })
    }
  }

  public httpPOST = async <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    try {
      const response: returnType = await this.axiosIns.post(url, params)
      return new Promise(resolve => {
        this.codeType(response, (data: returnType) => {
          resolve(data)
        })
      })
    } catch (err) {
      return new Promise(resolve => {
        this.httpErrorHandle(err, (data: returnType) => {
          resolve(data)
        })
      })
    }
  }

  public httpPUT = async <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormat(REQUEST_NAME[requestName], [...urlArr])
    try {
      const response: returnType = await this.axiosIns.put(url, params)
      return new Promise(resolve => {
        this.codeType(response, (data: returnType) => {
          resolve(data)
        })
      })
    } catch (err) {
      return new Promise(resolve => {
        this.httpErrorHandle(err, (data: returnType) => {
          resolve(data)
        })
      })
    }
  }

  public httpAll = async <T extends httpAllParams>(params: Array<T>): Promise<returnType[]> => {
    const httpList = params.map(
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
      return new Promise(resolve => {
        this.codeType(response, (data: Array<returnType>) => {
          resolve(data)
        })
      })
    } catch (err) {
      return new Promise(resolve => {
        this.httpErrorHandle(
          err,
          (data: returnType[]) => {
            resolve(data)
          },
          params
        )
      })
    }
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
        // 默认返回{}或者[{},{}...]
        callback(_error)
        break
    }
  }
  // 捕捉http错误
  private httpErrorHandle(err: { code: string | number }, callback: Function, data?: Array<unknown>) {
    // console.log('error code:' + err.code)
    let _message = ''
    switch (err.code) {
      case '网络错误':
        _message = '网络错误，请检查网络连接'
        break
      case '超时':
        _message = '请求超时，请重试'
        break
      case 400:
        _message = `HTTP_ERROR：${err.code}，错误信息：请求错误`
        break
      case 401:
        _message = `HTTP_ERROR：${err.code}，错误信息：认证失败`
        break
      case 403:
        _message = `HTTP_ERROR：${err.code}，错误信息：资源拒绝访问`
        break
      case 404:
        _message = `HTTP_ERROR：${err.code}，错误信息：接口或资源不存在`
        break
      case 405:
        _message = `HTTP_ERROR：${err.code}，错误信息：请求方法错误`
        break
      case 500:
        _message = `HTTP_ERROR：${err.code}，错误信息：服务器错误`
        break
      case 501:
        _message = `HTTP_ERROR：${err.code}，错误信息：服务器错误`
        break
      case 503:
        _message = `HTTP_ERROR：${err.code}，错误信息：服务器暂时不可用`
        break
      default:
        _message = '未知错误'
        break
    }

    alertUtil.open(_message, true, 'error')

    let _error: {} | Array<{}>
    data ? (_error = data.map(() => ({}))) : (_error = {})
    // 如果请求失败，默认返回{}或者[{},{}...]
    callback(_error)
  }
}

export default RequestData
