import REQUEST_NAME from './requestName'
import { returnType, httpAllParams, headerObj } from '../type/http-request.type'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { rootStoreModule } from '../store/modules/root'
import { cancelTokenModule } from '../store/modules/request'
import alertUtil from '../utils/alertUtil'
import lib from '../utils/lib'
import { VUE_APP_BASE_API, BASE_REQUEST_TIME_OUT } from '../../config'
import { uploadStoreModule } from '@/store/modules/upload'
import { httpErrorMsg } from '@/enum/http-enum'
import qs from 'qs'

class RequestData {
  private axiosIns: AxiosInstance = axios.create({
    baseURL: VUE_APP_BASE_API,
    headers: {
      post: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    },
    onUploadProgress: progress => {
      // 格式化成百分数
      uploadStoreModule.handleSetUploadingProgress(Math.ceil((progress.loaded / progress.total) * 100))
    }
    // withCredentials: true
  })

  private DEFAULT_CONFIG: Partial<AxiosRequestConfig> = {
    timeout: BASE_REQUEST_TIME_OUT
  }

  constructor(headers: Array<headerObj> = [], otherConfig?: AxiosRequestConfig) {
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

      // 取消上个页面的请求
      config.cancelToken = new axios.CancelToken(cancel => {
        cancelTokenModule.setToken(cancel)
      })

      // 合并用户配置与默认配置
      config = { ...config, ...this.DEFAULT_CONFIG, ...otherConfig }

      if (config.method === "get") {
        config.paramsSerializer = function (params) {
          return qs.stringify(params,{arrayFormat: 'repeat'})
        }
      }

      return config
    })

    this.axiosIns.interceptors.response.use(
      ({ data, headers }: AxiosResponse) => {
        // 如果有content-disposition 响应头，认为是文件下载
        // 将响应头全部透传给 业务逻辑组件，方法内不关心文件名具体是什么
        const filename = headers['content-disposition']
        filename && (data.filename = filename)
        return Promise.resolve(data)
      },
      (error: AxiosError) => {
        // console.log(error.response)
        let _msg = '其他'
        if (error.message.includes('Network Error')) {
          _msg = '网络错误'
        } else if (error.message.includes('timeout')) {
          _msg = '超时'
        } else if (error.message.includes('路由跳转取消请求')) {
          _msg = '取消'
        }
        return Promise.reject({
          httpStatus: error.response?.status || _msg,
          code: error.response?.data.code,
          message: error.response?.data.message
        })
      }
    )
  }

  // get
  public httpGET = async <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormatHandle(REQUEST_NAME[requestName], [...urlArr])

    return this.tryCatchHandle(`get`, url, params)
  }

  // post
  public httpPOST = async <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormatHandle(REQUEST_NAME[requestName], [...urlArr])

    return this.tryCatchHandle(`post`, url, params)
  }

  // put
  public httpPUT = async <T>(
    requestName: keyof typeof REQUEST_NAME,
    params: T,
    ...urlArr: Array<string>
  ): Promise<returnType> => {
    const url = this.urlFormatHandle(REQUEST_NAME[requestName], [...urlArr])

    return this.tryCatchHandle(`put`, url, params)
  }

  // all
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
        this.codeTypeHandle(response, (data: Array<returnType>) => {
          resolve(data)
        })
      })
    } catch (err) {
      // Promise.all 返回第一个错误
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

  // 格式化url
  private urlFormatHandle(url: string, urlArr: Array<string>): string {
    let u: string = url
    if (urlArr.length > 0) {
      urlArr.forEach(element => {
        u += `/${element}`
      })
    }
    return u
  }

  // 统一错误处理try catch
  private async tryCatchHandle<T>(
    method: keyof Pick<AxiosInstance, 'get' | 'post' | 'put'>,
    url: string,
    params: T
  ): Promise<returnType> {
    try {
      // 如果是get请求，需要传入config，其他请求直接传入 params
      const response: returnType = await (method === 'get'
        ? this.axiosIns[method](url, { params })
        : this.axiosIns[method](url, params))

      return new Promise(resolve => {
        this.codeTypeHandle(response, (data: returnType) => {
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

  // 捕捉业务上的错误：直接显示后端错误码
  private codeTypeHandle(response: Array<returnType> | returnType, callback: Function) {
    let code = 0
    let message = ''
    let _error: {} | Array<{}>
    let filename: string | undefined = ''

    if (Array.isArray(response)) {
      // 找出第一个错误项
      const _error_item = response.filter(item => item.code !== 200)

      if (_error_item.length === 0) {
        code = 200
      } else {
        code = _error_item[0].code
        message = _error_item[0].message
      }
      _error = response.map(() => ({}))
    } else {
      filename = response.filename
      code = response.code
      message = response.message
      _error = {}
    }
    // 如果有filename，直接callback
    if (filename) {
      callback(response)
      return
    }

    switch (code) {
      // -1000是登录超时，用户需要重新登陆，3秒后
      case -1000:
        // 异步弹出重新登录的请求，防止与其他弹框冲突
        setTimeout(() => {
          alertUtil.close()
          alertUtil.open(`${message}，请尝试重新登录`, true, 'error', 5000)
        }, 100)
        // 登出
        setTimeout(() => {
          lib.logout()
        }, 2500)

        callback(_error)
        break

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
  // 捕捉http错误：显示http错误码
  private httpErrorHandle<T>(
    err: { httpStatus: string | number; code: number; message: string },
    callback: Function,
    data?: Array<T>
  ) {
    // console.log('error status:' + err.status)
    let _message = ''
    switch (err.httpStatus) {
      case '取消':
        // 如果是取消请求 cancelToken，直接返回，不提示错误
        return
      case '网络错误':
        _message = '网络错误，请检查网络连接'
        break
      case '超时':
        _message = '请求超时，请重试'
        break
      default:
        console.error(err)
        _message = `错误代码：${err.code}，HTTP错误码：${err.httpStatus}，${err.message}：${
          httpErrorMsg[Number(err.httpStatus)]
        }`
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
