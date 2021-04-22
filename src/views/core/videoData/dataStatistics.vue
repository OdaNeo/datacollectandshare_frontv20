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
        <v-row class="mt-2 ml-1">
          <!-- 系统id -->
          <v-col cols="3">
            <v-select
              v-model="querySystemId"
              outlined
              dense
              :items="systemItems"
              height="35px"
              label="请选择发布方"
              v-only-num
              @change="getVideoAllItem3(1)"
            ></v-select>
          </v-col>

          <!-- 时间范围 -->
          <v-col cols="3">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-click="false"
              :close-on-content-click="false"
              transition="scale-transition"
              :return-value.sync="dates"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateRangeText"
                  outlined
                  placeholder="请选择时间范围"
                  height="35px"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker locale="zh-Hans" v-model="dates" no-title range :allowed-dates="allowedDates">
                <v-spacer></v-spacer>
                <v-btn text color="grey" @click="menu = false">取消</v-btn>
                <v-btn
                  text
                  :disabled="dates.length < 2"
                  color="primary"
                  @click="
                    $refs.menu.save(dates)
                    getVideoAllItem3(1)
                  "
                >
                  确定
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <!-- 系统id -->
          <v-col cols="3">
            <v-select
              v-model="pageNum"
              outlined
              dense
              :items="paginationLengthItems"
              height="35px"
              label="获取更多"
              v-only-num
              @change="getVideoAllItem3"
            ></v-select>
          </v-col>
        </v-row>
        <div class="echartsContainer">
          <!-- loading -->
          <HOverLay :loading="loading" />
          <div id="echarts3"></div>
          <div v-if="!showECharts" class="showECharts">
            <div style="font-size: 1rem; color: #666">查无数据</div>
            <img class="img" src="../../../assets/image/kong.png" alt="" />
          </div>
        </div>
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
import HOverLay from '@/components/h-overlay.vue'
@Component({
  components: {
    HTabs,
    HOverLay
  }
})
@http
export default class VideoDataStatistics extends Vue {
  // tab
  private tab = 0
  private items = ['视频主题占比', '视频文件数量概况', '发布方视频统计']

  private querySystemId = null // 搜索

  private pageNum = 1
  private pageSize = 10
  private paginationLength = 1 // 分页数
  private get paginationLengthItems() {
    const _arr = []
    for (let i = 0; i < this.paginationLength; i++) {
      _arr[i] = i + 1
    }
    return _arr
  }

  private menu = false
  private loading = false
  private showECharts = false
  // 时间范围 v-model
  private dates: string[] = []

  // 显示的时间范围
  private get dateRangeText() {
    return this.dates.join(' ~ ')
  }

  // 图表
  private videoList: Array<any> = []
  private maxValue = 10

  private sliderNumber = 10

  // 允许选择的时间范围
  private allowedDates(val: string) {
    if (this.dates.length === 0) {
      return true
    } else if (this.dates.length === 1) {
      const beginTime = Number(Moment(val).format('x'))
      const endTime = Number(Moment(this.dates[0]).format('x'))
      return beginTime + 24 * 60 * 60 * 1000 > endTime
    } else {
      return true
    }
  }

  private get systemItems() {
    const _item = JSON.parse(sessionStorage.getItem('systemInfo') || '')

    return _item.map((i: { name: string; id: number }) => {
      return {
        text: i.name,
        value: i.id
      }
    })
  }

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

  // item3
  private async getVideoAllItem3(page: number) {
    if (this.dates.length !== 2 || !this.querySystemId) {
      return
    }
    this.loading = true
    this.pageNum = page

    const { data } = await this.h_request['httpGET']('GET_STATISTICS_STATVIDEOTOPICDATA', {
      startTime: this.dates[0],
      endTime: this.dates[1],
      systemId: this.querySystemId,
      dataType: 7,
      pageNum: page,
      pageSize: this.pageSize
    })

    this.showECharts = true
    this.loading = false
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1

    if (data && data.list) {
      this.handelECharts('echarts3', this.getOption3(data.list))
    } else {
      this.paginationLength = 1
      this.showECharts = false
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
    _data[number] = { fileNum: otherFileNum, topicId: '其余' }

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

  // echart3
  private getOption3(data: any) {
    const _data: [string, string, string][] = []
    const topics: string[] = []
    let MAX = 0

    data.map((item: any) => {
      let y = Object.keys(item)[0]
      const _time: string[] = []
      const _obj: { [key: string]: number } = {}
      item[y].map((i: { time?: string; count?: string }) => {
        // _data.push([i.time, y, i.count])
        if (i.time && i.count) {
          if (_time.includes(i.time)) {
            _obj[i.time] += Number(i.count)
          } else {
            _time.push(i.time)
            _obj[i.time] = Number(i.count)
          }
        }
      })

      Object.entries(_obj).forEach(item => {
        if (MAX < item[1]) {
          MAX = item[1]
        }
        _data.push([item[0], y, item[1].toString()])
      })
      topics.push(y)
    })

    const _start = Number(Moment(this.dates[0]).format('x'))
    const _end = Number(Moment(this.dates[1]).format('x'))

    const _range = (_end - _start) / (60 * 24 * 60 * 1000)

    const days = []
    for (let i = 0; i < _range + 1; i++) {
      days.unshift(Moment(_end).subtract(i, 'days').format('YYYY-MM-DD'))
    }

    return {
      title: {
        left: 'center',
        top: '15',
        text: `${this.dates[0]} - ${this.dates[1]}视频文件大小统计`
      },
      tooltip: {
        position: 'top',
        formatter: (params: { value: [string, string, string] }) => {
          return params.value[0] + `主题` + params.value[1] + `<br />` + `视频文件大小为` + params.value[2] + `MB`
        }
      },
      grid: {
        left: 50,
        bottom: 10,
        right: 100,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: days,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#999',
            type: 'dashed'
          }
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: topics,
        axisLine: {
          show: false
        }
      },
      series: [
        {
          type: 'scatter',
          symbolSize: (val: any) => {
            return val[2] * (40 / MAX)
          },
          data: _data
        }
      ]
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
#echarts3 {
  height: 100%;
  width: 100%;
}
.echartsContainer {
  position: relative;
  height: 65vh;
  background: #fff;
}
.showECharts {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.img {
  width: 500px;
  margin-top: 10px;
}
</style>
