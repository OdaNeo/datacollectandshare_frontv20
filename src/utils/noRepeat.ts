import RequestData from '@/api/index'
import alertUtil from './alertUtil'

const request = new RequestData()

class noRepeat {
  public static async topicName(value: string): Promise<boolean> {
    const { success } = await request['httpGET']('GET_TOPICS_CHECKED', {
      topicName: value
    })
    if (success === true) {
      // 重复
      alertUtil.open('主题名称已被注册', true, 'error')
      return false
    } else if (success === false) {
      // 不重复
      return true
    } else {
      // 网络错误
      return false
    }
  }

  public static async cmdName(cmdName: string, producer: string): Promise<boolean> {
    const { success } = await request['httpGET']('GET_CMD_CHECKED', {
      cmdName,
      producer
    })
    if (success === true) {
      // 重复
      alertUtil.open('命令名称已被注册', true, 'error')
      return false
    } else if (success === false) {
      // 不重复
      return true
    } else {
      // 网络错误
      return false
    }
  }

  public static async loginName(loginName: string): Promise<boolean> {
    const { data } = await request['httpGET']('GET_USER_FIND_ALL_USER_BY_PARAM', { loginName })

    if (data === undefined) {
      return false
    } else if (data.list?.length > 0) {
      alertUtil.open('用户名重复', true, 'error')
      return false
    } else {
      return true
    }
  }
}

export default noRepeat
