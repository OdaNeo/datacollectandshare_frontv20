<template>
  <div id="welcome">
    <div class="topContent" style="height: 190px">
      <system-topic-proportion></system-topic-proportion>
      <user-proportion></user-proportion>
    </div>
    <div class="btmContent" style="height: calc(82vh - 190px); margin-top: 24px">
      <release-menu :systemItems="systemItems"></release-menu>
      <subscribe-menu :systemItems="systemItems"></subscribe-menu>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SystemTopicProportion from './childComponent/systemTopicProportion.vue'
import UserProportion from './childComponent/userProportion.vue'
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
export default class Welcome extends Vue {
  private get systemItems() {
    return JSON.parse(sessionStorage.getItem('systemInfo') || '')
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
        &:hover
          box-shadow: 1px 6px 15px 0 rgba(69,65,78,.1)

// ::-webkit-scrollbar
//     display:none
</style>
