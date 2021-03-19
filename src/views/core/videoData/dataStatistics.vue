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
    // const data = [
    //   {
    //     address: '海鹰路海鹰路海鹰路海鹰路',
    //     bucketName: 'topic9008082',
    //     createTime: '2021-01-25T04:27:25.000+0000',
    //     fileNum: 1,
    //     id: 2083,
    //     m3u8Url: '',
    //     serverUrl: 'rtmp://127.0.0.1:1935/live/9008082',
    //     sourceUrl: 'rtmp://58.200.131.2:1935/livetv/cctv8',
    //     topicId: 9008082,
    //     userId: 2
    //   },
    //   {
    //     address: '海鹰路海鹰路海鹰路海鹰路',
    //     bucketName: 'topic9008082',
    //     createTime: '2021-01-25T04:27:25.000+0000',
    //     fileNum: 1,
    //     id: 2083,
    //     m3u8Url: '',
    //     serverUrl: 'rtmp://127.0.0.1:1935/live/9008082',
    //     sourceUrl: 'rtmp://58.200.131.2:1935/livetv/cctv8',
    //     topicId: 9008080,
    //     userId: 2
    //   },
    //   {
    //     address: '海鹰路海鹰路海鹰路海鹰路',
    //     bucketName: 'topic9008082',
    //     createTime: '2021-01-26T04:27:25.000+0000',
    //     fileNum: 6,
    //     id: 2083,
    //     m3u8Url: '',
    //     serverUrl: 'rtmp://127.0.0.1:1935/live/9008082',
    //     sourceUrl: 'rtmp://58.200.131.2:1935/livetv/cctv8',
    //     topicId: 90080821,
    //     userId: 2
    //   }
    // ]
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
          name: '视频主题文件占比',
          type: 'pie',
          radius: [20, 80],
          center: ['50%', '50%'],
          roseType: 'area',
          data: data.map(item => {
            return {
              value: item.fileNum,
              name: `主题ID：${item.topicId}`
            }
          })
        }
        // {
        //   name: '半径模式',
        //   type: 'pie',
        //   radius: [20, 80],
        //   center: ['25%', '50%'],
        //   roseType: 'radius',
        //   data: data.map(item => {
        //     return {
        //       value: item.fileNum,
        //       name: `主题ID：${item.topicId}`
        //     }
        //   })
        // }
      ]
    }
  }

  // echarts 3
  private getOption3(data: Array<{ createTime: string; fileNum: number }>) {
    // fileNum 最大值
    data.sort((prev, next) => {
      return next.fileNum - prev.fileNum
    })

    return {
      title: {
        top: 30,
        left: 'center',
        text: '2021年视频主题文件数量概况'
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: Math.ceil(data[0].fileNum / 5) * 5,
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
