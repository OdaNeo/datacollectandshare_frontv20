import { ValidatorType } from '../type/validator.type'

class TopicValidator {
  public readonly topicNameFormatter = (): ValidatorType => {
    return [
      (v: string): boolean | string => (v && v.length <= 40) || '主题名称最长可设置40个字符',
      (v: string): boolean | string => /^[\w@.]*$/.test(v) || '内容只能为数字、字母、下划线、.、@的组合'
    ]
  }

  public readonly fileProtoValidate = (): ValidatorType => {
    return [
      (v: File): boolean | string => !!v || '请上传.proto文件',
      (v: File): boolean | string => !!(v && v.name.match('.proto')) || '文件格式错误'
    ]
  }

  public readonly fileSQLValidate = (): ValidatorType => {
    return [
      (v: File): boolean | string => !!v || '请上传.sql文件',
      (v: File): boolean | string => !!(v && v.name.match('.sql')) || '文件格式错误'
    ]
  }
}

export default TopicValidator
