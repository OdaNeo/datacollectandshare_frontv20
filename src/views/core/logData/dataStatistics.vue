<template>
  <div id="LogDataStatistics">
    <v-row>
      <HSearch :cols="3" :showAppEnd="false" v-model="queryTopicID" label="日志主题ID" v-only-num />
      <v-col cols="3">
        <v-menu
          ref="menu"
          v-model="showMenu"
          :close-on-content-click="false"
          :return-value.sync="queryTopicDate"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              dense
              height="35px"
              v-model="queryTopicDate"
              label="截止日期"
              readonly
              clearable
              :clear-icon="mdiCloseCircleOutline"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="zh-cn"
            v-model="queryTopicDate"
            @click.native="$refs.menu.save(queryTopicDate)"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-btn color="primary" small depressed dark>开始查询</v-btn>
      </v-col>
    </v-row>
    <!-- 默认日历表 -->

    <!-- eChartsDataDom -->
    <div id="eChartsDataDom"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { paramsType, returnType } from '@/type/http-request.type'
import HSearch from '@/components/h-search.vue'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'
import { mdiCloseCircleOutline } from '@mdi/js'
import Moment from 'moment'
@Component({
  components: {
    HSearch
  }
})
@http
@echarts
@util
export default class LogDataStatistics extends Vue {
  private mdiCloseCircleOutline = mdiCloseCircleOutline

  private myChartElement: any = null
  // 默认显示我的主题中的第一条
  // 默认显示当天
  private queryEndDate = Moment(new Date()).format(`YYYY-MM-DD`)
  private queryTopicID = '' // 查询主题ID input框内容
  private queryTopicDate = this.queryEndDate

  private showMenu = false
  // private async getStatisticsLoggerTopicByTopicId(params: { topicId: number; timeDate: string }) {
  //   const data = await this.h_request['httpGET']('GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICID', { params })
  //   console.log(data)
  // }
  private getOption(data: any) {
    return {
      title: {
        top: 30,
        left: 'center',
        text: '视频文件数量概况'
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: ({ data }: { data: [string, number] }) => {
          return `日期：${data[0]}<br />视频文件数量：${data[1]}`
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        type: 'piecewise',
        splitNumber: 5,
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
          color: '#000'
        }
      },
      calendar: {
        top: 120,
        left: 55,
        right: 55,
        cellSize: ['auto', 13],
        // range: [START, END],
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: true, position: 'right' },
        dayLabel: {
          nameMap: 'cn'
        },
        monthLabel: {
          nameMap: 'cn'
        }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data
      }
    }
  }

  private searchLoggerData() {
    console.log(1)
  }

  // 查询通用调用方法
  private async searchMethod(params: paramsType) {
    const { data }: returnType = await this.h_request['httpGET']('GET_TOPICS_MYTOPICS', params)
    if (data && data.list.length > 0) {
      this.queryTopicID = data.list[0].id
    } else {
      this.h_utils['alertUtil'].open('该用户未发布主题', true, 'error')
    }
  }

  // echart handle
  private initECharts(ele: string, options: object) {
    this.$nextTick(() => {
      const element = document.getElementById(ele)
      this.myChartElement = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })
      this.myChartElement.setOption(options, true)
    })
  }
  created(): void {
    // 默认显示我的主题中的第一条
    this.searchMethod({ pageNum: 1, pageSize: 20, dataType: 1, faceTypes: 9 })
  }
}
</script>
<style scoped>
.loggerDataMouth {
  display: flex !important;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
