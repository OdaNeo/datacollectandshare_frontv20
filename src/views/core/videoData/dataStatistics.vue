<template>
  <div id="VideoDataStatistics">
    <!-- tab -->
    <HTabs v-model="tab" :items="items" @change="tabChange" />
    <!-- 切换 -->
    <v-tabs-items v-model="tab">
      <!-- 视频主题占比 -->
      <v-tab-item eager>
        <div v-if="videoList.length > 0" class="slider mt-6">
          <div style="font-size: 14px" class="ml-4">当前显示前{{ sliderNumber }}条主题</div>
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
      </v-tab-item>
      <!-- 视频文件数量概况 -->
      <v-tab-item eager>
        <div id="echarts2"></div>
      </v-tab-item>
      <!-- 发布方视频统计 -->
      <v-tab-item eager>
        <div id="echarts3"></div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import Echarts from 'echarts'
import Moment from 'moment'
import HTabs from '@/components/h-tabs.vue'
@Component({
  components: {
    HTabs
  }
})
@http
// 视频 选择周
export default class VideoDataStatistics extends Vue {
  // tab
  private tab = null
  private items = ['视频主题占比', '视频文件数量概况', '发布方视频统计']

  // 图表
  private videoList: Array<any> = []
  private maxValue = 10

  private sliderNumber = 10
  // item1
  private async getVideoAllItem1() {
    if (this.videoList.length === 0) {
      const { data } = await this.h_request['httpGET']('GET_TOPICS_GETVIDEO', {})
      this.videoList = [...data]
      this.maxValue = data.length
      this.handelECharts('echarts1', this.getOption1(this.videoList, this.sliderNumber))
    } else {
      setTimeout(() => {
        this.handelECharts('echarts1', this.getOption1(this.videoList, this.sliderNumber))
      }, 500)
    }
  }

  // item2
  private async getVideoAllItem2() {
    if (this.videoList.length === 0) {
      const { data } = await this.h_request['httpGET']('GET_TOPICS_GETVIDEO', {})
      this.videoList = [...data]
      this.maxValue = data.length
      this.handelECharts('echarts2', this.getOption2(this.videoList))
    } else {
      setTimeout(() => {
        this.handelECharts('echarts2', this.getOption2(this.videoList))
      }, 500)
    }
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

  // tabChange
  private tabChange(num: unknown) {
    if (num === 0) {
      this.getVideoAllItem1()
    } else if (num === 1) {
      this.getVideoAllItem2()
    } else {
      console.log(2)
    }
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
  height: 400px;
  width: 100%;
}
#echarts2 {
  height: 250px;
  width: 95%;
}
</style>
