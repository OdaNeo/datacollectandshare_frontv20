<template>
  <div id="viewLog">
    <v-overlay :opacity="0" v-show="waitExportAlterFlag">
      <v-alert elevation="10" width="500px" type="info">
        <span style="margin-bottom: 0">导出Excel时间较长，请耐心等待！</span>
        <span style="float: right">等待时间：{{ waitTime }}s</span>
      </v-alert>
    </v-overlay>
    <v-row>
      <HSearch :cols="2" v-model="queryUserName" label="请输入用户名" :showAppEnd="false" />
      <HSearch :cols="2" v-model="queryDescribeInfo" label="请输入描述信息" :showAppEnd="false" />
      <!-- <HSearch :cols="2" v-model="queryMethodName" label="请输入方法名称" :showAppEnd="false" />
      <HSearch :cols="2" v-model="queryMethodType" label="请输入方法类型" :showAppEnd="false" /> -->
      <v-col cols="2">
        <h-date-picker
          label="起始时间"
          :begin="true"
          :anotherDate="afterDate"
          @pickerDate="time => (beginDate = time)"
        ></h-date-picker>
      </v-col>
      <!-- <v-col cols="2">
        <h-date-picker
          label="截止时间"
          :begin="false"
          :anotherDate="beginDate"
          @pickerDate="time => (afterDate = time)"
        ></h-date-picker>
      </v-col> -->
      <v-col cols="2">
        <v-select
          height="35px"
          outlined
          dense
          v-model="timeRang"
          :items="items"
          item-text="rang"
          item-color="val"
          label="请选择时间范围"
          return-object
        >
        </v-select>
      </v-col>
      <v-col cols="1">
        <v-btn color="primary" small depressed dark @click="clickSearch(false)">查询日志</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn color="success" small depressed dark @click="exportFromDialog()">导出报表</v-btn>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :loading="loading"
      :desserts="desserts"
      :pageNum="pageNum"
      :paginationLength="paginationLength"
      @PaginationNow="PaginationNow"
    ></h-table>
    <HDialog v-if="dialogFlag" v-model="dialogFlag">
      <ExportExcelFromDialog />
    </HDialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import http from '@/decorator/httpDecorator'
import { returnType } from '@/type/http-request.type'
import util from '@/decorator/utilsDecorator'
import HDatePicker from '@/components/h-date-picker.vue'
import { topicTable } from '@/type/topic.type'
import HDialog from '@/components/h-dialog.vue'
import { mdiCloseCircleOutline } from '@mdi/js'
import HSearch from '@/components/h-search.vue'
import ExportExcelFromDialog from './child/exportExcelFromDialog.vue'
// import axios from 'axios'
// import { VUE_APP_BASE_API } from '../../../../config'
// import REQUEST_NAME from '@/api/requestName'
// import { rootStoreModule } from '@/store/modules/root'
import { FormObj } from '@/type/dialog-form.type'
import download from '@/decorator/downloadDecorator'

