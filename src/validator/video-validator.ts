class VideoCmdValidator {
    public readonly videoCmdNameVilidata = () => {
      return [(v: string) => !!v || '主题名称不能为空', (v: string) => (v && v.length <= 20) || '主题名称最长可设置20个字符', (v: string) => /^\w*$/.test(v) || '内容只能为数字、字母、下划线的组合']
    }
  
    public readonly videoCmdConsumersVilidata = () => {
      return [(v: string) => !!v || '数据源地址不能为空']
    }
  }
  
export default VideoCmdValidator
  