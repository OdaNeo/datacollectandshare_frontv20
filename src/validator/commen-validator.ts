import { ValidatorType } from '../type/validator.type'

class CommonValidator {
  // 通用非空校验规则
  public readonly noEmpty = (str: string): ValidatorType => {
    return [(v: string) => !!v || `${str}不能为空`]
  }
  // 数字校验
  public readonly isNumber = (): ValidatorType => {
    return [(v: unknown) => !isNaN(Number(v)) || '请输入数字']
  }
}

export default CommonValidator
