import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'

import store from '@/store'

@Module({
  name: 'cancelToken',
  namespaced: true,
  dynamic: true,
  store
})
export default class cancelToken extends VuexModule {
  public cancelTokenArr: Array<Function> = []

  @Mutation
  private PUSH_TOKEN(arr: Function) {
    this.cancelTokenArr.push(arr)
  }
  @Mutation
  private CLEAR_TOKEN() {
    this.cancelTokenArr.forEach((cancel: Function) => {
      cancel('路由跳转取消请求')
    })
    this.cancelTokenArr.length = 0
    this.cancelTokenArr = []
  }

  @Action({ rawError: true })
  public setToken(arr: Function): void {
    this.context.commit('PUSH_TOKEN', arr)
  }
  @Action({ rawError: true })
  public clearToken(): void {
    this.context.commit('CLEAR_TOKEN')
  }
}

export const cancelTokenModule = getModule(cancelToken)
