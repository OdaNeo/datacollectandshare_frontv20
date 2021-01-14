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

  get videoList(): Array<string> {
    const str = this.$route.query.videoList as string
    return str.split(',')
  }
  private curIndex = 0

  private playVideo() {
    this.video = this.$refs.video as HTMLVideoElement
    if (Hls.isSupported()) {
      this.dp = new DPlayer({
        container: this.video,
        // live: true,
        autoplay: true,
        video: {
          url: this.videoList[this.curIndex],
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
        console.log('ended')
      })
    }
  }

  mounted(): void {
    if (typeof this.$route.query.videoList === 'string') {
      this.playVideo()
    }
  }
}
</script>

<style scoped></style>
