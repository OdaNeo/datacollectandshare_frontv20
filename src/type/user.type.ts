import { paramsType } from './http-request.type'
import { FormStructure } from './dialog-form.type'
export type userInfo = {
  age: number
  data: string | null
  dataJsonString: string
  email: string | any
  gmtCreated: string
  gmtUpdated: string
  id: number
  isRemenberPwd: string | null
  loginName: string
  loginPwd: string
  pageNum: number
  pageSize: number
  phone: string
  place: string
  requestId: number | null
  sex: number
  systemName: string
  uid: number
  userName: string
  userState: number
  userToken: string
  userType: number
  [key: string]: any
}

export type selectInput = {
  text: string
  value: string | number
}

export interface userParamsType extends paramsType {
  loginName?: string | null
  userState?: number | null
}

export type userFormVar = {
  text: string
  value: string | number
}
export interface userFormVarDo extends userFormVar {
  childrenList?: Array<userFormVar>
}

export type userFormObj = {
  loginName: string
  loginPwd: string
  userType: FormStructure
  userState: string
  systemName: FormStructure
  userId?: any
  [key: string]: string | FormStructure
  id: any
  newLoginPwd: string
  newLoginPwd2: string
}

export interface dialogRequestStructure2 {
  loginName: string
  userType: string
  userState: string
  systemName: string
  passWord1: string
  passWord2: string
  [key: string]: string
}

export interface dialogRequestStructure extends dialogRequestStructure2 {
  loginPwd: string
}

export interface updateUserPassword {
  oldPass: string
  passWord1: string
  passWord2: string
}
