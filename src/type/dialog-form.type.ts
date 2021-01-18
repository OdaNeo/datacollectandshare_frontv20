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
  require: boolean
  disabled?: boolean
  rules?: Array<string>
  multiple?: boolean
  items?: Array<{ [key: string]: string | number } | string>
}

export type dialogForm = FormObj
