export default class topicListUtil {
  // 转化 topicList
  public static transTopicListToJson(
    topicList: { key: string; type: string; description: string }[]
  ): [string, string] {
    const dataStruct: any = {}
    const dataStructNumber: any = {}

    topicList.forEach(val => {
      dataStruct[val.key] = val.description
      dataStructNumber[val.key] = val.type === 'TimeStamp' ? Date.now() : val.type
    })
    const _numberS = JSON.stringify(dataStruct)
    const _keyS = '[' + JSON.stringify(dataStructNumber) + ']'
    return [_numberS, _keyS]
  }

  // 获得 topicList
  public static transJsonToTopicList(
    dataStruct: string,
    dsAnnotation: string
  ): { key: string; description: string; type: string }[] {
    const obj1: any = JSON.parse(dsAnnotation)
    const obj2: any = JSON.parse(dataStruct)[0]
    const _topicList = []
    for (const k in obj1) {
      _topicList.push({
        key: k,
        description: obj1[k],
        type: typeof obj2[k] === 'number' && obj2[k] > 1 ? 'TimeStamp' : obj2[k]
      })
    }
    return _topicList
  }

  // 转64
  public static authorizationBase64(obj: {
    key: string
    value: string
  }): {
    key: string
    value: string
  } {
    return {
      key: 'Authorization',
      value: 'Basic ' + window.btoa(obj.key + ':' + obj.value + '')
    }
  }

  // 去除obj中key为空的项
  public static cleanObj(obj: Array<{ key: unknown }>): Array<{ key: unknown }> {
    const _obj = [...obj]
    const _object: Array<{ key: unknown }> = []

    _obj.forEach(item => {
      if (item.key || typeof item.key === 'number') {
        _object.push(item)
      }
    })
    return _object
  }
}
