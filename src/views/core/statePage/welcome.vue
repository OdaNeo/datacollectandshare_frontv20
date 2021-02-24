<template>
  <div id="welcome">
    <div class="topContent" style="height: 200px">
      <system-topic-proportion></system-topic-proportion>
      <user-proportion></user-proportion>
    </div>
    <div class="btmContent" style="height: 450px; margin-top: 24px">
      <release-menu :systemItems="systemItems"></release-menu>
      <subscribe-menu :systemItems="systemItems"></subscribe-menu>
    </div>
    <!-- <v-snackbar
        v-model="snackbar"
        >
            close
        </v-snackbar> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { returnDataType } from '@/type/http-request.type'

import echarts from '@/decorator/echartsDecorator'
import ReleaseMenu from './childComponent/releaseMenu.vue'
import SystemTopicProportion from './childComponent/systemTopicProportion.vue'
import UserProportion from './childComponent/userProportion.vue'
import SubscribeMenu from './childComponent/subscribeMenu.vue'
import http from '@/decorator/httpDecorator'

@Component({
  components: {
    ReleaseMenu,
    SubscribeMenu,
    SystemTopicProportion,
    UserProportion
  }
})
@http
@echarts
export default class Welcome extends Vue {
  private systemItems = []

  private async getRelease(params: any, callback: Function) {
    const result: returnDataType = await this.h_request.httpGET('GET_SYSTEM_GETSYSTEMINFO', params)
    callback(result)
  }

  mounted(): void {
    this.getRelease({}, (result: returnDataType) => {
      this.systemItems = result.data
    })
  }
}
</script>
<style lang="stylus" scoped>
#welcome
    width:97%
    height:100%
    margin:0 auto
    .btmContent
    .topContent
        width:100%
        display:flex
        justify-content:space-between
        .viewBox
            width:49%
            height:100%
            background:#fff
            // border: 1px solid rgb(30,31,67)
            box-shadow: 2px 6px 15px 0 rgba(69,65,78,.1)
            border-radius: 5px
            // transition: .5s all ease
            position: relative
            // animation-duration:2s
            // animation-delay:1s
        // .enter
        //     transform: scale(1.03)
::-webkit-scrollbar
    display:none
</style>
