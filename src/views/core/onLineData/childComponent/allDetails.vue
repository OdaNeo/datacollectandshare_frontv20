<template>
  <div id="allDetails">
    <h-table :headers="headers" :desserts="rowObj"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import util from '@/decorator/utilsDecorator'
@Component({
  components: {
    HTable
  }
})
@util
export default class AllDetails extends Vue {
  @Prop() private rowObj!: unknown
  // value: 'subscribe'
  // value: 'auditTime',
  private headers = [
    {
      text: '订阅时间',
      align: 'center',
      value: 'subscribe',
      format: (time: number): string => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
      }
    },
    {
      text: '订阅用户',
      align: 'center',
      value: 'value'
    },
    {
      text: '审核时间',
      align: 'center',
      value: 'auditTime',
      format: (time: number): string => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
      }
    },
    {
      text: '审核人',
      align: 'center',
      value: 'value'
    }
  ]
}
</script>
