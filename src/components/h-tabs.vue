<template>
  <v-tabs id="HTabs" @change="tabChange">
    <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
  </v-tabs>
</template>
<script lang="ts">
import { cancelTokenModule } from '@/store/modules/request'
import { Component, Vue, Prop } from 'vue-property-decorator'
// 触发input事件传递，父组件可使用input 或者 v-model语法糖接收
// ***此插件会在tab切换的时候取消上个tab页的请求，故请谨慎使用***
@Component({})
export default class HTabs extends Vue {
  @Prop({ required: true }) private items!: Array<string>

  private tabChange(value: unknown) {
    // // 取消其他页面请求
    cancelTokenModule.clearToken()

    this.$emit('change', value)
    this.$emit('input', value)
  }
}
</script>
