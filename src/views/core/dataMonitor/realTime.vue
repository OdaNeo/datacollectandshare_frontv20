<template>
  <div id="realTime"></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { calendarType } from '@/enum/calendar-enum'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'

@echarts
@Component
@http
@util
export default class RealTime extends Vue {
  private timer = 0
  private interval = 30
  private times = 0

  private chartElement: any
  private qsData: Array<any> = []
  private startTime = +new Date()
  private categories = ['日志', '事务', '视频']

  private types = [
    { name: '异常', color: 'red' },
    { name: '离线', color: 'grey' },
    { name: '警告', color: 'orange' },
    { name: '作业正常', color: '#2ECC71' }
  ]

  private renderItem(params: any, api: any) {
    const categoryIndex = api.value(0)
    const start = api.coord([api.value(1), categoryIndex])
    const end = api.coord([api.value(2), categoryIndex])
    const height = api.size([0, 1])[1] * 0.6

    const rectShape = this.h_echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      }
    )

    return (
      rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
      }
    )
  }

  // 柯里化option
  private getOption(data: any) {
    return {
      tooltip: {
        formatter: (params: any) => {
          if (params.data.itemStyle.status === this.types[3].name) {
            return params.marker + ' 作业状态: ' + params.data.itemStyle.status
          } else {
            return (
              params.marker +
              ' 作业状态: ' +
              params.data.itemStyle.status +
              ' 主题ID: ' +
              params.data.itemStyle.topicId +
              ' 创建时间: ' +
              params.data.itemStyle.createTime +
              ' 描述: ' +
              params.data.itemStyle.remarks
            )
          }
        }
      },
      title: {
        text: '作业状态实时监控',
        left: 'center'
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 400,
          height: 10,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon:
            'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          },
          labelFormatter: ''
        },
        {
          type: 'inside',
          filterMode: 'weakFilter'
        }
      ],
      grid: {
        height: 300
      },
      xAxis: {
        min: this.startTime,
        scale: true,
        axisLabel: {
          formatter: (val: number) => {
            return Math.max(0, val - this.startTime) / 1000 + ' s'
          }
        }
      },
      yAxis: {
        data: this.categories
      },
      series: [
        {
          type: 'custom',
          renderItem: this.renderItem,
          itemStyle: {
            opacity: 0.8
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: data
        }
      ]
    }
  }

  private async updateRange() {
    const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME', {
      date: new Date().getTime()
    })

    // const data: any = [
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

    if (data.length > 0) {
      data.forEach((item: any) => {
        this.qsData.push({
          name: item.serverName,
          value: [
            this.categories.indexOf(item.serverName),
            this.startTime + this.interval * this.times * 1000,
            this.startTime + this.interval * this.times * 1000 + (this.interval - 2) * 1000,
            (this.interval - 2) * 1000
          ],
          itemStyle: {
            normal: {
              color: this.types[item.status - 1] ? this.types[item.status - 1].color : this.types[3].color,
              topicId: item.topicId,
              status: calendarType[item.status],
              createTime: this.h_utils.timeUtil.stamptoFullTime(item.createTime),
              remarks: item.remarks
            }
          }
        })
      })
    } else {
      for (let i = 0; i < this.categories.length; i++) {
        this.qsData.push({
          name: this.categories[i],
          value: [
            i,
            this.startTime + this.interval * this.times * 1000,
            this.startTime + this.interval * this.times * 1000 + (this.interval - 2) * 1000,
            (this.interval - 2) * 1000
          ],
          itemStyle: {
            normal: {
              color: this.types[3].color,
              status: this.types[3].name
            }
          }
        })
      }
    }

    this.chartElement.setOption(this.getOption(this.qsData))
  }

  //  初始化echarts
  private initECharts(elementName: string): void {
    const element = document.getElementById(elementName)
    this.chartElement = this.h_echarts.init(element as HTMLCanvasElement)
  }

  mounted(): void {
    this.initECharts('realTime')
    this.updateRange()

    this.timer = setInterval(() => {
      this.times++
      this.updateRange()
    }, this.interval * 1000)
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
  height: 500px;
}
</style>
