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
            @change="getOption1(123)"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-btn color="primary" small depressed dark @click="search30DaysLogger">开始查询</v-btn>
      </v-col>
    </v-row>
    <!-- 默认日历表 -->
    <div id="eCharts1"></div>
    <!-- eChartsDataDom -->
    <div id="eCharts2"></div>
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

  private myChartElement1: any = null
  private myChartElement2: any = null
  // 默认显示我的主题中的第一条
  // 默认显示当天
  private queryEndDate = Moment(new Date()).format(`YYYY-MM-DD`)
  private queryTopicID = '' // 查询主题ID input框内容
  private queryTopicDate = this.queryEndDate

  private showMenu = false

  private search30DaysLogger() {
    this.getStatisticsLoggerTopicByTopicIdAnd30Days({
      topicId: Number(this.queryTopicID),
      timeDate: this.queryTopicDate
    })
  }

  // 获得30天数据并生成option1
  private async getStatisticsLoggerTopicByTopicIdAnd30Days(params: { topicId: number; timeDate: string }) {
    // const { data }: { data: { time: string; value: number }[] } = await this.h_request['httpGET'](
    //   'GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAYAND30DAYS',
    //   {
    //     params
    //   }
    // )
    // console.log(data)
    const data = [
      { time: '2021-4-23', value: 27 },
      { time: '2021-4-9', value: 5 },
      { time: '2021-4-12', value: 12 }
    ]

    if (data) {
      const _data = data.map(item => [item.time, item.value] as const).sort((prev, next) => next[1] - prev[1])
      this.myChartElement1.setOption(this.getOption1(_data), true)
    }
  }

  private getOption1(data: (readonly [string, number])[]) {
    const START = Moment(Number(Moment(this.queryTopicDate).format('x')) - 30 * 1000 * 60 * 60 * 24).format(
      `YYYY-MM-DD`
    )
    const END = this.queryTopicDate
    const MAX = data[0][1]

    return {
      title: {
        left: 'center',
        text: '30天内日志数目',
        subtext: '点击日期显示日志详情',
        subtextStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: ({ data }: { data: [string, number] }) => {
          return `日期：${data[0]}<br />日志条数：${data[1]}`
        }
      },
      visualMap: {
        min: 0,
        max: Math.ceil(MAX / 5) * 5,
        type: 'piecewise',
        splitNumber: 5,
        orient: 'horizontal',
        left: 'center',
        top: 60,
        textStyle: {
          color: '#000'
        }
      },
      calendar: {
        top: 110,
        left: 180,
        right: 150,
        height: 130,
        cellSize: ['auto', 13],
        range: [START, END],
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

  // 获得指定天数据
  private async getStatisticsLoggerTopicByTopicIdAndDay(params: { topicId: number; timeDate: string }) {
    // const { data } = await this.h_request['httpGET']('GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAY', { params })
    // console.log(data)
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 1, 4]
    if (data) {
      this.myChartElement2.setOption(this.getOption2(data, params), true)
    } else {
      // this.h_utils['alertUtil'].open('查询失败', true, 'error')
    }
  }
  // getOption2
  private getOption2(data: number[], params: { topicId: number; timeDate: string }) {
    const xData = data.map((_, index) => {
      return `${index}时`
    })

    return {
      title: {
        left: 'center',
        text: `主题${params.topicId}在${params.timeDate}日志详情`
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: 100,
        right: 100,
        bottom: 5,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Step Start',
          type: 'line',
          step: 'middle',
          data: data
        }
      ]
    }
  }

  // 查询通用调用方法
  private async initSearchMethod(params: paramsType) {
    const { data }: returnType = await this.h_request['httpGET']('GET_TOPICS_FIND_ALL', params)
    if (data && data.list.length > 0) {
      this.queryTopicID = data.list[0].id.toString()
      this.$nextTick(() => {
        // 30 天
        this.getStatisticsLoggerTopicByTopicIdAnd30Days({
          topicId: Number(this.queryTopicID),
          timeDate: this.queryTopicDate
        })
        // 当天
        this.getStatisticsLoggerTopicByTopicIdAndDay({
          topicId: Number(this.queryTopicID),
          timeDate: this.queryTopicDate
        })
      })
    } else {
      this.h_utils['alertUtil'].open('日志主题不存在', true, 'error')
    }
  }

  // echarts1 handle
  private initECharts1() {
    this.$nextTick(() => {
      const element = document.getElementById('eCharts1')
      this.myChartElement1 = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })
      this.myChartElement1.on('click', (item: { data: [string, number] }) => {
        // 点击获取某天详情
        this.getStatisticsLoggerTopicByTopicIdAndDay({ topicId: Number(this.queryTopicID), timeDate: item.data[0] })
      })
    })
  }

  // echarts2 handle
  private initECharts2() {
    this.$nextTick(() => {
      const element = document.getElementById('eCharts2')
      this.myChartElement2 = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })
    })
  }
  mounted(): void {
    // 默认显示日志主题中的第一条
    this.initECharts1()
    this.initECharts2()
    this.initSearchMethod({ pageNum: 1, pageSize: 20, dataType: 1, faceTypes: 9 })
  }
}
</script>
<style scoped>
#eCharts1 {
  width: 100%;
  height: 280px;
}
#eCharts2 {
  width: 95%;
  margin: 0 auto;
  height: 250px;
}
</style>
