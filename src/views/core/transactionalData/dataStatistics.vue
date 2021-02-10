<template>
  <div id="TransactionalDataStatistics">
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click.stop="offlineLogDetails(item)">查看离线日志详情</v-btn>
      </template>
    </h-table>
    <!-- 表格显示 -->
    <t-dialog v-if="tDialogFlag" v-model="tDialogFlag">
      <OfflineLogData :rowJson="rowJson" />
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { topicTable } from '@/type/topic.type'
import { paramsType, returnDataType } from '@/type/http-request.type'
import { dataType } from '@/enum/topic-datatype-enum.ts'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import OfflineLogData from './childComponent/offlineLogData.vue'
import TDialog from '@/components/t-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'

@Component({
  components: {
    HTable,
    OfflineLogData,
    TDialog
  }
})
@http
@util
export default class TransactionalDataStatistics extends Vue {
  @Provide('formProvide') private formProvide: FormObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {}
      }
    }
  })

  private tDialogFlag = false
  private rowJson = ''

  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true
  private headers = [
    // 表头内容 所有主题
    {
      text: '序号',
      align: 'center',
      value: 'id'
    },
    {
      text: '主题ID',
      align: 'center',
      value: 'topicId'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'createTime',
      format: (createTime: string) => {
        return this.h_utils.timeutil['stamptoFullTime'](new Date(createTime).getTime(), '/')
      }
    },
    {
      text: '日志',
      align: 'center',
      slot: 'buttons'
    }
  ]

  // 查看日志详情
  private offlineLogDetails(item: { log: string }) {
    this.tDialogFlag = true
    this.formProvide.title = '查看离线日志详情'
    this.rowJson = item.log
  }

  // 查询通用调用方法 结构化数据
  private async searchMethod(params: paramsType) {
    this.loading = true
    params.faceTypes = `${topicInterFaceType['事务数据']}`
    params.dataType = dataType['结构化']

    const { data }: returnDataType = await this.h_request['httpGET']<object>('GET_TOPICS_GETOFFLINELOG', params)
    this.desserts = data.list.map((item: any) => {
      return { ...item }
    })
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    this.loading = false
  }

  // 分页方法
  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum
    })
  }

  created(): void {
    this.pageNum = 1
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum
    })
  }
}
</script>
<style scoped>
#TransactionalDataStatistics {
  margin-top: 50px;
}
</style>
