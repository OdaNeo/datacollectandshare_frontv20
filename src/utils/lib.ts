import { rootStoreModule } from '@/store/modules/root'
import router from '@/router'
import alertUtil from './alertUtil'
import { isValidCron } from 'cron-validator'

export default class lib {
  // 文件下载方法
  public static downloadUtil(data: Blob | any, filename: string): void {
    const blob = new Blob([data], {
      type: 'application/octet-stream'
    })
    const tempLink = document.createElement('a')
    const blobURL = window.URL.createObjectURL(blob)

    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(filename))

    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }

  // 登出
  public static logout(): void {
    // 清除vuex 的状态
    rootStoreModule.logout()
    // 跳转
    router.replace({
      path: '/login'
    })
  }

  // cron表达式校验
  public static cronValidator = (cron: string): boolean => {
    if (isValidCron(cron, { seconds: true, allowBlankDay: true })) {
      return true
    } else {
      alertUtil.open(`cron表达式${cron}有误`, true, 'error')
      return false
    }
  }
}
