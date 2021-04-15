<template>
  <div id="TransactionalDataStatistics">
    <v-row>
      <HSearch
        v-model="currentTopicId"
        @append="changeQuery"
        @enter="changeQuery"
        @clear="clearInput"
        label="请输入查找的事务主题ID"
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
      <template v-slot:status="{ item }">
        <!-- 有res ：success，无res：error -->
        <v-btn text :color="transactionalStatus(item) ? `success` : `error`">
          {{ transactionalStatus(item) ? `成功` : '失败' }}
        </v-btn>
      </template>
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click="offlineLogDetails(item)">查看离线日志详情</v-btn>
      </template>
    </h-table>
    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <ContentDetails :rowJson="rowJson" />
      <v-btn
        slot="button"
        color="primary"
        :disabled="!rowJson"
        text
        v-clipboard:copy="rowJson"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        >一键复制</v-btn
      >
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { topicTable } from '@/type/topic.type'
import { paramsType, returnType } from '@/type/http-request.type'
import { dataType } from '@/enum/topic-datatype-enum'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import TDialog from '@/components/t-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import ContentDetails from './childComponent/contentDetails.vue'
import HSearch from '@/components/h-search.vue'
@Component({
  components: {
    HTable,
    TDialog,
    HSearch,
    ContentDetails
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
  private currentTopicId = ''

  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 10 // 每页展示多少条数据
  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true
  private headers = [
    // 表头内容 所有主题
    {
      text: 'ID',
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
        return this.h_utils.timeUtil['stamptoFullTime'](new Date(createTime).getTime(), '/')
      }
    },
    {
      text: '状态',
      align: 'center',
      slot: 'status'
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

  // 查询通用调用方法
  private async searchMethod(params: paramsType, topicId: string) {
    this.loading = true

    if (!topicId) {
      // 获得全部
      params.faceTypes = `${topicInterFaceType['事务数据']}`
      params.dataType = dataType['结构化']
      const { data }: returnType = await this.h_request['httpGET']<object>('GET_TOPICS_GETOFFLINELOG', params)
      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.['total'] / this.pageSize) || 1
    } else {
      // 按照topicId查询
      params.topicId = topicId
      params.num = -1
      const { data } = await this.h_request['httpGET']('GET_TOPICS_GETOFFLINELOGBYTOPICID', params)
      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.['total'] / this.pageSize) || 1
    }
    this.loading = false
  }

  // 任务状态
  private transactionalStatus(item: { log: string }) {
    return !!JSON.parse(item.log)['res']
  }

  // 改变query
  private changeQuery() {
    // 防止路由重复点击报错
    this.$router.replace({
      query: {
        topicId: this.currentTopicId ? this.currentTopicId : undefined
      }
    })
  }

  // 清空搜索栏
  private clearInput() {
    this.$router.replace({
      query: {
        topicId: undefined
      }
    })
  }

  // 分页方法
  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod(
      {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      },
      this.$route.query.topicId ? this.$route.query.topicId.toString() : ''
    )
  }

  // 复制
  private onCopy() {
    this.h_utils.alertUtil.open('复制成功', true, 'success', 1500)
  }
  // 复制
  private onError() {
    this.h_utils.alertUtil.open('复制失败', true, 'error', 1500)
  }

  @Watch(`$route.query.topicId`, { immediate: true })
  private test(val: string) {
    this.currentTopicId = val
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
    this.currentTopicId = this.$route.query.topicId ? this.$route.query.topicId.toString() : ''
  }
}
</script>
