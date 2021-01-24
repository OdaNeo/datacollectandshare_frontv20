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

export const topicNameFormatter: ValidatorType = [
  (v: string): boolean | string => (v && v.length <= 40) || '主题名称最长可设置40个字符',
  (v: string): boolean | string => /^[\w@.]*$/.test(v) || '内容只能为数字、字母、下划线、.、@的组合'
]

export const dataStructValidate: ValidatorType = [(v: string): boolean | string => isJSON(v) || '请输入正确的Json数据']

export const fileProtoValidate: ValidatorType = [
  (v: File): boolean | string => !!v || '请上传.proto文件',
  (v: File): boolean | string => !!(v && v.name.match('.proto')) || '文件格式错误'
]

export const fileExcelValidate: ValidatorType = [
  (v: File): boolean | string => !!(v && v.name.match('.xls')) || '文件格式错误'
]
