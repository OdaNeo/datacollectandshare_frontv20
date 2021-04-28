import { ValidatorType } from '../type/validator.type'

const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[0-9])[^]{8,16}$/

class SystemValidator {
  public readonly typeInputRules = (): ValidatorType => {
    return [
      (v: string): boolean | string => (v && v.length <= 10) || '长度最大为10个字符',
      (v: string): boolean | string => (v && v !== 'network') || '不能填写network',
      (v: string): boolean | string => (v && v !== 'system') || '不能填写system'
    ]
  }
  public readonly nameInputRules = (): ValidatorType => {
    return [
      (v: string): boolean | string => (v && v.length <= 10) || '长度最大为10个字符',
      (v: string): boolean | string => (v && v !== 'kafka') || '不能填写kafka',
      (v: string): boolean | string => (v && v !== 'redis') || '不能填写redis'
    ]
  }
  public readonly valueRules = (): ValidatorType => {
    return [(v: string): boolean | string => (v && v.length <= 120) || '长度最大为120个字符']
  }
  // 密码
  public readonly passwordRules = (): ValidatorType => {
    return [(v: string): boolean | string => (v && PASSWORD_REGEXP.test(v)) || '密码必须为数字字母混合，且长度为8-16位']
  }
}

export default SystemValidator
