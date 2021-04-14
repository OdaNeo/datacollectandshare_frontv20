<template>
  <div id="VideoDataStatistics">
    <div v-if="videoList.length > 0" class="slider">
      <span style="font-size: 14px">当前显示前{{ sliderNumber }}条主题</span>
      <v-slider
        v-model="sliderNumber"
        class="align-center ml-4"
        hide-details
        :max="maxValue"
        :min="10"
        thumb-size="20"
        thumb-label="always"
        @input="sliderChange"
      >
        <template v-slot:append>
          <v-text-field
            v-model="sliderNumber"
            class="mt-0 pt-0"
            dense
            single-line
            type="number"
            style="width: 45px"
          ></v-text-field>
        </template>
      </v-slider>
    </div>

    <div id="echarts1"></div>
    <div id="echarts2"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import Echarts from 'echarts'
import Moment from 'moment'

@Component({})
@http
export default class VideoDataStatistics extends Vue {
  private videoList: Array<any> = []
  private maxValue = 10

  private sliderNumber = 10

  private async getVideoAll() {
    const { data } = await this.h_request['httpGET']('GET_TOPICS_GETVIDEO', {})
    this.videoList = [...data]
    this.maxValue = data.length

    data && this.handelECharts('echarts1', this.getOption1(this.videoList, this.sliderNumber))
    data && this.handelECharts('echarts2', this.getOption2(this.videoList))
  }

  // echarts1
  private getOption1(data: Array<{ fileNum: number; topicId: number | string }>, number: number) {
    data.sort((prev, next) => {
      return next.fileNum - prev.fileNum
    })

    const _data: typeof data = []
    let otherFileNum = 0

    data.forEach((item, index) => {
      index < number
        ? (_data[index] = { fileNum: item.fileNum, topicId: `主题ID：${item.topicId}` })
        : (otherFileNum += item.fileNum)
    })
    _data[number] = { fileNum: otherFileNum, topicId: '其余视频主题' }

    return {
      title: {
        text: '视频主题占比',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        right: '20%',
        top: '15%',
        orient: 'vertical',
        data: _data.map(item => {
          return `${item.topicId}`
        })
      },
      series: [
        {
          name: '视频主题文件占比',
          type: 'pie',
          radius: [20, 95],
          center: ['35%', '50%'],
          data: _data.map(item => {
            return {
              value: item.fileNum,
              name: `${item.topicId}`
            }
          })
        }
      ]
    }
  }

  // echarts 2
  private getOption2(data: Array<{ createTime: string; fileNum: number }>) {
    // 同一天视频归到一起
    // _dataCon key:createTime,value:fileNum
    const _dataCon: { [key: string]: number } = {}
    // 2021-03-24T07:06:36.000+0000
    data.forEach(item => {
      const _p = Moment(item.createTime).format('YYYY-MM-DD')

      if (_p in _dataCon) {
        _dataCon[_p] += item.fileNum
      } else {
        _dataCon[_p] = item.fileNum
      }
    })

    const _data = Object.entries(_dataCon)
    const _time = Object.keys(_dataCon)

    // 获取最大值 fileNum 最大值
    _data.sort((prev, next) => {
      return next[1] - prev[1]
    })
    const MAX = _data[0][1]

    // // 获取起止时间
    _time.sort((prev, next) => {
      return Number(Moment(prev).format('x')) - Number(Moment(next).format('x'))
    })

    const START = Moment(_time[0]).startOf('month').format('YYYY-MM-DD')
    const END = Moment(_time[_time.length - 1])
      .endOf('month')
      .format('YYYY-MM-DD')

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
        max: Math.ceil(MAX / 5) * 5,
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
        data: _data.map(item => {
          return [item[0], item[1]]
        })
      }
    }
  }

  // echart handle
  private handelECharts(ele: string, options: object) {
    this.$nextTick(() => {
      const element = document.getElementById(ele)
      const myChartElement = Echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })

      myChartElement.setOption(options, true)
    })
  }

  // 滑块 sliderChange
  private sliderChange(val: number) {
    this.handelECharts('echarts1', this.getOption1(this.videoList, val))
  }

  //
  mounted(): void {
    this.getVideoAll()
  }
}
</script>
<style scoped>
.slider {
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#echarts1 {
  height: 380px;
  width: 100%;
}
#echarts2 {
  height: 250px;
  width: 95%;
  margin: 0 auto;
}
</style>