@Component({
  components: {
    HTable,
    HDatePicker,
    HSearch,
    ExportExcelFromDialog,
    HDialog
  }
})
@http
@util
@download
export default class ViewLog extends Vue {
  @Provide('formProvide') private formProvide: FormObj = new Vue({
    data() {
      return {
        title: '操作日志导出报表信息',
        btnName: [] as string[],
        methodName: '',
        formObj: {}
      }
    }
  })
  mdiCloseCircleOutline = mdiCloseCircleOutline
  private pageSize = 20
  private pageNum = 1
  private desserts: Array<topicTable> = []
  private loading = true
  private paginationLength = 0
  private dialogFlag = false
  private queryUserName = ''
  private queryDescribeInfo = ''
  // private queryMethodName = ''
  // private queryMethodType = ''
  private beginDate: string | null = null
  private afterDate: string | null = null
  private timeRang: any = { 'val': 3, 'rang': '3天' }
  private items: any[] = [
    { 'val': 3, 'rang': '3天' },
    { 'val': 7, 'rang': '7天' }
  ]
  private waitTime = 0
  private waitExportAlterFlag = false
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
      text: '方法类型',
      align: 'center',
      value: 'operationType'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'createdate',
      format: (time: number) => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
      }
    },
    {
      text: '描述信息',
      align: 'center',
      value: 'operation'
    }
  ]

  private async searchMethod(params: object) {
    this.loading = true
    const { data }: returnType = await this.h_request['httpGET']<object>('GET_LOGMGT_VIEWLOG_LOG_FINDALLLOG', params)

    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    this.loading = false
  }

  private PaginationNow(page: number) {
    let startTime =
      this.beginDate == null
        ? new Date().getTime() - this.timeRang.val * 24 * 3600 * 1000
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-')
    let endTime =
      this.beginDate == null
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000 >
          new Date().getTime()
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000
    this.pageNum = page
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      username: this.queryUserName ? this.queryUserName : null,
      operation:this.queryDescribeInfo?this.queryDescribeInfo:null,
      // method: this.queryMethodName ? this.queryMethodName : null,
      // operationType: this.queryMethodType ? this.queryMethodType : null,
      startTime: startTime,
      endTime: endTime
    })
  }
  // 带入查询条件
  private clickSearch() {
    let startTime =
      this.beginDate == null
        ? new Date().getTime() - this.timeRang.val * 24 * 3600 * 1000
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-')
    let endTime =
      this.beginDate == null
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000 >
          new Date().getTime()
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000
    this.pageNum = 1
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      username: this.queryUserName ? this.queryUserName : null,
      operation:this.queryDescribeInfo?this.queryDescribeInfo:null,
      // method: this.queryMethodName ? this.queryMethodName : null,
      // operationType: this.queryMethodType ? this.queryMethodType : null,
      startTime: startTime,
      endTime: endTime
    })
  }

  private async exportFrom(timer: number) {
    let startTime =
      this.beginDate == null
        ? new Date().getTime() - this.timeRang.val * 24 * 3600 * 1000
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-')
    let endTime =
      this.beginDate == null
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000 >
          new Date().getTime()
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000

    const data = await this.h_download.httpGET('GET_LOGMGT_VIEWLOG_LOG_EXPORTSYSLOG', {
      username: this.queryUserName ? this.queryUserName : null,
      operation:this.queryDescribeInfo?this.queryDescribeInfo:null,
      // method: this.queryMethodName ? this.queryMethodName : null,
      // operationType: this.queryMethodType ? this.queryMethodType : null,
      startTime: startTime,
      endTime: endTime
    })

    const filename = data.filename?.split('=')[1]

    if (filename) {
      this.h_utils.lib.downloadUtil(data, filename)
    } else {
      this.h_utils['alertUtil'].open('文件不存在或者下载失败', true, 'error')
    }
    this.waitExportAlterFlag = false
    clearInterval(timer)

    // axios({
    //   method: 'get',
    //   url: VUE_APP_BASE_API + REQUEST_NAME.GET_LOGMGT_VIEWLOG_LOG_EXPORTSYSLOG,
    //   responseType: 'blob',
    //   headers: {
    //     Authorization: rootStoreModule.UserState.token
    //   },
    //   params: {
    //     username: this.queryUserName ? this.queryUserName : null,
    //     method: this.queryMethodName ? this.queryMethodName : null,
    //     operationType: this.queryMethodType ? this.queryMethodType : null,
    //     startTime: startTime,
    //     endTime: endTime
    //   }
    // })
    //   .then(res => {
    //     this.waitExportAlterFlag = false
    //     clearInterval(timer)
    //     if (res.data) {
    //       //获取文件名
    //       let fileName = res.headers['content-disposition'].substring(
    //         res.headers['content-disposition'].indexOf('=') + 1
    //       )
    //       let blob = new Blob([res.data], { type: 'application/x-xls' })
    //       var link = document.createElement('a')
    //       link.href = window.URL.createObjectURL(blob)
    //       link.download = fileName
    //       link.click()
    //       window.URL.revokeObjectURL(link.href)
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  private async exportFromDialog() {
    let startTime =
      this.beginDate == null
        ? new Date().getTime() - this.timeRang.val * 24 * 3600 * 1000
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-')
    let endTime =
      this.beginDate == null
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000 >
          new Date().getTime()
        ? new Date().getTime()
        : this.h_utils.timeUtil.timeToStamp(this.beginDate, '-') + this.timeRang.val * 24 * 3600 * 1000
    let params = {
      username: this.queryUserName ? this.queryUserName : null,
      operation:this.queryDescribeInfo?this.queryDescribeInfo:null,
      // method: this.queryMethodName ? this.queryMethodName : null,
      // operationType: this.queryMethodType ? this.queryMethodType : null,
      startTime: startTime,
      endTime: endTime
    }
    const { data }: returnType = await this.h_request['httpGET']<object>('GET_LOGMGT_VIEWLOG_LOG_SYSLOGCOUNT', params)
    if (data > 0) {
      this.dialogFlag = true
      this.formProvide.btnName = ['确定', '取消']
      this.formProvide.methodName = 'beginExportExcelFrom'
      this.formProvide.formObj = params
    }
  }

  private async beginExportExcelFrom() {
    this.dialogFlag = false
    this.waitExportAlterFlag = true
    let timer = setInterval(() => {
      this.waitTime++
    }, 1000)
    this.exportFrom(timer)
  }

  created(): void {
    this.searchMethod({
      pageSize: this.pageSize,
      pageNum: 1,
      startTime: new Date().getTime() - this.timeRang.val * 24 * 3600 * 1000,
      endTime: new Date().getTime()
    })
    this.pageNum = 1
  }
}
</script>
