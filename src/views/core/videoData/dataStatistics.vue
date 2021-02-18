<template>
  <div id="VideoDataStatistics">
    <div id="echarts1"></div>
    <div id="echarts2"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import Echarts from 'echarts'

@Component
@http
export default class VideoDataStatistics extends Vue {
  private videoList: Array<any> = []

  private async getVideoAll() {
    const { data } = await this.h_request['httpGET']('GET_TOPICS_GETVIDEO', {})
    this.videoList = data
    this.handelECharts('echarts1', this.getOption1(this.videoList))
    this.handelECharts('echarts2', this.getOption3(this.videoList))
  }

  // echarts1
  private getOption1(data: Array<{ fileNum: unknown; topicId: unknown }>) {
    return {
      title: {
        text: '主题数据统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: data.map(item => {
          return `主题ID：${item.topicId}`
        })
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [20, 80],
          center: ['75%', '50%'],
          roseType: 'area',
          data: data.map(item => {
            return {
              value: item.fileNum,
              name: `主题ID：${item.topicId}`
            }
          })
        },
        {
          name: '半径模式',
          type: 'pie',
          radius: [20, 80],
          center: ['25%', '50%'],
          roseType: 'radius',
          data: data.map(item => {
            return {
              value: item.fileNum,
              name: `主题ID：${item.topicId}`
            }
          })
        }
      ]
    }
  }

  // echarts 3
  private getOption3(data: Array<{ createTime: unknown; fileNum: unknown }>) {
    return {
      title: {
        top: 30,
        left: 'center',
        text: '2021年视频主题概况'
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 2,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
          color: '#000'
        }
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: '2021',
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data.map(item => {
          return [item.createTime, item.fileNum]
        })
      }
    }
  }

  // echart handel
  private handelECharts(ele: string, options: object) {
    this.$nextTick(() => {
      const element = document.getElementById(ele)
      const myChartElement = Echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })

      myChartElement.setOption(options, true)
    })
  }

  //
  mounted(): void {
    this.getVideoAll()
  }
}
</script>
<style scoped>
#echarts1 {
  height: 300px;
  width: 100%;
}
#echarts2 {
  height: 300px;
  width: 80%;
  margin: 0 auto;
}
</style>
