<template>
  <div id="ColumnDetail">
    <h-table :headers="headers" :desserts="dessertsObj"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { tableHeaderType } from '@/type/table.type'
import { topicTable } from '@/type/topic.type'

@Component({
  components: {
    HTable
  }
})
export default class ColumnDetail extends Vue {
  @Prop() private dessertsObj!: Partial<topicTable>[]

  private headers: tableHeaderType[] = [
    {
      text: '字段名',
      align: 'center',
      value: 'field'
    },
    {
      text: '类型',
      align: 'center',
      value: 'type'
    },
    {
      text: '是否为key',
      align: 'center',
      value: 'iskey'
    }
  ]
}
</script>
