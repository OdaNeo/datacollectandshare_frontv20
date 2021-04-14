<template>
  <div id="realTime">
    <v-row no-gutters class="d-flex mx-3">
      <!-- 搜索 -->
      <v-col cols="3">
        <v-select
          outlined
          dense
          :items="serverNameCategories"
          clearable
          :clear-icon="mdiCloseCircleOutline"
          height="35px"
          v-model="queryServerName"
          @change="handleCurrentChange(1)"
          label="请选择作业类别"
        ></v-select>
      </v-col>
      <!-- 分割 -->
      <v-col class="flex-grow-1"></v-col>

      <!--  右上角枚举 -->
      <v-col cols="3" style="line-height: 42px; font-size: 15px; letter-spacing: 1px">
        <div class="real-time-enum" v-for="item in types" :key="item.id">
          <span :style="{ backgroundColor: item.color }"></span>
          {{ item.name }}
        </div>
      </v-col>
    </v-row>

    <!-- loading -->
    <div v-if="loading" class="text-center" style="height: 200px; margin-top: 120px">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- noData -->
    <div
      v-else-if="dataAll.length === 0"
      class="text-center"
      id="realTimeNoData"
      style="height: 200px; margin-top: 120px"
    >
      <div style="font-size: 18px; color: #666">查无数据</div>
      <img class="img" src="../../../assets/image/kong.png" alt="" />
    </div>
    <!-- echarts -->
    <div v-else class="charts-container">
      <div class="chart-elements" ref="chartElements" v-for="item in dataAll" :key="item.topicId"></div>
    </div>

    <!--  分页 -->
    <v-pagination
      v-if="!loading && dataAll.length !== 0 && paginationLength !== 0"
      :length="paginationLength"
      :total-visible="10"
      @input="handleCurrentChange"
      :value="pageNum"
    ></v-pagination>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'
import { mdiCloseCircleOutline } from '@mdi/js'
import { paramsType } from '@/type/http-request.type'
@echarts
@Component
@http
@util
export default class RealTime extends Vue {
  private timer = 0
  private interval = 10
  private mdiCloseCircleOutline = mdiCloseCircleOutline

  private timeRange = 10 * 60 * 1000 // 10分钟
  // dom
  private el: any
  private loading = false
  // eCharts 对象
  private chartElements: Array<any> = []
  private dataAll: Array<any> = []

  // 当天零点时间戳
  private zeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime()
  private now = new Date().getTime()

  private serverNameCategories = ['日志', '事务', '视频']
  private types = [
    { name: '异常', color: 'red' },
    { name: '离线', color: 'grey' },
    { name: '警告', color: 'orange' }
  ]

  // 分页
  private paginationLength = 0
  private pageNum = 1
  private pageSize = 4

  // 查询主题ID input框内容
  // private queryTopicID = ''
  private queryServerName = ''

