import Vue from 'vue'
import { CombinedVueInstance } from 'vue/types/vue'
// import { returnType } from '../type/http-request.type'
import { dialogForm } from '../type/dialog-form.type'
import RequestData from '@/api/index'

export type H_Vue = CombinedVueInstance<Vue, dialogForm, object, object, Record<never, any>>

// type Request = {
//   httpGET: <T>(requestName: string, params: T, ...urlArr: Array<string>) => Promise<returnType>
//   httpPOST: <T>(requestName: string, params: T, ...urlArr: Array<string>) => Promise<returnType>
//   httpPUT: <T>(requestName: string, params: T, ...urlArr: Array<string>) => Promise<returnType>
//   httpAll: <T>(params: Array<T>) => Promise<Array<returnType>>
// }

// type Request2 = {
//   [key: string]: string
// }

declare module 'vue/types/vue' {
  interface Vue {
    h_request: RequestData
    h_upload: RequestData
    // h_request2: Request2
    h_echarts: any
    h_utils: any
    h_enum: any
    h_validator: any
  }
}
