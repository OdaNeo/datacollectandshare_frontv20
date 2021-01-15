import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

type VideoStore = {
  playList: Array<string>
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
  }

  @Mutation
  public ADD_PLAY_LIST(list: Array<string>): void {
    this.VideoStore.playList = list.concat()
  }

  @Action({ rawError: true })
  public addPlayList(list: Array<string>): void {
    this.context.commit('ADD_PLAY_LIST', list)
  }
}

export const videoStoreModule = getModule(videoStore)
