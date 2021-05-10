import REQUEST_NAME from '@/api/requestName'
import { topicTable } from './topic.type'

export type paramsType = {
  pageSize: number
  pageNum: number
  dataType?: number
  faceTypes?: any
  userName?: string
  id?: string
  status?: number | string
  topicId?: string | number
  topicID?: string
  num?: number
  createTime?: number
  serverName?: string
  taskId?: string
  startTime?: number
  endTime?: number
  videoKeyword?: string
  type?: number
}

export type returnTypeData = {
  list: Array<topicTable>
  total: number
  pageNum: number
  pageSize: number
}

export type returnType = {
  code: number
  data: any | returnTypeData
  message: string
  success: boolean
  filename?: string
}

export type httpAllParams = {
  name: keyof typeof REQUEST_NAME
  method: string
  data: any
}

export type headerObj = {
  headerKey: string
  headerVal: string | number
}
