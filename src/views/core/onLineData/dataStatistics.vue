<template>
  <div id="OnlineDataStatistics">
    <release-menu :systemItems="systemItems"></release-menu>
    <subscribe-menu :systemItems="systemItems"></subscribe-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'

import ReleaseMenu from '@/components/releaseMenu.vue'
import SubscribeMenu from '@/components/subscribeMenu.vue'

@Component({
  components: {
    ReleaseMenu,
    SubscribeMenu
  }
})
@http
export default class OnlineDataStatistics extends Vue {
  private systemItems = []

  private async getSysRelease() {
    const result: returnDataType = await this.h_request.httpGET('GET_SYSTEM_GETSYSTEMINFO', {})
    this.systemItems = result.data
  }

  mounted(): void {
    this.getSysRelease()
  }
}
</script>
<style scoped>
#OnlineDataStatistics {
  margin-top: 10px;
  width: 97%;
  height: 76vh;
  display: flex;
  justify-content: space-between;
}
</style>
