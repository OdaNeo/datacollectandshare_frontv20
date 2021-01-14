<template>
  <v-dialog v-model="dialog" persistent width="800">
    <v-card>
      <v-card-title class="dialog-title">
        <p class="mb-0">视频列表</p>
        <v-btn icon class="close-btn" @click.stop="closeMethod">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-slide-group v-model="model" class="pa-4" mandatory center-active show-arrows>
        <v-slide-item v-for="(item, index) in videoNameList" :key="item.id">
          <v-btn
            class="mx-2"
            :class="{ 'primary': curIndex === index }"
            small
            depressed
            rounded
            @click="toggleCurrentPlay(index)"
          >
            {{ item }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
      <iframe
        allowfullscreen="allowfullscreen"
        mozallowfullscreen="mozallowfullscreen"
        msallowfullscreen="msallowfullscreen"
        oallowfullscreen="oallowfullscreen"
        webkitallowfullscreen="webkitallowfullscreen"
        frameborder="0"
        width="100%"
        height="450"
        border="0"
        style="display: block"
        scrolling="no"
        ref="iframe"
      ></iframe>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import { videoStoreModule } from '@/store/modules/video'

@Component
export default class VideoPopup extends Vue {
  @Model('closeDialog', { type: Boolean }) private checked!: boolean
  get dialog(): boolean {
    return this.checked
  }
  private closeMethod() {
    this.$emit('closeDialog')
  }
  private model = null
  private iframeDom = this.$refs.iframe

  private get videoList(): Array<string> {
    return videoStoreModule.VideoStore.playList
  }

  private curIndex = 0

  private get videoNameList(): Array<string> {
    const _l: Array<string> = []
    this.videoList.forEach(item => {
      const i = item.split('?')[0].split('/')
      _l.push(i[i.length - 1])
    })
    return _l
  }

  private toggleCurrentPlay(index: number) {
    const iframe = this.$refs.iframe as HTMLIFrameElement
    const iframeWindow = iframe.contentWindow as Window
    this.curIndex = index
    // force refresh
    iframeWindow.location.reload(true)
    iframe.src = `/streamVideo?video=${this.videoList[index]}`
    iframeWindow.addEventListener('videoPlayEnd', () => {
      if (this.curIndex + 1 < this.videoList.length) {
        this.toggleCurrentPlay(this.curIndex + 1)
      }
    })
  }

  mounted(): void {
    this.toggleCurrentPlay(0)
  }
}
</script>
<style scoped>
.dialog-title {
  text-align: center;
  display: block;
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
