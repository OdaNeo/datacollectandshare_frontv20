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
export type InputType = {
  label?: string
  type: string
  valueName: string
  require: boolean // 非空校验
  disabled?: boolean
  otherRules?: Array<boolean | string> // 除了非空之外的rules
  itemLabels?: Array<{ [key: string]: string | number | boolean } | any>
  multiple?: boolean
  items?: Array<{ [key: string]: string | number | boolean } | string | userFormVarDo>
}

export type dialogForm = FormObj
