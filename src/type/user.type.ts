import { paramsType } from './http-request.type';
import { FormStructure } from './dialog-form.type';
export type userInfo = {
  age: number
  data: string|null
  dataJsonString: string
  email: string|any
  gmtCreated: string
  gmtUpdated: string
  id: number
  isRemenberPwd: string|null
  loginName: string
  loginPwd: string
  pageNum: number
  pageSize: number
  phone: string
  place: string
  requestId: number|null
  sex: number
  systemName: string
  uid: number
  userName: string
  userState: number
  userToken: string
  userType: number
  [key:string]:any
}

export type selectInput = {
  text: string,
  value:string|number
}

export interface userParamsType extends paramsType{
  loginName?: string|null
  userState?: number|null
}

export type userFormVar = {
  text: string
  value:string
}


export type userFormObj = {
  loginName: FormStructure
  loginPwd: FormStructure
  userType:FormStructure
  userState: FormStructure
  systemName: FormStructure
  userId?: any
  [key:string]:FormStructure
  id:any
}

export type dialogRequestStructure = {
  loginName: string
  loginPwd: string
  userType:string
  userState: string
  systemName: string
  [key:string]:string
}
