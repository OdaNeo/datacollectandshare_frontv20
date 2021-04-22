<template>
  <div id="logDataDialog">
    <h-table :headers="headersObj" :desserts="dessertsObj"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'

@Component({
  components: {
    HTable
  }
})
export default class LogDataDialog extends Vue {
  @Prop() private dessertsObj!: unknown

  private headersObj = [
    {
      text: '服务器地址',
      align: 'center',
      value: 'logIp'
    },
    {
      text: '服务器用户名',
      align: 'center',
      value: 'logUserName'
    },
    {
      text: '日志采集路径',
      align: 'center',
      value: 'savePath'
    }
  ]
}
</script>
