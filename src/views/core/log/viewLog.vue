<template>
  <div id="viewLog">
    <v-row>
      <v-col cols="2">
        <v-text-field solo dense placeholder="请输入查找的用户名" clearable v-model="queryUserName"></v-text-field>
      </v-col>
      <v-col cols="2">
        <h-date-picker
          label="选择查询起始时间"
          :begin="true"
          :anotherDate="afterDate"
          @pickerDate="time => (beginDate = time)"
        ></h-date-picker>
      </v-col>
      <v-col cols="2">
        <h-date-picker
          placeholder="选择查询截止时间"
          :begin="false"
          :anotherDate="beginDate"
          @pickerDate="time => (afterDate = time)"
        ></h-date-picker>
      </v-col>
      <v-col cols="2">
        <v-btn :height="39" color="primary" dark @click="clickSearch">查询</v-btn>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :paginationLength="paginationLength"
      @PaginationNow="PaginationNow"
    ></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import util from '@/decorator/utilsDecorator'
import HDatePicker from '@/components/h-date-picker.vue'

@Component({
  components: {
    HTable,
    HDatePicker
  }
})
@http
@util
export default class ViewLog extends Vue {
  private pageSize = 20
  private pageNum = 1
  private desserts: Array<any> = []
  private paginationLength = 0
  private dialogFlag = false
  private queryUserName = ''
  private beginDate: string | null = null
  private afterDate: string | null = null
  private headers = [
    {
      text: '用户名称',
      align: 'center',
      value: 'username'
    },
    {
      text: '用户IP',
      align: 'center',
      value: 'ip'
    },
    {
      text: '方法名称',
      align: 'center',
      value: 'method'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'createdate',
      format: (time: number) => {
        return this.h_utils.timeutil.stamptoTime(time, '-')
      }
    },
    {
      text: '描述信息',
      align: 'center',
      value: 'operation'
    }
  ]

  private async searchMethod(params: object) {
    const { data }: returnDataType = await this.h_request['httpGET']<object>(
      'GET_LOGMGT_VIEWLOG_LOG_FINDALLLOG',
      params
    )
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    this.desserts = data['list']
  }

  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      username: this.queryUserName ? this.queryUserName : null,
      startTime: this.beginDate ? this.h_utils.timeutil.timeToStamp(this.beginDate, '-') : null,
      endTime: this.afterDate ? this.h_utils.timeutil.timeToStamp(this.afterDate, '-') : null
    })
  }
  // 带入查询条件
  private clickSearch() {
    this.pageNum = 1
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      username: this.queryUserName ? this.queryUserName : null,
      startTime: this.beginDate ? this.h_utils.timeutil.timeToStamp(this.beginDate, '-') : null,
      endTime: this.afterDate ? this.h_utils.timeutil.timeToStamp(this.afterDate, '-') : null
    })
  }

  created(): void {
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: 1
    })
    this.pageNum = 1
  }
}
</script>
