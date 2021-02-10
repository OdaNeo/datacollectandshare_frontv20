<template>
  <div id="VideoDataStatistics">
    <div id="echarts1"></div>
    <div id="echarts2"></div>
    <div id="echarts3"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import Echarts from 'echarts'

@Component
@http
export default class VideoDataStatistics extends Vue {
  private videoList = [
    {
      'id': 2083,
      'topicId': 9008082,
      'userId': 2,
      'serverUrl': 'rtmp://127.0.0.1:1935/live/9008082',
      'address': '海鹰路海鹰路海鹰路海鹰路',
      'sourceUrl': 'rtmp://58.200.131.2:1935/livetv/cctv8',
      'm3u8Url': '',
      'bucketName': 'topic9008082',
      'createTime': '2021-01-25T04:27:25.000+0000',
      'fileNum': 1
    },
    {
      'id': 2084,
      'topicId': 9008100,
      'userId': 1,
      'serverUrl': '',
      'address': '海鹰路海鹰路海鹰路海鹰路',
      'sourceUrl': 'rtmp://58.200.131.2:1935/livetv/cctv8',
      'm3u8Url': '',
      'bucketName': '',
      'createTime': '2021-02-03T04:53:43.000+0000',
      'fileNum': 0
    }
  ]

  // TODO: 替换mock数据
  private async getVideoAll() {
    const { data } = await this.h_request['httpGET']('GET_TOPICS_GETVIDEO', {})
    console.log(data)
  }
  // echarts1
  private option1 = {
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
      data: this.videoList.map(item => {
        return `主题ID：${item.topicId}`
      })
    },
    series: [
      {
        name: '面积模式',
        type: 'pie',
        radius: [20, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        data: this.videoList.map(item => {
          return {
            value: item.fileNum,
            name: `主题ID：${item.topicId}`
          }
        })
      }
    ]
  }
  // echarts 2

  // echarts 3
  private option3 = {
    title: {
      top: 30,
      left: 'center',
      text: '2021年视频文件数量'
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
      data: this.videoList.map(item => {
        return [item.createTime, item.fileNum]
      })
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
    // this.getVideoAll()
    this.handelECharts('echarts1', this.option1)
    this.handelECharts('echarts3', this.option3)
  }
}
</script>
<style scoped>
#echarts1 {
  height: 300px;
  width: 50%;
  display: inline-block;
}
#echarts2 {
  height: 300px;
  width: 50%;
  display: inline-block;
}
#echarts3 {
  height: 300px;
  width: 80%;
  margin: 0 auto;
}
</style>
