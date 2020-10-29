<template>
  <div id="dataStructureDialog">
    <h-table :headers="headers" :desserts="desserts" :height="400" style="margin-bottom: 10px"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import HTable from '../../../../components/h-table.vue'

@Component({
  components: {
    HTable
  }
})
export default class DataStructureDialog extends Vue {
  @Prop() private rowObj!: any
  @Prop() private cmdIndex!: number
  get desserts() {
    let arr = []
    const _data = this.rowObj
    arr.push({
      id: this.cmdIndex + 1,
      key: _data.consumers,
      value: _data.queueNames
    })
    return arr
  }
  private headers = [
    {
      text: '数据编码',
      align: 'center',
      value: 'id'
    },
    {
      text: '子系统名称',
      align: 'center',
      value: 'key'
    },
    {
      text: '队列名',
      align: 'center',
      value: 'value'
    }
  ]
}
</script>
