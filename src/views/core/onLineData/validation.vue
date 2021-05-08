<template>
  <div id="validationDataList">
    <HTable
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <!-- 订阅用户 -->
      <template v-slot:message="{ item }">
        <v-btn text color="primary" @click="showMessage(item)">显示详情</v-btn>
      </template>
    </HTable>
    <!-- 表格显示 -->
    <TDialog v-model="tDialogFlag">
      <HContentDetails slot="default" :row="row" />
    </TDialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import { tableHeaderType } from '@/type/table.type'
import { paramsType, returnType } from '@/type/http-request.type'
import HTable from '@/components/h-table.vue'
import TDialog from '@/components/t-dialog.vue'
import HContentDetails from '@/components/h-content-details.vue'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import Moment from 'moment'
import { FormObj } from '@/type/dialog-form.type'
@Component({
  components: {
    HTable,
    TDialog,
    HContentDetails
  }
})
@http
export default class validationDataList extends Vue {
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

  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private tDialogFlag = false
  private row = ''

  private get headers(): Array<tableHeaderType> {
    return [
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
        text: '接口类型',
        align: 'center',
        value: 'interfaceType',
        format: (val: number) => {
          return topicInterFaceType[val]
        }
      },
      {
        text: '创建时间',
        align: 'center',
        value: 'createTime',
        format: (val: number) => {
          return Moment(val).format('YYYY-MM-DD hh:mm:ss')
        }
      },
      {
        text: '类型',
        align: 'center',
        value: 'type'
      },
      {
        text: '详情',
        align: 'center',
        slot: 'message'
      }
    ]
  }

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
      pageNum: this.pageNum
    })
  }

  //   显示详情
  private showMessage(item: { message: string }) {
    this.formProvide.title = '查看预处理详情'
    this.row = JSON.parse(item.message)
    this.tDialogFlag = true
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
