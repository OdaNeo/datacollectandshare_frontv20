export type paramsType = {
  pageSize: number
  pageNum: number
  status?: number
}

export type returnDataType = {
  code: number
  data: any
  message: string
  success: boolean
}

export type httpAllParams = {
  name: string
  method: string
  data: any
}

export type headerObj = {
  headerKey: string
  headerVal: string | number
}
