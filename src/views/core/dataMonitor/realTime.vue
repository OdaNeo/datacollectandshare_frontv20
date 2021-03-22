<template>
  <div id="realTime">
    <v-row no-gutters class="d-flex mx-3">
      <v-col cols="2">
        <v-text-field
          solo
          dense
          height="35px"
          placeholder="请输入查找的主题ID"
          clearable
          append-icon="mdi-magnify"
          v-model="queryTopicID"
          v-only-num
        >
        </v-text-field>
      </v-col>
      <v-col cols="2" class="ml-6">
        <v-select
          solo
          dense
          :items="categories"
          clearable
          height="35px"
          v-model="queryTopicType"
          placeholder="请选择作业类别"
        ></v-select>
      </v-col>
      <v-col class="flex-grow-1"></v-col>

      <!--  右上角枚举 -->
      <v-col cols="4" style="line-height: 42px; font-size: 15px; letter-spacing: 1px">
        <div class="real-time-enum" v-for="item in types" :key="item.id">
          <span :style="{ backgroundColor: item.color }"></span>
          {{ item.name }}
        </div>
      </v-col>
    </v-row>
    <div class="chartsContainer">
      <div class="chartElements" ref="chartElements" v-for="item in dataAll" :key="item.topicId"></div>
      <!-- TODO: 分页 -->
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'

@echarts
@Component
@http
@util
export default class RealTime extends Vue {
  private timer = 0
  private interval = 10
  // dom
  private el: any
  // eCharts 对象
  private chartElements: Array<any> = []
  private dataAll: Array<any> = []
  private yDataMap: Array<[number, number]> = []

  // 当天零点时间戳
  private zeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime()
  private now = new Date().getTime()

  private categories = ['日志', '事务', '视频']
  private types = [
    { name: '异常', color: 'red' },
    { name: '离线', color: 'grey' },
    { name: '警告', color: 'orange' },
    { name: '正常', color: '#2ECC71' }
  ]

  // 查询主题ID input框内容
  private queryTopicID = ''
  private queryTopicType = ''

