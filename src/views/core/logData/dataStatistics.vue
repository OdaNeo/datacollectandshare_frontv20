<template>
  <div id="LogDataStatistics">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        placeholder="请输入查找的日志主题ID"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="searchTopic"
        v-only-num
      />
    </v-row>
    <div id="loggerDataMouth"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { paramsType, returnType } from '@/type/http-request.type'
import HSearch from '@/components/h-search.vue'
import echarts from '@/decorator/echartsDecorator'
// import Moment from 'moment'
@Component({
  components: {
    HSearch
  }
})
@http
@echarts
export default class LogDataStatistics extends Vue {
  private queryTopicID = '' // 查询主题ID input框内容

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

  private searchTopic() {
    console.log(1)
  }

  // 查询通用调用方法
  private async searchMethod(params: paramsType) {
    const { data }: returnType = await this.h_request['httpGET']('GET_TOPICS_MYTOPICS', params)
    if (data && data.list.length > 0) {
      this.queryTopicID = data.list[0].id
    }
  }

  // echart handle
  private handelECharts(ele: string, options: object) {
    this.$nextTick(() => {
      const element = document.getElementById(ele)
      const myChartElement = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })

      myChartElement.setOption(options, true)
    })
  }
  created(): void {
    // 默认显示我的主题中的第一条
    this.searchMethod({ pageNum: 1, pageSize: 20, dataType: 1, faceTypes: 9 })
  }
}
</script>
<style scoped>
#loggerDataMouth {
  width: 100%;
  height: 200px;
}
</style>
