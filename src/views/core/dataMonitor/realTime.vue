<template>
  <div id="realTime">
    <v-row no-gutters class="ml-3">
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
          placeholder="请选择主题类别"
        ></v-select>
      </v-col>
      <v-col cols="2" class="ml-6">
        <v-select
          solo
          dense
          :items="type"
          clearable
          height="35px"
          v-model="queryTopicClass"
          placeholder="请选择主题类型"
        ></v-select>
      </v-col>
      <!-- TODO: 右上角枚举 -->
    </v-row>
    <div class="chartsContainer">
      <div class="chartElements" ref="chartElements" v-for="item in dataAll" :key="item.topicId"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
// import { calendarType } from '@/enum/calendar-enum'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'
// import { realTimeData } from '@/type/calendar'

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
    { name: '作业正常', color: '#2ECC71' }
  ]
  private type = ['异常', '离线', '警告']

  // 查询主题ID input框内容
  private queryTopicID = ''
  private queryTopicType = ''
  private queryTopicClass = ''

  // 柯里化option
  private getOption(data: any) {
    return {
      title: {
        text: `作业ID：${data.topicId}    类型：${data.serverName}`,
        left: 'center',
        textStyle: {
          color: `#1976d2`,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 20
        },
        padding: [15, 0, 0, 0]
      },
      grid: {
        top: 45,
        bottom: 75
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
          startValue: new Date().getTime() - 0.85 * 30 * 60 * 1000,
          endValue: new Date().getTime() + 0.15 * 30 * 60 * 1000,
          showDataShadow: false,
          top: 250,
          height: 8,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon:
            'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z',
          handleSize: 16,
          handleStyle: {
            shadowBlur: 4,
            shadowColor: '#aaa'
          },
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
        // min: 0,
        // max: 24,
        // axisLabel: {
        //   formatter: (value: number) => {
        //     return value
        //   }
        // }
      },
      yAxis: {
        type: 'value',
        // show: false,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        min: 0,
        max: 4
      },
      series: [
        // 实线表示有数据，虚线表示没有数据
        {
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `${this.types[data.status - 1]['color']}`
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
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `${this.types[data.status - 1]['color']}`,
            width: 4,
            type: 'dotted'
          },
          data: data.dataSet2,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: this.now }]
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
    this.dataAll[0].dataSet.push([new Date(), 2])
    this.dataAll[1].dataSet.push([new Date(), 2])

    for (let i = 0; i < this.el.length; i++) {
      this.chartElements[i].setOption(this.getOption(this.dataAll[i]))
    }
  }

  //  初始化echarts
  private initECharts(): void {
    // 获得所有的数据
    this.dataAll = [
      {
        'id': 1,
        'topicId': 88888888,
        'serverName': '日志',
        'status': 3,
        'dataSet': [
          [this.now - 700000, 2],
          [this.now - 500000, 2],
          [this.now, 2]
        ],
        'dataSet2': [
          [this.now - 1200000, 2],
          [this.now - 900000, 2],
          [this.now - 700000, 2]
        ]
      },
      {
        'id': 2,
        'topicId': 88888886,
        'serverName': '事务',
        'status': 3,
        'dataSet': [
          [this.now - 1000000, 2],
          [this.now, 2]
        ]
      },
      {
        'id': 3,
        'topicId': 88888889,
        'serverName': '视频',
        'status': 1
      },
      {
        'id': 1,
        'topicId': 8884588,
        'serverName': '日志',
        'status': 3
      },
      {
        'id': 2,
        'topicId': 88888123,
        'serverName': '事务',
        'status': 3
      },
      {
        'id': 3,
        'topicId': 8888234889,
        'serverName': '视频',
        'status': 1
      },
      {
        'id': 1,
        'topicId': 8823888888,
        'serverName': '日志',
        'status': 2
      },
      {
        'id': 2,
        'topicId': 8888824886,
        'serverName': '事务',
        'status': 3
      }
      // {
      //   'id': 3,
      //   'topicId': 8888882389,
      //   'serverName': '视频',
      //   'status': 1
      // },
      // {
      //   'id': 3,
      //   'topicId': 88812882389,
      //   'serverName': '视频',
      //   'status': 1
      // },
      // {
      //   'id': 3,
      //   'topicId': 888813882389,
      //   'serverName': '视频',
      //   'status': 1
      // },
      // {
      //   'id': 3,
      //   'topicId': 812888882389,
      //   'serverName': '视频',
      //   'status': 1
      // }
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
.chartsContainer {
  width: 100%;
  height: 600px;
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
