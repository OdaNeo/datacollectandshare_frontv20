import RequestData from '@/api/index'

const request = new RequestData()

class noRepeat {
  public static async topicName(value: string): Promise<string | false | undefined> {
    const { success } = await request['httpGET']('GET_TOPICS_CHECKED', {
      topicName: value
    })
    if (success === true) {
      return '主题名称已被注册'
    } else if (success === false) {
      return false
    } else {
      return undefined
    }
  }

  public static async cmdName(cmdName: string, producer: string): Promise<string | false | undefined> {
    const { success } = await request['httpGET']('GET_CMD_CHECKED', {
      cmdName,
      producer
    })
    if (success === true) {
      return '命令名称已被注册'
    } else if (success === false) {
      return false
    } else {
      return undefined
    }
  }

  public static async loginName(loginName: string): Promise<string | false | undefined> {
    const { data } = await request['httpGET']('GET_USER_FIND_ALL_USER_BY_PARAM', { loginName })

    if (data === undefined) {
      return undefined
    } else if (data.list?.length > 0) {
      return '用户名重复'
    } else {
      return false
    }
  }
}

export default noRepeat
