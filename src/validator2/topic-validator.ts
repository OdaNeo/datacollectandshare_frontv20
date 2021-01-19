import { ValidatorType } from '../type/validator.type'

export const topicNameFormatter: ValidatorType = [
  (v: string): boolean | string => (v && v.length <= 40) || '主题名称最长可设置40个字符',
  (v: string): boolean | string => /^[\w@.]*$/.test(v) || '内容只能为数字、字母、下划线、.、@的组合'
]
