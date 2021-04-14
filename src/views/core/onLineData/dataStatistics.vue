<template>
  <div id="OnlineDataStatistics">
    <release-menu :systemItems="systemItems"></release-menu>
    <subscribe-menu :systemItems="systemItems"></subscribe-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ReleaseMenu from '@/components/releaseMenu.vue'
import SubscribeMenu from '@/components/subscribeMenu.vue'

@Component({
  components: {
    ReleaseMenu,
    SubscribeMenu
  }
})
export default class OnlineDataStatistics extends Vue {
  private get systemItems() {
    return JSON.parse(sessionStorage.getItem('systemInfo') || '')
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
