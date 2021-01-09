import { ValidatorType } from '../type/validator.type'
class CmdValidator {
  // cmdName校验规则
  public readonly cmdNameValidate = (): ValidatorType => {
    return [
      (v: string) => !!v || '命令名称不能为空',
      (v: string) => (v && v.length <= 20) || '命令名称最长可设置20个字符',
      (v: string) => /^\w*$/.test(v) || '内容只能为数字、字母、下划线的组合'
    ]
  }

  // cmd producer校验规则
  public readonly cmdConsumersValidate = (): Array<(v: Array<string>) => boolean | string> => {
    return [(v: Array<string>) => (v && v.length > 0) || '']
  }
}

export default CmdValidator
