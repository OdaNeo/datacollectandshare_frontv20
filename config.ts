// VUE_APP_BASE_API = 'http://192.168.60.92:9002'
// 3.0
// VUE_APP_BASE_API = 'http://172.51.216.106:49090'
// ali
// VUE_APP_BASE_API = 'http://112.126.65.241:9002'
// 测试服
// VUE_APP_BASE_API = 'http://8.131.231.56:49090'
// VUE_APP_BASE_API = 'http://172.51.216.106:8085'

if (process.env.VUE_APP_NINJA_CAT && !sessionStorage.getItem('staging')) {
  const _url = window.prompt('staging')
  if (_url) {
    sessionStorage.setItem('staging', `http://${_url}`)
  }
}
export const VUE_APP_BASE_API = process.env.VUE_APP_NINJA_CAT
  ? sessionStorage.getItem('staging') || undefined
  : 'http://112.126.65.241:9002'

export const PROJECT_TITLE = process.env.VUE_APP_NINJA_CAT
  ? `${VUE_APP_BASE_API}`
  : '交控科技天枢平台元数据配置管理中心'

export const NAV_BAR_ITEM_LIST_ALL = [
  '权限管理',
  '主题管理',
  '视频数据管理',
  '命令管理',
  '系统管理',
  '日志管理',
  '数据管理'
]
