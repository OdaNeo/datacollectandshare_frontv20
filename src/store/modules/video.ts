import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

type VideoStore = {
  playList: Array<string>
  // playListCurIndex: number
}

@Module({
  name: 'Video',
  namespaced: true,
  dynamic: true,
  store
})
class videoStore extends VuexModule {
  public VideoStore: VideoStore = {
    playList: []
    // playListCurIndex: 0
  }

  // @Mutation
  // public SET_PLAY_LIST_CUR_INDEX(n: number): void {
  //   this.VideoStore.playListCurIndex = n
  // }
  // @Mutation
  // public ADD_PLAY_LIST_CUR_INDEX(): void {
  //   this.VideoStore.playListCurIndex++
  // }
  @Mutation
  public ADD_PLAY_LIST(list: Array<string>): void {
    this.VideoStore.playList = list.concat()
  }

  // @Action({ rawError: true })
  // public setPlayListCurIndex(n: number): void {
  //   this.context.commit('SET_PLAY_LIST_CUR_INDEX', n)
  // }
  // @Action({ rawError: true })
  // public addPlayListCurIndex(): void {
  //   this.context.commit('ADD_PLAY_LIST_CUR_INDEX')
  // }
  @Action({ rawError: true })
  public addPlayList(list: Array<string>): void {
    this.context.commit('ADD_PLAY_LIST', list)
  }
}

export const videoStoreModule = getModule(videoStore)
