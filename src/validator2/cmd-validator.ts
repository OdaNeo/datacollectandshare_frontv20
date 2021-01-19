import { ValidatorType } from '../type/validator.type'

export const cmdNameFormatter: ValidatorType = [
  (v: string): boolean | string => (v && v.length <= 20) || '命令名称最长可设置20个字符',
  (v: string): boolean | string => /^\w*$/.test(v) || '内容只能为数字、字母、下划线的组合'
]
