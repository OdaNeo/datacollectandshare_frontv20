<template>
  <div id="OnlineDataStatistics"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import util from '@/decorator/utilsDecorator'

@Component
@http
@util
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
  width: 100%;
  height: 100%;
}
</style>
