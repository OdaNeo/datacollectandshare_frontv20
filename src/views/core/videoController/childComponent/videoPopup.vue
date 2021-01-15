<template>
  <v-dialog v-model="dialog" persistent width="800">
    <v-card>
      <v-card-title class="dialog-title">
        <p class="mb-0">视频列表</p>
        <!-- <span style="font-size: 12px"
          >该时间段（{{ formProvide.formObj.startTime }}{{ formProvide.formObj.startHour }}时到{{
            formProvide.formObj.endTime
          }}{{ formProvide.formObj.endHour + 1 }}时），应有{{ videoCounts }}个视频，已查询到{{
            videoList.length
          }}个视频，正在播放第{{ curIndex + 1 }}个视频</span
        > -->
        <v-btn icon class="close-btn" @click.stop="closeMethod">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-slide-group v-model="model" class="pa-4" show-arrows>
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
      <div style="width: 800px; height: 450px" ref="video" id="video" />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model, Prop, Inject } from 'vue-property-decorator'
import { videoStoreModule } from '@/store/modules/video'
import Hls from 'hls.js'
import DPlayer, { DPlayerEvents } from 'dplayer'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class VideoPopup extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private videoCounts!: number
  @Model('closeDialog', { type: Boolean }) private checked!: boolean

  private video: HTMLVideoElement | undefined
  public dp: DPlayer | undefined

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

  private playVideo(str: string) {
    this.video = this.$refs.video as HTMLVideoElement
    if (Hls.isSupported()) {
      this.dp = new DPlayer({
        container: this.video,
        // live: true,
        autoplay: true,
        video: {
          url: str,
          type: 'customHls',
          customType: {
            customHls: function (video: HTMLVideoElement) {
              const hls = new Hls()
              hls.loadSource(video.src)
              hls.attachMedia(video)
            }
          }
        }
      })

      this.dp.on('ended' as DPlayerEvents, () => {
        // 播放下一视频
        // const vEvent = new CustomEvent('videoPlayEnd')
        // this.video && this.video.dispatchEvent(vEvent)
        if (this.curIndex + 1 < this.videoList.length) {
          this.toggleCurrentPlay(this.curIndex + 1)
        }
      })
    }
  }

  private toggleCurrentPlay(index: number) {
    this.curIndex = index
    this.playVideo(this.videoList[index])
    // const iframe = this.$refs.iframe as HTMLIFrameElement
    // const iframeWindow = iframe.contentWindow as Window
    // // force refresh
    // this.curIndex = index
    // iframeWindow.location.reload(true)
    // iframeWindow.addEventListener('ended', () => {
    //   console.log('videoPlayEnd')
    //   if (this.curIndex + 1 < this.videoList.length) {
    //     this.toggleCurrentPlay(this.curIndex + 1)
    //   }
    // })
  }

  mounted(): void {
    console.log(this.formProvide.formObj.startTime)
    console.log(this.formProvide.formObj.endTime)
    this.toggleCurrentPlay(0)
  }
}
</script>
