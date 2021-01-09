<template>
  <div id="dataStructureDialog">
    <h-table :headers="headers" :desserts="desserts" :height="400" class="mb-10"></h-table>
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
export default class DataStructureDialog extends Vue {
  @Prop() private rowObj!: any
  get desserts(): Array<{}> {
    const arr = []
    const _data = this.rowObj
    const _consumers = _data.consumers.split(',')
    const _queueNames = _data.queueNames.split(',')
    for (let i = 0; i < _consumers.length; i++) {
      arr.push({
        id: i + 1,
        key: _consumers[i],
        value: _queueNames[i]
      })
    }
    return arr
  }
  private headers = [
    {
      text: '数据编码',
      align: 'center',
      value: 'id'
    },
    {
      text: '订阅系统名称',
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
