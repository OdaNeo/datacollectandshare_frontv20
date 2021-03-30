<template>
  <div id="SqlStatistics">
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click.stop="sqlLogDetails(item)">查看SQL日志详情</v-btn>
      </template>
    </h-table>
    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <SqlDetails :str="str" />
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { topicTable } from '@/type/topic.type'
import { paramsType, returnType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import TDialog from '@/components/t-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import SqlDetails from './childComponent/sqlDetails.vue'

@Component({
  components: {
    HTable,
    TDialog,
    SqlDetails
  }
})
@http
@util
export default class SqlStatistics extends Vue {
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
  private str = ''

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
      text: '文件路径',
      align: 'center',
      value: 'filePath'
    },
    {
      text: '上传文件名',
      align: 'center',
      value: 'originalFileName'
    },
    {
      text: '状态',
      align: 'center',
      value: 'status',
      format: (status: number) => {
        switch (status) {
          case 0:
            return `正在执行`
          case 1:
            return `成功`
          case 2:
            return `失败`
          case 3:
            return `正在执行`
          default:
            return `正在执行`
        }
      }
    },
    {
      text: '上传文件名',
      align: 'center',
      value: 'originalFileName'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'createTime'
    },
    {
      text: '日志',
      align: 'center',
      slot: 'buttons'
    }
  ]
  // 正在执行,
  //   成功,
  //   失败
  // }
  // 查看日志详情
  private sqlLogDetails(item: { log: string }) {
    this.str = item.log
    this.tDialogFlag = true
    this.formProvide.title = '查看SQL日志详情'
  }

  // 查询通用调用方法
  private async searchMethod(params: paramsType) {
    this.loading = true
    const { data }: returnType = await this.h_request['httpGET']('GET_TOPICS_SQLFILERECORD', params)
    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.['total'] / this.pageSize) || 1
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
<style>
#SqlStatistics {
  margin-top: 10px;
}
</style>
