<template>
  <div id="LoggerDetail">
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
export default class loggerDetail extends Vue {
  @Prop() private dessertsObj!: Partial<topicTable>[]

  private headers: tableHeaderType[] = [
    {
      text: '自增属性最大值',
      align: 'center',
      value: 't',
      format: (t: { maxValues: string }) => {
        return t.maxValues
      }
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'createTime'
    },
    {
      text: '最后运行时间',
      align: 'center',
      value: 'lastRunTime'
    },
    {
      text: '修改时间',
      align: 'center',
      value: 'updateTime'
    }
  ]
}
</script>
