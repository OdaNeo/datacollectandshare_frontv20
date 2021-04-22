<template>
  <div id="TopicAlert">
    <h-table :headers="headers" :desserts="dessertsObj">
      <!-- 状态 -->
      <template v-slot:status="{ item }">
        <v-btn text :color="calendarColorType[item.status]">{{ calendarType[item.status] }}</v-btn>
      </template>
    </h-table>
    <div class="ml-8 mt-4" v-if="formProvide.formObj.total > 5">
      ...... 还有{{ formProvide.formObj.total - 5 }}条报警信息
    </div>
    <div class="mb-1 d-flex" v-if="formProvide.formObj.total !== 0">
      <v-spacer />
      <v-btn class="mx-4" text color="primary" @click="router">查看更多详情</v-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { tableHeaderType } from '@/type/table.type'
import { topicTable } from '@/type/topic.type'
import { calendarType, calendarColorType } from '@/enum/calendar-enum'
import { H_Vue } from '@/declaration/vue-prototype'
import Moment from 'moment'
@Component({
  components: {
    HTable
  }
})
export default class TopicAlert extends Vue {
  @Prop() private dessertsObj!: Partial<topicTable>[]
  @Inject() private readonly formProvide!: H_Vue

  private calendarType = calendarType
  private calendarColorType = calendarColorType

  private headers: tableHeaderType[] = [
    {
      text: '时间',
      align: 'center',
      value: 'createTime',
      format: (value: string) => {
        return Moment(Number(value)).format('YYYY-MM-DD')
      }
    },
    {
      text: '状态',
      align: 'center',
      slot: 'status'
    },
    {
      text: '描述信息',
      align: 'center',
      value: 'tip'
    }
  ]

  private router() {
    if (!this.formProvide.formObj.id) {
      return
    }

    this.$router.push({
      name: `监控日志`,
      query: {
        topicId: `${this.formProvide.formObj.id}`
      }
    })
  }
}
</script>
