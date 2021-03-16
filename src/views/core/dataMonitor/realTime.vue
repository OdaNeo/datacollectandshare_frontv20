<template>
  <div id="realTime"></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
// import { calendarType } from '@/enum/calendar-enum'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'
// import { realTimeData } from '@/type/calendar'

@echarts
@Component
@http
@util
export default class RealTime extends Vue {
  private timer = 0
  private interval = 60
  // private times = 0

  private chartElement: any
  // private qsData: Array<any> = []
  // private startTime = +new Date()
  private zeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime()
  private categories = ['日志', '事务', '视频']

  private types = [
    { name: '异常', color: 'red' },
    { name: '离线', color: 'grey' },
    { name: '警告', color: 'orange' },
    { name: '作业正常', color: '#2ECC71' }
  ]

  private data: Array<any> = []

  private value = Math.random() * 1000

  private randomData() {
    const now = new Date()
    this.value = this.value + Math.random() * 21 - 10
    return {
      name: now.getTime(),
      value: [now.getTime(), Math.round(this.value)]
    }
  }

  // 柯里化option
  private getOption(data: any) {
    return {
      title: {
        text: '作业状态实时监控',
        left: 'center'
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          start: 1,
          end: 100
        }
      ],
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        min: this.zeroTimeStamp,
        max: this.zeroTimeStamp + 24 * 60 * 60 * 1000
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        {
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data
        }
      ]
    }
  }

  private async updateRange() {
    // const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME', {
    //   date: new Date().getTime()
    // })

    // const data: Array<realTimeData> = [
    //   {
    //     'id': 1,
    //     'topicId': 88888888,
    //     'serverName': '日志',
    //     'status': 3,
    //     'createTime': '1614783227618',
    //     'remarks': 'NullPointerException'
    //   },
    //   {
    //     'id': 1,
    //     'topicId': 88888886,
    //     'serverName': '事务',
    //     'status': 3,
    //     'createTime': '1614783227618',
    //     'remarks': 'NullPointerException'
    //   },
    //   {
    //     'id': 1,
    //     'topicId': 88888889,
    //     'serverName': '视频',
    //     'status': 1,
    //     'createTime': '1614783227618',
    //     'remarks': 'NullPointerException'
    //   }
    // ]

    this.chartElement.setOption(this.getOption(this.data))
  }

  //  初始化echarts
  private initECharts(elementName: string): void {
    const element = document.getElementById(elementName)
    this.chartElement = this.h_echarts.init(element as HTMLCanvasElement)
  }

  mounted(): void {
    this.initECharts('realTime')
    this.updateRange()
    // this.timer = setInterval(() => {
    //   this.times++
    //   this.updateRange()
    // }, this.interval * 1000)

    setInterval(() => {
      for (var i = 0; i < 5; i++) {
        this.data.push(this.randomData())
      }
      // console.log(this.data)
      this.chartElement.setOption(this.getOption(this.data))
    }, 1000)
  }
  // 清除timer
  beforeDestroy(): void {
    clearInterval(this.timer)
  }
}
</script>
<style scoped>
#realTime {
  width: 1200px;
  height: 800px;
}
</style>
