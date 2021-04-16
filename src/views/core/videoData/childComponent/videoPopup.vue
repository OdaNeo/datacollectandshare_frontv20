<template>
  <v-dialog v-model="dialog" persistent width="800">
    <v-card>
      <v-card-title>
        <p class="mb-0" style="user-select: none">视频列表</p>
        <v-btn icon class="close-btn" @click.stop="closeMethod">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <div style="font-size: 14px; text-align: center; user-select: none">
        共有{{ videoCountsReal }}个视频，正在播放第{{ curIndex + 1 }}个视频。
      </div>
      <v-slide-group v-model="model" class="pa-4 my-1" show-arrows center-active>
        <v-slide-item v-for="(item, index) in videoList" :key="item.id" v-slot="{ toggle }">
          <v-btn
            class="mx-2"
            :class="{ primary: curIndex === index }"
            small
            depressed
            rounded
            @click="
              toggle()
              handleBtnCLick(index)
            "
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
import { Component, Vue, Model, Prop } from 'vue-property-decorator'
// import Hls from 'hls.js'
import DPlayer, { DPlayerEvents } from 'dplayer'
import util from '@/decorator/utilsDecorator'
import { mdiClose } from '@mdi/js'

@Component
@util
export default class VideoPopup extends Vue {
  // @Prop() private videoCounts!: number
  @Prop() private videoCountsReal!: number
  @Prop() private videoList!: Array<any>
  @Model('closeDialog', { type: Boolean }) private checked!: boolean
  private mdiClose = mdiClose

  private video: HTMLVideoElement | undefined
  public dp: DPlayer | undefined

  get dialog(): boolean {
    return this.checked
  }

  private closeMethod() {
    this.h_utils['alertUtil'].close()
    this.dp?.destroy()
    this.$emit('closeDialog')
  }
  private model = null
  private curIndex = 0

  private playVideo(str: string) {
    // 实例化前销毁可能存在的实例
    this.dp?.destroy()
    this.video = this.$refs.video as HTMLVideoElement
    this.dp = new DPlayer({
      container: this.video,
      autoplay: true,
      video: {
        url: str ? str : ''
      }
    })

    if (!str) {
      // 视频不存在
      this.dp.pause()
      this.h_utils['alertUtil'].open('该时间段视频不存在', true, 'error', 1000)
      if (this.curIndex + 1 < this.videoList.length) {
        this.toggleCurrentPlay(this.curIndex + 1)
      }
      return
    } else {
      // 视频存在
      this.dp.play()
      this.h_utils['alertUtil'].close()
    }

    this.dp?.on('ended' as DPlayerEvents, () => {
      if (this.curIndex + 1 < this.videoList.length) {
        this.toggleCurrentPlay(this.curIndex + 1)
      }
    })
  }

  private toggleCurrentPlay(index: number) {
    this.curIndex = index
    this.playVideo(this.videoList[index].url)
  }

  // 点击事件
  private handleBtnCLick(index: number) {
    if (this.videoList[index].url) {
      this.toggleCurrentPlay(index)
    } else {
      this.h_utils['alertUtil'].open('该时间段视频不存在', true, 'error', 1000)
    }
  }

  mounted(): void {
    this.toggleCurrentPlay(0)
    // console.log(this.videoCountsReal)
  }
}
</script>
<style scoped>
.close-btn {
  position: absolute;
  right: 14px;
  top: 14px;
}
</style>
