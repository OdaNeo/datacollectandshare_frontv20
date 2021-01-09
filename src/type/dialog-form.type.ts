export type FormStructure = {
  text: string
  reset: boolean
  value: string
  disabled?: boolean
  show?: boolean
}

export type FormObj = {
  title: string
  btnName: Array<string>
  methodName: string
  formObj: {
    [key: string]: FormStructure | string | number | Array<any> | boolean
  }
}

export type dialogForm = FormObj
