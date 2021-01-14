<template>
  <div ref="video" id="video" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Hls from 'hls.js'
import DPlayer, { DPlayerEvents } from 'dplayer'

@Component
export default class streamVideo extends Vue {
  private video: HTMLVideoElement | undefined
  public dp: DPlayer | undefined

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
        var vEvent = new CustomEvent('videoPlayEnd', {
          bubbles: true, // 是否冒泡
          cancelable: true // 是否可以取消事件的默认行为
        })
        window.dispatchEvent(vEvent)
      })
    }
  }

  mounted(): void {
    if (typeof this.$route.query.video === 'string') {
      this.playVideo(this.$route.query.video)
    }
  }
}
</script>

<style scoped></style>
