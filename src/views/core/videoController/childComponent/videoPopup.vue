<template>
  <v-dialog v-model="dialog" persistent max-width="900">
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
          :key="item"
          v-slot="{ active, toggle }"
          @change="toggleCurrentPlay(index)"
        >
          <v-btn class="mx-2" :input-value="active" active-class="primary" small depressed rounded @click="toggle">
            {{ item }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
      <div ref="video" />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import Hls from 'hls.js'
import DPlayer from 'dplayer'

@Component
export default class VideoPopup extends Vue {
  @Prop() private videoList!: Array<string>
  @Model('closeDialog', { type: Boolean }) private checked!: boolean
  get dialog(): boolean {
    return this.checked
  }
  // set dialog(val: boolean) {}
  private closeMethod() {
    this.$emit('closeDialog')
  }

  private model = null
  private curIndex = 0
  private video: HTMLVideoElement | undefined
  private dp: DPlayer | undefined
  get videoNameList(): Array<string> {
    const _l: Array<string> = []
    this.videoList.forEach(item => {
      const i = item.split('?')[0].split('/')
      _l.push(i[i.length - 1])
    })
    return _l
  }

  private toggleCurrentPlay(n: number) {
    this.video = this.$refs.video as HTMLVideoElement
    if (Hls.isSupported()) {
      this.dp = new DPlayer({
        container: this.video,
        live: true,
        autoplay: true,
        video: {
          url: this.videoList[n],
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
    }
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
