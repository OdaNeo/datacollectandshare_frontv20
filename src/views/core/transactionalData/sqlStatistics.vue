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
      <template v-slot:status="{ item }">
        <v-btn text :color="getSqlStatus(item.status)['color']">{{ getSqlStatus(item.status)['text'] }}</v-btn>
      </template>
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click.stop="sqlLogDetails(item)">查看SQL日志详情</v-btn>
      </template>
    </h-table>
    <!-- 表格显示 -->
    <t-dialog v-if="tDialogFlag" v-model="tDialogFlag">
      <HContentDetails :row="row" />
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
import HContentDetails from '@/components/h-content-details.vue'

@Component({
  components: {
    HTable,
    TDialog,
    HContentDetails
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
  private row = ''

  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 10 // 每页展示多少条数据
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
      slot: 'status'
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

  // 查看日志详情
  private sqlLogDetails(item: { log: string }) {
    this.row = item.log
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

  // sql status
  private getSqlStatus(num: number) {
    switch (num) {
      case 0:
        return {
          text: `正在执行`,
          color: 'primary'
        }
      case 1:
        return {
          text: `成功`,
          color: 'success'
        }
      case 2:
        return {
          text: `失败`,
          color: 'error'
        }
      case 3:
        return {
          text: `正在执行`,
          color: 'primary'
        }
      default:
        return {
          text: `正在执行`,
          color: 'primary'
        }
    }
  }

  // 分页方法
  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum
    })
  }

  // 复制
  private onCopy() {
    this.h_utils.alertUtil.open('复制成功', true, 'success', 1500)
  }
  // 复制
  private onError() {
    this.h_utils.alertUtil.open('复制失败', true, 'error', 1500)
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
