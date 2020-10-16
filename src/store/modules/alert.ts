import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'

import store from '@/store'

type AS = {
  text: string,
  visible: boolean,
  timeout: number,
  color: string,
  counter?:number
}

@Module({
  name: "Alert",
  namespaced: true,
  dynamic: true,
  store
})

export default class alertStore extends VuexModule{
  public AlertState:AS  = {
    text: "",
    visible: false,
    timeout: 6000,
    color: "info",
    counter:0
  }

  @Mutation
  private SET_ALERT({text,visible,timeout,color}:AS) {
    this.AlertState.text = text
    this.AlertState.visible = visible
    this.AlertState.timeout = timeout
    this.AlertState.color = color
    this.AlertState.counter = (this.AlertState.counter as number)++
  }

  @Mutation
  private CLEAR_ALERT() {
    this.AlertState.text = ""
    this.AlertState.visible = false
    this.AlertState.color = "info"
  }

  @Action({rawError: true})
  public openAlert(opt:AS){
    this.context.commit("SET_ALERT",opt)
  }

  @Action({rawError: true})
  public closeAlert(){
    this.context.commit("CLEAR_ALERT")
  }
}

export const alertStoreModule = getModule(alertStore)