<template>
  <div id="realTime"></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { CalendarData } from '@/type/calendar'
import { calendarType, calendarColorType } from '@/enum/calendar-enum'
import echarts from '@/decorator/echartsDecorator'

@echarts
@Component
@http
export default class RealTime extends Vue {
  private events: Array<CalendarData> = []
  private timer = 0
  private interval = 30
  private hours = ['1', '2', '3']
  private days = ['日志', '事务', '视频']

  private option = {
    tooltip: {
      position: 'top'
    },
    title: [],
    singleAxis: [],
    series: []
  }

  private async updateRange() {
    // const data = [
    //   {
    //     'id': 1,
    //     'topicId': 88888888,
    //     'serverName': '日志',
    //     'status': 1,
    //     'createTime': '1614783227618',
    //     'remarks': 'NullPointerException'
    //   },
    //   {
    //     'id': 1,
    //     'topicId': 88888886,
    //     'serverName': '事务',
    //     'status': 3,
    //     'createTime': '1614283227618',
    //     'remarks': 'NullPointerException'
    //   },
    //   {
    //     'id': 1,
    //     'topicId': 88888889,
    //     'serverName': '视频',
    //     'status': 2,
    //     'createTime': '1614094237618',
    //     'remarks': 'NullPointerException'
    //   }
    // ]
    const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME', {
      date: new Date().getTime()
    })

    const _events: Array<CalendarData> = data?.map((item: any) => {
      return {
        start: new Date(Number(item['createTime'])),
        color: calendarColorType[item['status']],
        remarks: item['remarks'],
        status: calendarType[item['status']],
        name: item['topicId'].toString(),
        serverName: item['serverName'],
        timed: true
      }
    })

    this.events = _events
  }

  private initECharts(elementName: string): void {
    const element = document.getElementById(elementName)
    const chartElement = this.h_echarts.init(element as HTMLCanvasElement)
    console.log(chartElement.util)
  }

  mounted(): void {
    this.updateRange()
    // this.timer = setInterval(() => {
    //   this.updateRange()
    // }, this.interval * 1000)

    this.$nextTick(() => {
      this.initECharts('realTime')
    })
  }
  // 清除timer
  beforeDestroy(): void {
    clearInterval(this.timer)
  }
}
</script>
<style scoped>
#realTime {
  height: 550px;
}
</style>
