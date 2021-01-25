import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { returnDataType } from '../../type/http-request.type'
import { userRootType, userMessageType } from '../../type/vuex.type'
import { NAV_BAR_ITEM_LIST_ALL } from '@/config'

type UserStateType = {
  username: string // 用户名称
  userRoot: Array<userRootType> // 用户整体权限
  routeRoot: Array<string> // 用户路由的权限
  userMessage: userMessageType // 主题信息对象
  token: string
  createUserOption: {
    // 创建用户参数
    roleList: Array<any> // 角色列表
    systemName: Array<any> // 系统名称
  }
}

type UserLocalType = {
  username: string
  userRoot: Array<userRootType>
  routeRoot: Array<string>
  userMessage: userMessageType
  token: string
}

type login = {
  username: string
  result: returnDataType
}

@Module({
  name: 'Root',
  namespaced: true,
  dynamic: true,
  store
})
export default class rootStore extends VuexModule {
  public UserState: UserStateType = {
    username: '',
    userRoot: [],
    routeRoot: [],
    userMessage: {},
    token: '',
    createUserOption: {
      roleList: [],
      systemName: []
    }
  }

  @Mutation
  private MET_LOGIN({ username, userRoot, routeRoot, userMessage, token }: UserLocalType) {
    this.UserState.username = username
    this.UserState.userRoot = userRoot
    this.UserState.routeRoot = routeRoot
    this.UserState.userMessage = userMessage
    this.UserState.token = token
  }

  @Mutation
  private MET_LOGOUT() {
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('systemInfo')
    sessionStorage.removeItem('id')
    localStorage.removeItem('userAndPass')
    this.UserState.username = ''
    this.UserState.userRoot = []
    this.UserState.routeRoot = []
    this.UserState.userMessage = {}
    this.UserState.token = ''
    this.UserState.createUserOption = {
      roleList: [],
      systemName: []
    }
  }

  @Action({ rawError: true })
  public async login({ username, result }: login): Promise<boolean> {
    getRouteRoot(result.data)
    const userSession: UserLocalType = {
      username: username,
      userRoot: result.data,
      routeRoot: RouteRoot,
      userMessage: JSON.parse(result.message),
      token: 'Bearer ' + JSON.parse(result.message).place
    }
    sessionStorage.setItem('userInfo', JSON.stringify(userSession))
    this.context.commit('MET_LOGIN', userSession)
    return true
  }

  @Action({ rawError: true })
  public async refresh(): Promise<boolean> {
    if (this.UserState.username === '') {
      let userSession = sessionStorage.getItem('userInfo')
      if (userSession) {
        userSession = JSON.parse(userSession)
        this.context.commit('MET_LOGIN', userSession)
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  @Action({ rawError: true })
  public logout(): void {
    this.context.commit('MET_LOGOUT')
  }

  get navMenuList(): Array<userRootType> {
    if (this.UserState.userRoot.length > 0) {
      // 根据 NAV_BAR_ITEM_LIST_ALL 排序
      const arr1 = NAV_BAR_ITEM_LIST_ALL
      const arr2 = this.UserState.userRoot.filter(item => {
        return item.childrenList && item.type === 'menu' && item.childrenList.length !== 0
      })
      arr2.sort((pre, next) => {
        return arr1.indexOf(pre.name) - arr1.indexOf(next.name)
      })
      return arr2
    }
    return []
  }
}

const RouteRoot: Array<string> = []
function getRouteRoot(data: Array<userRootType>): void {
  data.forEach(ele => {
    if (ele.childrenList) {
      getRouteRoot(ele.childrenList)
    } else {
      RouteRoot.push(ele.url)
    }
  })
}

export const rootStoreModule = getModule(rootStore)
