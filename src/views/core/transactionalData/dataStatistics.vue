<template>
  <div id="TransactionalDataStatistics">
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    ></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { topicTable } from '@/type/topic.type'
import { paramsType, returnDataType } from '@/type/http-request.type'
import { dataType } from '@/enum/topic-datatype-enum.ts'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'

@Component({
  components: {
    HTable
  }
})
@http
@util
export default class TransactionalDataStatistics extends Vue {
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private desserts: Array<topicTable> = [] // 数据列表

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
      align: 'left',
      value: 'log'
      // format: (log: any) => {
      //   const _log = JSON.parse(log)
      //   let _str = ''
      //   _log
      //   for (const i in _log) {
      //     _str += `${i}:${_log[i]}`
      //   }
      //   return _str
      // }
    }
  ]
  // 查询通用调用方法 结构化数据
  private async searchMethod(params: paramsType) {
    params.faceTypes = `${topicInterFaceType['事务数据']}`
    params.dataType = dataType['结构化']

    const { data }: returnDataType = await this.h_request['httpGET']<object>('GET_TOPICS_GETOFFLINELOG', params)
    this.desserts = data.list.map((item: any) => {
      return { ...item }
    })
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
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
