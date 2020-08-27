import axios,{ AxiosInstance } from 'axios';
import {httpAllParams,returnDataType} from "../type/http-request.type"
import REQUEST_NAME from './requestName';


class RequestHelper {
  private axiosIns: AxiosInstance;
  constructor(axiosIns:AxiosInstance) {
    this.axiosIns = axiosIns;
  }

  public getFun<K>(url: string,data: K):Promise<returnDataType> {
    return new Promise(async (resolve, reject):Promise<void> => {
      const response:returnDataType = await this.axiosIns.get(url, {
        params: data
      });
      resolve(response);
    })
  }

  public postFun<K>(url: string, data: K):Promise<returnDataType> {
    return new Promise(async (resolve, reject) => {
      const response:returnDataType = await this.axiosIns.post(url, data)
      resolve(response)
    })
  }

  public putFun<K>(url: string, data: K):Promise<returnDataType> {
    return new Promise(async (resolve, reject) => {
      const response:returnDataType = await this.axiosIns.put(url, data)
      resolve(response)
    })
  }

  public allFun<K extends httpAllParams>(data: Array<K>):Promise<Array<returnDataType>> {
    const httpList:Array<any> = data.map((item: K) => {
      switch (item["method"]) {
        case "get":
          return this.getFun<any>(REQUEST_NAME[item.name],item.data)
        case "post":
          return this.postFun<any>(REQUEST_NAME[item.name],item.data)
        default:
          return this.getFun<any>(REQUEST_NAME[item.name],item.data)
      }
    })
    return new Promise(async (resolve, reject):Promise<void> => {
      axios.all(httpList).then(axios.spread((...https) => {
        resolve(https)
      }))
    })
  }

}

export default RequestHelper;