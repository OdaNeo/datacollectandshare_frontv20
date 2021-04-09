import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'

import store from '@/store'

@Module({
  name: 'Upload',
  namespaced: true,
  dynamic: true,
  store
})
export default class UploadStore extends VuexModule {
  public showUpLoading = false
  public upLoadingProgress = 0
  public cancelToken: Function | null = null

  @Mutation
  private SET_UPLOADING(bo: boolean) {
    this.showUpLoading = bo
  }
  @Mutation
  private SET_UPLOADING_PROGRESS(progress: number) {
    this.upLoadingProgress = progress
  }
  @Mutation
  private PUSH_TOKEN(cancel: Function) {
    this.cancelToken = null
    this.cancelToken = cancel
  }

  @Action({ rawError: true })
  public handleSetUploading(bo: boolean): void {
    this.context.commit('SET_UPLOADING', bo)
  }
  @Action({ rawError: true })
  public handleSetUploadingProgress(progress: number): void {
    this.context.commit('SET_UPLOADING_PROGRESS', progress)
  }
  @Action({ rawError: true })
  public handelSetToken(cancel: Function): void {
    this.context.commit('PUSH_TOKEN', cancel)
  }
}

export const uploadStoreModule = getModule(UploadStore)
