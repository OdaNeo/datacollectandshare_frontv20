import { ValidatorType } from '../type/validator.type'

function isJSON(str: string) {
  if (!str) {
    return
  }

  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
}

class CommonValidator {
  // 通用非空校验规则
  public readonly noEmpty = (str?: string): ValidatorType => {
    // return [(v: string) => !!v || `${str}不能为空`]
    return [(v: string | number | Array<string>) => !!(v && v.toString()) || (str ? `${str}不能为空` : `此项不能为空`)]
  }
  // 数字校验
  public readonly isNumber = (): ValidatorType => {
    return [(v: unknown) => !isNaN(Number(v)) || '请输入数字']
  }
  // json 校验
  public readonly isJSON = (): ValidatorType => {
    return [(v: string): boolean | string => isJSON(v) || '请输入正确的Json数据']
  }
}

export default CommonValidator
