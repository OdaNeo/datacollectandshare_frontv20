<template>
  <div id="TaskInfoListDetail">
    <h-table :headers="headers" :desserts="dessertsObj"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { tableHeaderType } from '@/type/table.type'
import { topicTable } from '@/type/topic.type'
import cronstrue from 'cronstrue/i18n'
@Component({
  components: {
    HTable
  }
})
export default class TaskInfoListDetail extends Vue {
  @Prop() private dessertsObj!: Partial<topicTable>[]

  private headers: tableHeaderType[] = [
    {
      text: '任务ID',
      align: 'center',
      value: 'id'
    },
    {
      text: '任务名称',
      align: 'center',
      value: 'taskName'
    },
    {
      text: '运行周期',
      align: 'center',
      value: 'cron',
      format: (cron: string) => {
        return cron ? cronstrue.toString(cron, { locale: 'zh_CN' }) : ''
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
