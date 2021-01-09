import axios, { AxiosInstance } from 'axios'
import { httpAllParams, returnDataType } from '../type/http-request.type'
import REQUEST_NAME from './requestName'

class RequestHelper {
  private axiosIns: AxiosInstance
  constructor(axiosIns: AxiosInstance) {
    this.axiosIns = axiosIns
  }

  public async getFun<K>(url: string, data: K): Promise<returnDataType> {
    const response: returnDataType = await this.axiosIns.get(url, {
      params: data
    })
    return Promise.resolve(response)
  }

  public async postFun<K>(url: string, data: K): Promise<returnDataType> {
    const response: returnDataType = await this.axiosIns.post(url, data)
    return Promise.resolve(response)
  }

  public async putFun<K>(url: string, data: K): Promise<returnDataType> {
    const response: returnDataType = await this.axiosIns.put(url, data)
    return Promise.resolve(response)
  }

  public async allFun<K extends httpAllParams>(data: Array<K>): Promise<Array<returnDataType>> {
    const httpList = data.map((item: K) => {
      switch (item.method) {
        case 'get':
          return this.getFun(REQUEST_NAME[item.name], item.data)
        case 'post':
          return this.postFun(REQUEST_NAME[item.name], item.data)
        case 'put':
          return this.putFun(REQUEST_NAME[item.name], item.data)
        default:
          return this.getFun(REQUEST_NAME[item.name], item.data)
      }
    })
    // return new Promise(async (resolve) => {
    //   axios.all(httpList).then(axios.spread((...https) => {
    //     resolve(https)
    //   }))
    // })
    const response: Array<returnDataType> = await axios.all(httpList)
    return Promise.resolve(response)
  }
}
export default RequestHelper
