import Vue from 'vue'
import { CombinedVueInstance } from 'vue/types/vue'
import { dialogForm } from '../type/dialog-form.type'
import RequestData from '@/api/index'
import Utils from '@/utils/index'

export type H_Vue = CombinedVueInstance<Vue, dialogForm, object, object, Record<never, any>>

declare module 'vue/types/vue' {
  interface Vue {
    h_request: RequestData
    h_upload: RequestData
    h_utils: Utils
    h_echarts: any
    h_enum: any
    h_validator: any
  }
}
