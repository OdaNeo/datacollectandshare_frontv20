import { userFormVarDo } from '@/type/user.type'

export type FormStructure = {
  text: string
  value: string
  reset?: boolean
  disabled?: boolean
  show?: boolean
}

export type FormObj = {
  title: string
  btnName: Array<string>
  methodName: string
  formObj: {
    [key: string]: FormStructure | string | number | Array<any> | boolean | object | any
  }
}

export type dialogForm = FormObj
