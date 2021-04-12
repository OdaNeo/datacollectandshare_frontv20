import { baseType } from './params.type'

export interface loggerParamType extends baseType {
  logIp: string
  logUserName: string
  logPassWord: string
  savePath: string
  saveType: string
  keywords: string
}
