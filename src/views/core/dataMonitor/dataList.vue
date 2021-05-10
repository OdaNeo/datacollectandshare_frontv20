<template>
  <div id="dataMonitor">
    <v-row>
      <!-- 作业名 -->
      <v-col cols="2">
        <v-select
          v-model="queryServerName"
          outlined
          dense
          :items="serverNameItems"
          height="35px"
          label="请选择作业名"
          @change="searchHandler(1)"
          v-only-num
        ></v-select>
      </v-col>
      <!-- 作业ID -->
      <v-col cols="2">
        <v-text-field
          v-model="queryTopicID"
          :disabled="!queryServerName"
          outlined
          dense
          height="35px"
          @keyup.enter="searchHandler(1)"
          :label="`请输入${topicTaskFlag}ID`"
          v-only-num
        ></v-text-field>
      </v-col>
      <!-- 状态 -->
      <v-col cols="2">
        <v-select
          v-model="queryStatus"
          outlined
          dense
          :items="statusItems"
          height="35px"
          :label="`请选择${topicTaskFlag}状态`"
          v-only-num
        ></v-select>
      </v-col>
      <!-- 时间范围 -->
      <v-col cols="3">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-click="false"
          :close-on-content-click="false"
          transition="scale-transition"
          :return-value.sync="dates"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              outlined
              placeholder="请选择时间范围"
              height="35px"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker locale="zh-Hans" v-model="dates" no-title range :allowed-dates="allowedDates">
            <v-spacer></v-spacer>
            <v-btn text color="grey" @click="menu = false">取消</v-btn>
            <v-btn text :disabled="dates.length < 2" color="primary" @click="$refs.menu.save(dates)">确定</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <!-- 查询 -->
      <v-col>
        <v-btn color="primary" small depressed dark @click="searchHandler(1)">搜索日志</v-btn>
        <v-btn color="primary" small height="35px" class="ml-4" text @click="resetSearchQuery">清空搜索</v-btn>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <!-- 状态 -->
      <template v-slot:status="{ item }">
        <v-btn text :color="calendarColorType[item.status]">{{ calendarType[item.status] }}</v-btn>
      </template>

      <!-- 详情 -->
      <template v-slot:details="{ item }">
        <v-btn text color="primary" @click="dataStructure(item.remarks)">日志信息详情</v-btn>
      </template>
    </h-table>

    <!-- 表格显示 -->
    <t-dialog v-if="tDialogFlag" v-model="tDialogFlag">
      <HContentDetails :row="row" v-if="tDialogShow === 1" />
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import { realTimeData } from '@/type/calendar'
import { calendarType, calendarColorType } from '@/enum/calendar-enum'
import { paramsType, returnType } from '@/type/http-request.type'
import TDialog from '@/components/t-dialog.vue'
import HContentDetails from '@/components/h-content-details.vue'
import { FormObj } from '@/type/dialog-form.type'
import { mdiMagnify } from '@mdi/js'
import Moment from 'moment'
import { tableHeaderType } from '@/type/table.type'

@Component({
  components: {
    HTable,
    TDialog,
    HContentDetails
  }
})
@http
@util
export default class dataMonitor extends Vue {
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

  private calendarType = calendarType
  private calendarColorType = calendarColorType

  private dates: string[] = []
  // 显示的时间范围
  private get dateRangeText() {
    return this.dates.length > 1 ? this.dates.join(' ~ ') : ''
  }

  private menu = false
  private mdiMagnify = mdiMagnify
  private serverNameItems = [`事务`, `离线`, `日志`, `视频`]
  private statusItems = [`异常`, `离线`, `警告`]

  private get topicTaskFlag() {
    if (this.queryServerName === this.serverNameItems[0] || this.queryServerName === this.serverNameItems[1]) {
      return `任务`
    } else {
      return `主题`
    }
  }

  // 搜索
  private queryTopicID = ''
  private queryServerName = ''
  private queryStatus = ''
  // 时间范围 v-model

  private desserts: Array<realTimeData> = []
  private pageNum = 1
  private pageSize = 20
  private paginationLength = 1
  private loading = true

  private row = ''
  private tDialogFlag = false // 表格展示
  private tDialogShow = 0 // 展示哪个弹窗

  private get headers(): Array<tableHeaderType> {
    return [
      {
        text: '任务ID',
        align: 'center',
        value: 'taskId',
        format: (value: number) => {
          return !value ? '-' : value
        }
      },
      {
        text: '主题ID',
        align: 'center',
        value: 'topicId'
      },
      {
        text: '作业名',
        align: 'center',
        value: 'serverName'
      },
      {
        text: '时间',
        align: 'center',
        value: 'createTime',
        format: (value: string) => {
          return Moment(Number(value)).format('YYYY/MM/DD HH:mm:ss')
        }
      },
      {
        text: '状态',
        align: 'center',
        slot: 'status'
      },
      {
        text: '描述信息',
        align: 'center',
        value: 'tip'
      },
      {
        text: '日志信息',
        align: 'center',
        slot: 'details'
      }
    ]
  }
  // 清空搜索条件
  private resetSearchQuery() {
    this.queryTopicID = ''
    this.queryServerName = ''
    this.queryStatus = ''
    this.dates = []
    if (this.$route.query.id) {
      this.$router.push({
        query: {}
      })
    }

    this.searchHandler(1)
  }
  // 搜索
  private searchHandler(nowPage: number) {
    // 时间范围只能是0或者2
    if (this.dates.length === 1) {
      return
    }
    this.pageNum = nowPage

    const params: paramsType = {
      pageSize: this.pageSize,
      pageNum: this.pageNum
    }

    const _query =
      this.queryServerName === this.serverNameItems[0] || this.queryServerName === this.serverNameItems[1]
        ? `taskId`
        : `topicId`
    this.queryTopicID && (params[_query] = this.queryTopicID)
    this.queryServerName && (params.serverName = this.queryServerName)
    this.queryStatus && (params.status = calendarType[this.queryStatus as keyof typeof calendarType])
    this.dates.length === 2 &&
      ((params.startTime = Number(Moment(this.dates[0]).startOf('day').format('x'))),
      (params.endTime = Number(Moment(this.dates[1]).endOf('day').format('x'))))

    this.searchMethod(params)
  }

  // 通用搜索方法
  private async searchMethod(params: paramsType) {
    this.loading = true

    const { data }: returnType = await this.h_request['httpGET']<paramsType>('GET_MONITOR_FIND_ALL_MONITOR_LOG', params)

    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    this.loading = false
  }

  // 分页方法
  private PaginationNow(nowPage: number): void {
    this.pageNum = nowPage
    this.searchHandler(nowPage)
  }

  // 允许选择的时间范围
  private allowedDates(val: string) {
    if (this.dates.length === 0) {
      return true
    } else if (this.dates.length === 1) {
      const beginTime = this.h_utils.timeUtil.timeToStamp(val, '-')
      const endTime = this.h_utils.timeUtil.timeToStamp(this.dates[0], '-')
      return beginTime + 24 * 60 * 60 * 1000 > endTime
    } else {
      return true
    }
  }

  // 数据结构展示方法
  private dataStructure(remarks: string) {
    this.tDialogFlag = true
    this.formProvide.title = '日志信息详情'
    this.tDialogShow = 1
    this.row = remarks
  }

  created(): void {
    this.pageNum = 1
    this.queryTopicID = this.$route.query.id ? this.$route.query.id.toString() : ''
    this.searchHandler(1)
  }
}
</script>
