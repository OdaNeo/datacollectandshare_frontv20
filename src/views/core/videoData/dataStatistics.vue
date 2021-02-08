<template>
  <div id="VideoDataStatistics"></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import echarts from '@/decorator/echarsDecorator'

@Component
@http
@echarts
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
      'fileNum': 1
    },
    {
      'id': 2084,
      'topicId': 9008102,
      'userId': 1,
      'serverUrl': '',
      'address': '海鹰路海鹰路海鹰路海鹰路',
      'sourceUrl': 'rtmp://58.200.131.2:1935/livetv/cctv8',
      'm3u8Url': '',
      'bucketName': '',
      'createTime': '2021-02-03T04:53:43.000+0000',
      'fileNum': 5
    },
    {
      'id': 2084,
      'topicId': 9008101,
      'userId': 1,
      'serverUrl': '',
      'address': '海鹰路海鹰路海鹰路海鹰路',
      'sourceUrl': 'rtmp://58.200.131.2:1935/livetv/cctv8',
      'm3u8Url': '',
      'bucketName': '',
      'createTime': '2021-02-03T04:53:43.000+0000',
      'fileNum': 4
    },
    {
      'id': 2084,
      'topicId': 9008109,
      'userId': 1,
      'serverUrl': '',
      'address': '海鹰路海鹰路海鹰路海鹰路',
      'sourceUrl': 'rtmp://58.200.131.2:1935/livetv/cctv8',
      'm3u8Url': '',
      'bucketName': '',
      'createTime': '2021-02-03T04:53:43.000+0000',
      'fileNum': 2
    },
    {
      'id': 2084,
      'topicId': 9008104,
      'userId': 1,
      'serverUrl': '',
      'address': '海鹰路海鹰路海鹰路海鹰路',
      'sourceUrl': 'rtmp://58.200.131.2:1935/livetv/cctv8',
      'm3u8Url': '',
      'bucketName': '',
      'createTime': '2021-02-03T04:53:43.000+0000',
      'fileNum': 5
    }
  ]

  // TODO: 替换mock数据
  private async getVideoAll() {
    const { data } = await this.h_request['httpGET']('GET_TOPICS_GETVIDEO', {})
    console.log(data)
  }

  // echart
  private renderDom() {
    this.$nextTick(() => {
      const element = document.getElementById('VideoDataStatistics')
      const myChartElement = this.h_echars.init(element as HTMLCanvasElement, 'light')

      myChartElement.setOption(
        {
          title: {
            text: '视频数据统计',
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
              return item.topicId
            })
          },
          series: [
            {
              name: '文件数量',
              type: 'pie',
              radius: [30, 110],
              center: ['75%', '50%'],
              roseType: 'angle',
              data: this.videoList.map(item => {
                return {
                  value: item.fileNum,
                  name: item.topicId
                }
              })
            }
          ]
        },
        true
      )
    })
  }
  created(): void {
    // this.getVideoAll()
    this.renderDom()
  }
}
</script>
<style scoped>
#VideoDataStatistics {
  height: 100%;
}
</style>
