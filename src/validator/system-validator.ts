import { ValidatorType } from '../type/validator.type'

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
}

export default SystemValidator
