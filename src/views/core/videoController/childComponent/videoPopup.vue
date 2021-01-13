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
        <v-slide-item
          v-for="(item, index) in videoNameList"
          :key="item.id"
          v-slot="{ active, toggle }"
          @change="toggleCurrentPlay(index)"
        >
          <v-btn class="mx-2" :input-value="active" active-class="primary" small depressed rounded @click="toggle">
            {{ item }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
      <!-- iframe 为了解决播放列表切换时，产生的多余的.ts文件请求 -->
      <iframe
        :src="`/streamVideo?video=${videoList[curIndex]}`"
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
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import { videoStoreModule } from '@/store/modules/video'

@Component
export default class VideoPopup extends Vue {
  @Prop() private videoList!: Array<string>
  @Model('closeDialog', { type: Boolean }) private checked!: boolean
  get dialog(): boolean {
    return this.checked
  }
  private closeMethod() {
    this.$emit('closeDialog')
  }
  private model = null

  private get curIndex() {
    if (videoStoreModule.VideoStore.playListCurIndex < this.videoList.length) {
      return videoStoreModule.VideoStore.playListCurIndex
    } else {
      return this.videoList.length - 1
    }
  }

  get videoNameList(): Array<string> {
    const _l: Array<string> = []
    this.videoList.forEach(item => {
      const i = item.split('?')[0].split('/')
      _l.push(i[i.length - 1])
    })
    return _l
  }

  private toggleCurrentPlay(index: number) {
    videoStoreModule.setPlayListCurIndex(index)
  }
  private addPlayList() {
    videoStoreModule.addPlayListCurIndex()
  }

  mounted(): void {
    this.toggleCurrentPlay(0)
    // 访问irame的window对象
    const iframe = this.$refs.iframe as HTMLIFrameElement
    const iframeWindow = iframe.contentWindow
    iframeWindow && iframeWindow.addEventListener('videoPlayEnd', this.addPlayList)
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
