<template>
  <div id="taskList">
    <v-row no-gutters>
      <HSearch
        v-model="currenttaskId"
        @append="changeQuery"
        @enter="changeQuery"
        @clear="clearInput"
        label="请输入查找的任务ID"
        v-only-num
      />
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <!-- 执行结果 -->
      <template v-slot:status="{ item }">
        <v-btn text :color="offlineResultColor[item.result]">
          {{ offlineResult[item.result] }}
        </v-btn>
      </template>
      <!-- buttons -->
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click="offlineLogDetails(item)">查看日志详情</v-btn>
      </template>
    </h-table>
    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <HContentDetails slot="default" :row="row" />
    </t-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { paramsType, returnType } from '@/type/http-request.type'
import util from '@/decorator/utilsDecorator'
import HTabs from '@/components/h-tabs.vue'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import HSearch from '@/components/h-search.vue'
import { taskResult, taskResultColor } from '@/enum/state-enum'
import { FormObj } from '@/type/dialog-form.type'
import TDialog from '@/components/t-dialog.vue'
import HContentDetails from '@/components/h-content-details.vue'

@Component({
  components: {
    HTabs,
    HTable,
    HSearch,
    TDialog,
    HContentDetails
  }
})
@http
@util
export default class TaskList extends Vue {
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
  private row = ''

  private offlineResult = taskResult
  private offlineResultColor = taskResultColor

  private currenttaskId = ''
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 10 // 每页展示多少条数据
  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true
  private headers = [
    // 表头内容 所有主题
    {
      text: '作业ID',
      align: 'center',
      value: 'id'
    },
    {
      text: '所属任务ID',
      align: 'center',
      value: 'taskId'
    },
    {
      text: '执行时间',
      align: 'center',
      value: 'executeTime'
    },
    {
      text: '执行结果',
      align: 'center',
      slot: 'status'
    },
    {
      text: '日志',
      align: 'center',
      slot: 'buttons'
    }
  ]

  // 查询通用调用方法
  private async searchMethod(params: paramsType, taskId: string) {
    this.loading = true
    taskId && (params.taskId = taskId)

    const { data }: returnType = await this.h_request['httpGET']<object>('GET_OFFLINE_SELECTOFFLINELOG', params)

    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.['total'] / this.pageSize) || 1
    this.loading = false
  }

  // 改变query
  private changeQuery() {
    // 防止路由重复点击报错
    this.$router.replace({
      query: {
        taskId: this.currenttaskId ? this.currenttaskId : undefined
      }
    })
  }

  // 清空搜索栏
  private clearInput() {
    this.$router.replace({
      query: {
        taskId: undefined
      }
    })
  }

  // 查看日志详情
  private offlineLogDetails(item: { log: string }) {
    this.tDialogFlag = true
    this.formProvide.title = '查看离线日志详情'
    this.row = item.log
  }

  // 分页方法
  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod(
      {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      },
      this.$route.query.taskId ? this.$route.query.taskId.toString() : ''
    )
  }

  @Watch(`$route.query.taskId`, { immediate: true })
  private test(val: string) {
    this.currenttaskId = val
    this.pageNum = 1
    this.searchMethod(
      {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      },
      val
    )
  }

  created(): void {
    this.currenttaskId = this.$route.query.taskId ? this.$route.query.taskId.toString() : ''
  }
}
</script>
