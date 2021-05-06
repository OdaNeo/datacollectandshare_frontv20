import alertUtil from './alertUtil'
import { isValidCron } from 'cron-validator'

export default class cronUtil {
  public static cronValidator = (cron: string): boolean => {
    if (isValidCron(cron, { seconds: true, allowBlankDay: true })) {
      return true
    } else {
      alertUtil.open(`cron表达式${cron}有误`, true, 'error')
      return false
    }
  }
}
