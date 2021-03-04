<template>
  <div id="realTime"></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { CalendarData } from '@/type/calendar'
// import { calendarType, calendarColorType } from '@/enum/calendar-enum'
import echarts from '@/decorator/echartsDecorator'

@echarts
@Component
@http
export default class RealTime extends Vue {
  private events: Array<CalendarData> = []
  private timer = 0
  private interval = 30
  private hours = ['1', '2', '3', '4', '5', '6', '7']
  private category = ['日志', '事务', '视频']
  private data = [
    [0, 0, 1],
    [0, 1, 1],
    [0, 2, 0],
    [0, 3, 0]
  ]
  private chartElement: any
  private option: any = {
    tooltip: {
      position: 'top',
      formatter: () => {
        return 1
      }
    },
    title: [],
    singleAxis: [],
    series: []
  }

  private async updateRange() {
    this.data.push([0, 4, 2])
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
    // const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME', {
    //   date: new Date().getTime()
    // })

    // const _events: Array<CalendarData> = data?.map((item: any) => {
    //   return {
    //     start: new Date(Number(item['createTime'])),
    //     color: calendarColorType[item['status']],
    //     remarks: item['remarks'],
    //     status: calendarType[item['status']],
    //     name: item['topicId'].toString(),
    //     serverName: item['serverName'],
    //     timed: true
    //   }
    // })

    // this.events = _events

    this.h_echarts.util.each(this.category, (day: string, idx: number) => {
      this.option.title.push({
        textBaseline: 'middle',
        top: ((idx + 0.5) * 100) / 7 + '%',
        text: day
      })

      this.option.singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: this.hours,
        top: (idx * 100) / 7 + 5 + '%',
        height: 100 / 7 - 10 + '%',
        axisLabel: {
          interval: 2
        }
      })

      this.option.series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: (dataItem: Array<number>) => {
          return (dataItem[1] + 1) * 6
        }
      })
    })

    this.h_echarts.util.each(this.data, (dataItem: Array<number>) => {
      this.option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]])
    })

    this.chartElement.setOption(this.option)
  }

  //  初始化echarts
  private initECharts(elementName: string): void {
    const element = document.getElementById(elementName)
    this.chartElement = this.h_echarts.init(element as HTMLCanvasElement)
  }

  mounted(): void {
    // this.timer = setInterval(() => {
    //   this.updateRange()
    // }, this.interval * 1000)
    this.$nextTick(() => {
      this.initECharts('realTime')
      this.updateRange()
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
  height: 400px;
}
</style>