  // 柯里化option
  private getOption(data: any) {
    return {
      title: {
        text: `作业ID：${data.topicId}`,
        subtext: `类型：${data.serverName}`,
        left: 'center',
        textStyle: {
          color: `#1976d2`,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 12
        },
        padding: [15, 0, 0, 0]
      },
      grid: {
        top: '15%',
        bottom: '23%'
      },
      dataZoom: [
        // {
        //   type: 'inside',
        //   filterMode: 'weakFilter',
        //   startValue: new Date().getTime() - 0.8 * 60 * 60 * 1000,
        //   endValue: new Date().getTime() + 0.2 * 60 * 60 * 1000
        // },
        {
          type: 'slider',
          filterMode: 'weakFilter',
          // 默认显示半个小时内的
          startValue: new Date().getTime() - 0.85 * 30 * 60 * 1000,
          endValue: new Date().getTime() + 0.15 * 30 * 60 * 1000,
          showDataShadow: false,
          top: '92%',
          height: 6,
          borderColor: 'transparent',
          backgroundColor: '#CBD1DA',
          handleIcon:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARVBMVEX////R0dvN0tvL0tvL0dvM0trO2OLM09vL0dvO0dvL0trM09zM0tvM0tvL0drU2eHp6+/3+Pn9/f7N09vq7PD////y9PaQXLgBAAAADnRSTlMAHGu22fMam/xO8m79/nbCHu4AAAABYktHRACIBR1IAAAAB3RJTUUH4wcSEhgvIlxSlgAAAJtJREFUKM91kusShCAIhfGeZaamvf+jLpS7qzPx/WDGcxQQBXgQUmljtJICRqxbYmdx9q/7NQ6s/qtvIU6Ere/faXWkXEpOx+3cZyzlOWvr1JOyUR1H+tV+XOQ47JP6qW2gUm8CJOVvE1RHgsKYZiOhpEBjzLORUdJgMJbZKCgZ3mBTscXZdtkLsiPhhwg+vI+dfyj+afnP8PZ9PjqGHTJG9o2tAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTE4VDEwOjI0OjQ3KzA4OjAwIkgiHgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0xOFQxMDoyNDo0NyswODowMFMVmqIAAAAASUVORK5CYII=',
          handleSize: 16,
          // handleStyle: {
          //   shadowBlur: 4,
          //   shadowColor: '#aaa'
          // },
          labelFormatter: (time: number) => {
            return this.h_utils.timeUtil.stampToTodayTime(time)
          }
        }
      ],
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        min: this.zeroTimeStamp,
        max: this.zeroTimeStamp + 24 * 60 * 60 * 1000
      },
      yAxis: {
        type: 'value',
        show: false,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        min: 0,
        max: 2
      },
      series: [
        {
          // 正常
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `${this.types[3]['color']}`
          },
          data: data.dataSet,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: this.now }],
            lineStyle: {
              color: '#2ECC71'
            }
          }
        },
        {
          // 异常
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `${this.types[0]['color']}`
          },
          data: data.dataSet,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: this.now }],
            lineStyle: {
              color: '#2ECC71'
            }
          }
        },
        {
          // 离线
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `${this.types[1]['color']}`
          },
          data: data.dataSet,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: this.now }],
            lineStyle: {
              color: '#2ECC71'
            }
          }
        },
        {
          // 警告
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `${this.types[2]['color']}`
          },
          data: data.dataSet,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: this.now }],
            lineStyle: {
              color: '#2ECC71'
            }
          }
        }
      ]
    }
  }

  private async updateRange() {
    // 增量更新
    // const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME', {
    //   date: new Date().getTime()
    // })
    // this.dataAll = data
    this.dataAll[0].dataSet.push([new Date(), 1])
    this.dataAll[1].dataSet.push([new Date(), 1])

    for (let i = 0; i < this.el.length; i++) {
      this.chartElements[i].setOption({
        series: [
          {
            type: 'line',
            showSymbol: false,
            lineStyle: {
              color: `${this.types[1]['color']}`
            },
            data: this.dataAll[i].dataSet,
            markLine: {
              symbol: ['none', 'none'],
              label: { show: false },
              data: [{ xAxis: this.now }],
              lineStyle: {
                color: '#2ECC71'
              }
            }
          }
        ]
      })
    }
  }

  //  初始化echarts
  private initECharts(): void {
    // 获得所有的数据
    this.dataAll = [
      {
        'topicId': 88888888,
        'serverName': '日志',
        'dataSet': [
          [this.now - 700000, 1],
          [this.now - 500000, 1],
          [this.now, 1]
        ]
      },
      {
        'topicId': 88888886,
        'serverName': '事务',
        'dataSet': [
          [this.now - 1000000, 1],
          [this.now, 1]
        ]
      },
      {
        'topicId': 88888889,
        'serverName': '视频',
        'dataSet': []
      },
      {
        'topicId': 8884588,
        'serverName': '日志',
        'dataSet': []
      },
      {
        'topicId': 88888123,
        'serverName': '事务',
        'dataSet': []
      },
      {
        'topicId': 8888234889,
        'serverName': '视频',
        'dataSet': []
      },
      {
        'topicId': 8823888888,
        'serverName': '日志',
        'dataSet': []
      },
      {
        'topicId': 8888824886,
        'serverName': '事务',
        'dataSet': []
      }
    ]
    this.$nextTick(() => {
      this.el = this.$refs.chartElements

      for (let i = 0; i < this.el.length; i++) {
        this.chartElements[i] = this.h_echarts.init(this.el[i] as HTMLCanvasElement, 'light', { renderer: 'svg' })
        this.chartElements[i].setOption(this.getOption(this.dataAll[i]))
      }
    })
  }

  mounted(): void {
    // 初始化
    this.initECharts()
    // 更新
    this.timer = setInterval(() => {
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
  width: 98.5%;
}
.real-time-enum {
  display: inline-block;
  width: 100px;
  padding-left: 25px;
  position: relative;
}
.real-time-enum span {
  position: absolute;
  width: 18px;
  height: 3px;
  top: 18px;
  left: 0px;
}
.chartsContainer {
  width: 100%;
  height: 77vh;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.chartElements {
  width: calc(25% - 24px);
  background-color: #fff;
  height: 46.5%;
  margin: 0px 12px;
  border-radius: 6px;
  box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 2%) !important;
}
</style>