  // 柯里化option
  private getOption(data: any) {
    // console.log(data['正常'])
    // const dataSet = [
    //   { createTime: '1616342400021', status: 1 },
    //   { createTime: '1616382855289', status: 1 }
    // ]
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
        padding: [10, 0, 0, 0]
      },
      grid: {
        top: '17%',
        bottom: '17%',
        left: '5%',
        right: '5%'
      },
      dataZoom: [
        {
          type: 'inside',
          filterMode: 'weakFilter',
          startValue: new Date().getTime() - 0.1 * this.timeRange,
          endValue: new Date().getTime() + 0.9 * this.timeRange
        },
        {
          type: 'slider',
          filterMode: 'weakFilter',
          // 默认显示10min内的
          startValue: new Date().getTime() - 0.1 * this.timeRange,
          endValue: new Date().getTime() + 0.9 * this.timeRange,
          showDataShadow: false,
          top: '82%',
          height: 0,
          borderColor: 'transparent',
          backgroundColor: '#CBD1DA',
          handleIcon:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARVBMVEX////R0dvN0tvL0tvL0dvM0trO2OLM09vL0dvO0dvL0trM09zM0tvM0tvL0drU2eHp6+/3+Pn9/f7N09vq7PD////y9PaQXLgBAAAADnRSTlMAHGu22fMam/xO8m79/nbCHu4AAAABYktHRACIBR1IAAAAB3RJTUUH4wcSEhgvIlxSlgAAAJtJREFUKM91kusShCAIhfGeZaamvf+jLpS7qzPx/WDGcxQQBXgQUmljtJICRqxbYmdx9q/7NQ6s/qtvIU6Ere/faXWkXEpOx+3cZyzlOWvr1JOyUR1H+tV+XOQ47JP6qW2gUm8CJOVvE1RHgsKYZiOhpEBjzLORUdJgMJbZKCgZ3mBTscXZdtkLsiPhhwg+vI+dfyj+afnP8PZ9PjqGHTJG9o2tAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTE4VDEwOjI0OjQ3KzA4OjAwIkgiHgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0xOFQxMDoyNDo0NyswODowMFMVmqIAAAAASUVORK5CYII=',
          handleSize: 16,
          labelFormatter: (time: number) => {
            return this.h_utils.timeUtil.stampToTodayTime(time)
          }
        }
      ],
      tooltip: {
        show: true,
        trigger: 'item',
        position: 'top',
        formatter: (params: any) => {
          return this.h_utils.timeUtil.stamptoFullTime(params.data[0], '-')
        }
      },
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
          // baseline 每n分钟截取一个点, 虚线
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: `#2ECC71`,
            width: 2,
            type: 'dashed'
          },
          data: data['正常'],
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: this.now }],
            lineStyle: {
              color: '#2ECC71'
            }
          }
        },
        {
          // 异常 点
          type: 'scatter',
          symbolSize: 14,
          itemStyle: {
            color: `${this.types[0]['color']}`
          },
          data: data['异常']
        },
        {
          // 离线 点
          type: 'scatter',
          symbolSize: 14,
          symbol: 'circle',
          itemStyle: {
            color: `${this.types[1]['color']}`
          },
          data: data['离线']
        },
        {
          // 警告 点
          type: 'scatter',
          symbolSize: 14,
          itemStyle: {
            color: `${this.types[2]['color']}`
          },
          data: data['警告']
        }
      ]
    }
  }

  private async updateRange(params: paramsType) {
    // 增量更新
    const { data } = await this.h_request.httpPOST<paramsType>('POST_MONITOR_FINDLOGBYTIME', params)
    // console.log(data.list)
    // console.log(this.dataAll)
    if (data) {
      for (let i = 0; i < this.el.length; i++) {
        //  data.list[i]['dataSet']
        // 获得旧option
        const _option = this.chartElements[i].getOption()
        // 获得当前时间戳
        const _time = Number(new Date().getTime())
        // 获得原始endValue
        const _endValue = _option.dataZoom[0].endValue
        // 获得原始startValue
        const _startValue = _option.dataZoom[0].startValue
        //
        const timeRange = _endValue - _startValue
        // 自动延长横轴可视区域

        if (_time >= _startValue + 0.9 * timeRange && _time <= _endValue + 0.05 * timeRange) {
          _option.dataZoom = [
            {
              type: 'inside',
              filterMode: 'weakFilter',
              startValue: _endValue - 0.1 * timeRange,
              endValue: _endValue + 0.9 * timeRange
            },
            {
              type: 'slider',
              filterMode: 'weakFilter',
              showDataShadow: false,
              top: '82%',
              height: 0,
              borderColor: 'transparent',
              backgroundColor: '#CBD1DA',
              handleIcon:
                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARVBMVEX////R0dvN0tvL0tvL0dvM0trO2OLM09vL0dvO0dvL0trM09zM0tvM0tvL0drU2eHp6+/3+Pn9/f7N09vq7PD////y9PaQXLgBAAAADnRSTlMAHGu22fMam/xO8m79/nbCHu4AAAABYktHRACIBR1IAAAAB3RJTUUH4wcSEhgvIlxSlgAAAJtJREFUKM91kusShCAIhfGeZaamvf+jLpS7qzPx/WDGcxQQBXgQUmljtJICRqxbYmdx9q/7NQ6s/qtvIU6Ere/faXWkXEpOx+3cZyzlOWvr1JOyUR1H+tV+XOQ47JP6qW2gUm8CJOVvE1RHgsKYZiOhpEBjzLORUdJgMJbZKCgZ3mBTscXZdtkLsiPhhwg+vI+dfyj+afnP8PZ9PjqGHTJG9o2tAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTE4VDEwOjI0OjQ3KzA4OjAwIkgiHgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0xOFQxMDoyNDo0NyswODowMFMVmqIAAAAASUVORK5CYII=',
              handleSize: 16,
              labelFormatter: (time: number) => {
                return this.h_utils.timeUtil.stampToTodayTime(time)
              },
              startValue: _endValue - 0.1 * timeRange,
              endValue: _endValue + 0.9 * timeRange
            }
          ]
        }

        _option.series[0].data.push([_time, 1])

        if (data.list[i]['dataSet'].length !== 0) {
          data.list[i]['dataSet'].forEach((item: { createTime: string; status: number }) => {
            if (item.status === 1) {
              _option.series[1].data.push([Number(item['createTime']), 1])
            }
            if (item.status === 2) {
              _option.series[2].data.push([Number(item['createTime']), 1])
            }
            if (item.status === 3) {
              _option.series[3].data.push([Number(item['createTime']), 1])
            }
          })
        }
        this.chartElements[i].setOption(_option)
      }
    }
  }

  // 搜索方法
  // pageNum     必填
  // pageSize    必填
  // serverName  选填
  // status      选填
  // createTime  选填
  private async searchMethod(params: object) {
    this.loading = true

    const { data } = await this.h_request.httpPOST<object>('POST_MONITOR_FINDLOGBYTIME', params)
    this.loading = false
    // 如果有data
    if (data) {
      this.paginationLength = Math.ceil(data.total / this.pageSize) || 1
      this.dataAll = data.list.map((item: any) => {
        // baseline, 填充数据
        let _list = []
        let _i = 0
        // 10秒 一个点
        while (this.zeroTimeStamp + _i * 10 * 1000 < this.now) {
          _list.push([this.zeroTimeStamp + _i * 10 * 1000, 1])
          _i++
        }
        // 异常
        let _list2 = []
        // 离线
        let _list3 = []
        // 警告
        let _list4 = []
        // console.log(item.dataSet)
        // const dataSet = [
        //   { createTime: this.zeroTimeStamp + 20000000, status: 1 },
        //   { createTime: this.zeroTimeStamp + 10000000, status: 2 }
        // ]
        for (let i = 0; i < item.dataSet.length; i++) {
          if (item.dataSet[i]['status'] === 1) {
            _list2.push([Number(item.dataSet[i]['createTime']), 1])
          } else if (item.dataSet[i]['status'] === 2) {
            _list3.push([Number(item.dataSet[i]['createTime']), 1])
          } else if (item.dataSet[i]['status'] === 3) {
            _list4.push([Number(item.dataSet[i]['createTime']), 1])
          }
        }

        return {
          '异常': _list2,
          '离线': _list3,
          '警告': _list4,
          '正常': [..._list, [this.now, 1]],
          serverName: item.serverName,
          topicId: item.topicId
        }
      })
      // 初始化
      this.initECharts()
    } else {
      // 如果没数据清除定时器
      clearInterval(this.timer)
    }
  }

  //  初始化echarts
  private initECharts(): void {
    this.$nextTick(() => {
      this.el = this.$refs.chartElements

      for (let i = 0; i < this.el.length; i++) {
        this.chartElements[i] = this.h_echarts.init(this.el[i] as HTMLCanvasElement, 'light', { renderer: 'svg' })
        this.chartElements[i].setOption(this.getOption(this.dataAll[i]))
      }
    })
  }

  // 分页方法  &&  serverName 搜索方法
  private handleCurrentChange(value: number) {
    this.pageNum = value
    // 重置now
    this.now = new Date().getTime()

    if (!this.queryServerName) {
      this.searchMethod({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
    } else {
      this.searchMethod({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        serverName: this.queryServerName
      })
    }
  }

  mounted(): void {
    // 获得历史数据
    this.searchMethod({
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })

    // 更新
    this.timer = setInterval(() => {
      if (!this.queryServerName) {
        this.updateRange({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          createTime: new Date().getTime()
        })
      } else {
        this.updateRange({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          createTime: new Date().getTime(),
          serverName: this.queryServerName
        })
      }
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
#realTimeNoData >>> .v-icon__svg {
  height: 50px !important;
  width: 50px !important;
}
.img {
  width: 560px;
  margin-top: 30px;
}
.real-time-enum {
  display: inline-block;
  width: 33%;
  padding-left: 25px;
  position: relative;
}
.real-time-enum span {
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  top: 12px;
  left: 0px;
}
.charts-container {
  width: 100%;
  height: 73vh;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.chart-elements {
  width: calc(50% - 24px);
  background-color: #fff;
  height: 46.5%;
  margin: 0px 12px;
  border-radius: 6px;
  box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 2%) !important;
}
</style>
