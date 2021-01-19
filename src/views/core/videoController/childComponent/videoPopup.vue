<template>
  <v-dialog v-model="dialog" persistent width="800">
    <v-card>
      <v-card-title>
        <p class="mb-0">视频列表</p>
        <v-btn icon class="close-btn" @click.stop="closeMethod">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <div style="font-size: 12px; text-align: center">
        该时间段（{{ formProvide.formObj.startTime }}日{{ formProvide.formObj.startHour }}时到{{
          formProvide.formObj.endTime
        }}日{{ formProvide.formObj.endHour }}时），应有{{ videoCounts }}个视频，已查询到{{
          videoList.length
        }}个视频，正在播放第{{ curIndex + 1 }}个视频。
      </div>
      <v-slide-group v-model="model" class="pa-4" show-arrows>
        <v-slide-item v-for="(item, index) in videoList" :key="item.id">
          <v-btn
            class="mx-2"
            :class="{ primary: curIndex === index }"
            small
            depressed
            rounded
            @click="toggleCurrentPlay(index)"
          >
            {{ item.timer }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
      <div style="width: 800px; height: 450px" ref="video" id="video" />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model, Prop, Inject } from 'vue-property-decorator'
// import Hls from 'hls.js'
import DPlayer, { DPlayerEvents } from 'dplayer'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class VideoPopup extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private videoCounts!: number
  @Prop() private videoList!: Array<any>

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

  private curIndex = 0

  private playVideo(str: string) {
    this.video = this.$refs.video as HTMLVideoElement
    // if (Hls.isSupported()) {
    this.dp = new DPlayer({
      container: this.video,
      autoplay: true,
      video: {
        url: str
      }
    })

    this.dp.on('ended' as DPlayerEvents, () => {
      if (this.curIndex + 1 < this.videoList.length) {
        this.toggleCurrentPlay(this.curIndex + 1)
      }
    })
    // }
  }

  private toggleCurrentPlay(index: number) {
    this.curIndex = index
    this.playVideo(this.videoList[index].url)
  }

  mounted(): void {
    this.toggleCurrentPlay(0)
  }
}
</script>
