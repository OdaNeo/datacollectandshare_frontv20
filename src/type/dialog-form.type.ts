

export type FormStructure = {
  text: string
  reset: boolean
  disabled?: boolean
  show?: boolean
}


export type FormObj = {
  title:string
  btnName: Array<string>
  methodName: string
  formObj: {
    [key:string]:FormStructure|string|number|Array<any>
  }
}

export interface dialogForm extends FormObj{}