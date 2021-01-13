import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

type VideoStore = {
  playListCurIndex: number
}

@Module({
  name: 'Video',
  namespaced: true,
  dynamic: true,
  store
})
class videoStore extends VuexModule {
  public VideoStore: VideoStore = {
    playListCurIndex: 0
  }

  @Mutation
  public SET_PLAY_LIST_CUR_INDEX(n: number): void {
    this.VideoStore.playListCurIndex = n
  }

  @Mutation
  public ADD_PLAY_LIST_CUR_INDEX(): void {
    this.VideoStore.playListCurIndex = this.VideoStore.playListCurIndex + 1
  }
  @Action({ rawError: true })
  public setPlayListCurIndex(n: number): void {
    this.context.commit('SET_PLAY_LIST_CUR_INDEX', n)
  }

  @Action({ rawError: true })
  public addPlayListCurIndex(): void {
    this.context.commit('ADD_PLAY_LIST_CUR_INDEX')
  }
}

export const videoStoreModule = getModule(videoStore)
