import { ValidatorType } from '../type/validator.type'

class VideoCmdValidator {
  public readonly videoTopicNameValidate = (): ValidatorType => {
    return [
      (v: string) => !!v || '主题名称不能为空',
      (v: string) => (v && v.length <= 20) || '主题名称最长可设置20个字符',
      (v: string) => /^\w*$/.test(v) || '内容只能为数字、字母、下划线的组合'
    ]
  }

  public readonly videoDataSourceValidate = (): ValidatorType => {
    return [(v: string) => !!v || '数据源地址不能为空']
  }

  public readonly videoCameraPositionValidate = (): ValidatorType => {
    return [(v: string) => !!v || '摄像头位置不能为空']
  }

  public readonly videoStartTimeValidate = (): ValidatorType => {
    return [(v: string) => !!v || '起始日期不能为空']
  }

  public readonly videoEndTimeValidate = (): ValidatorType => {
    return [(v: string) => !!v || '截止日期不能为空']
  }
}

export default VideoCmdValidator
