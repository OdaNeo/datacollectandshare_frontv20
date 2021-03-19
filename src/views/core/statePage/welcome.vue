<template>
  <div id="welcome">
    <div class="topContent" style="height: 190px">
      <system-topic-proportion></system-topic-proportion>
      <user-proportion></user-proportion>
    </div>
    <div class="btmContent" style="height: calc(77vh - 190px); margin-top: 24px">
      <release-menu :systemItems="systemItems"></release-menu>
      <subscribe-menu :systemItems="systemItems"></subscribe-menu>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { returnDataType } from '@/type/http-request.type'

import SystemTopicProportion from './childComponent/systemTopicProportion.vue'
import UserProportion from './childComponent/userProportion.vue'
import http from '@/decorator/httpDecorator'

import ReleaseMenu from '@/components/releaseMenu.vue'
import SubscribeMenu from '@/components/subscribeMenu.vue'

@Component({
  components: {
    ReleaseMenu,
    SubscribeMenu,
    SystemTopicProportion,
    UserProportion
  }
})
@http
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
// ::-webkit-scrollbar
//     display:none
</style>
