<template>
  <div id="validationInfo">
    <HTable
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <!-- 显示详情 -->
      <template v-slot:message="{ item }">
        <v-btn text color="primary" @click="showMessage(item)">显示详情</v-btn>
      </template>
    </HTable>
    <!-- 表格显示 -->
    <TDialog :width="500" v-if="tDialogFlag" v-model="tDialogFlag">
      <HContentDetails slot="default" :row="row" />
    </TDialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import http from '@/decorator/httpDecorator'
import Moment from 'moment'
import { paramsType, returnType } from '@/type/http-request.type'
import { topicTable } from '@/type/topic.type'
import { FormObj } from '@/type/dialog-form.type'
import TDialog from '@/components/t-dialog.vue'
import HContentDetails from '@/components/h-content-details.vue'

@Component({
  components: {
    HTable,
    TDialog,
    HContentDetails
  }
})
@http
export default class ValidationInfo extends Vue {
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

  @Prop() private id!: number

  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 5 // 每页展示多少条数据
  private tDialogFlag = false
  private row = ''

  private headers = [
    {
      text: '创建时间',
      align: 'center',
      value: 'createTime',
      format: (val: number) => {
        return Moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      text: '类型',
      align: 'center',
      value: 'type',
      format: (val: string) => {
        switch (val) {
          case 'isRepeat':
            return '重复数据'
          case 'isNull':
            return '字段值为空'
          case 'isStruct':
            return '结构错误'
          default:
            return val
        }
      }
    },
    {
      text: '详情',
      align: 'center',
      slot: 'message'
    }
  ]
  // 查询通用调用方法
  private async searchMethod(params: paramsType) {
    this.loading = true
    // 数据预处理
    const { data }: returnType = await this.h_request['httpGET']('GET_VALIDATION_LOG', params)
    // console.log(data)
    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    this.loading = false
  }

  // 分页方法
  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      topicId: this.id
    })
  }

  //   显示详情
  private showMessage(item: { message: string }) {
    this.formProvide.title = '查看预处理详情'
    this.row = JSON.parse(item.message)
    this.tDialogFlag = true
  }

  mounted(): void {
    this.pageNum = 1
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      topicId: this.id
    })
  }
}
</script>
