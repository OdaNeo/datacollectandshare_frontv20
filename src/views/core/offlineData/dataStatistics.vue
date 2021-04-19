<template>
  <div id="OfflineDataStatistics">
    <v-row>
      <v-col cols="3">
        <v-menu
          ref="menu"
          v-model="showMenu"
          :close-on-content-click="false"
          :return-value.sync="endTime"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              dense
              height="35px"
              v-model="endTime"
              label="截止日期"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="zh-cn"
            v-model="endTime"
            @click.native="$refs.menu.save(endTime)"
            @change="handleTimeChange"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="3">
        <v-select
          outlined
          dense
          v-model="pageNum"
          height="35px"
          :items="items"
          @change="handlePageChange"
          label="获取更多主题信息"
        ></v-select>
      </v-col>
    </v-row>
    <!-- 图表显示区域 -->
    <div class="echartsContainer">
      <!-- loading -->
      <HOverLay :loading="loading" />
      <div id="eCharts1"></div>
      <div v-if="!showECharts" class="showECharts">
        <div style="font-size: 1rem; color: #666">查无数据</div>
        <img class="img" src="../../../assets/image/kong.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnType } from '@/type/http-request.type'
import Moment from 'moment'
import util from '@/decorator/utilsDecorator'
import HOverLay from '@/components/h-overlay.vue'
import echarts from '@/decorator/echartsDecorator'
import { offlineDataStatisticsType } from '@/type/offline-data.type'
@Component({
  components: {
    HOverLay
  }
})
@http
@util
@echarts
export default class OfflineDataStatistics extends Vue {
  private myChartElement1: any = null

  private DEFAULT_RANGE = 30
  private showMenu = false

  private loading = true
  private showECharts = false
  // 起始时间
  private get startTime() {
    return Moment(this.endTime).subtract(this.DEFAULT_RANGE, 'days').format('YYYY-MM-DD')
  }
  // 终止时间
  private endTime: string = Moment().format('YYYY-MM-DD')
  // 分页
  private pageNum = 1
  private pageSize = 10
  private paginationLength = 1

  private get items() {
    const _arr: number[] = []
    for (let i = 1; i < this.paginationLength + 1; i++) {
      _arr.push(i)
    }
    return _arr
  }

  // 横轴
  private get days() {
    const _arr = []
    for (let i = 0; i < this.DEFAULT_RANGE + 1; i++) {
      _arr.unshift(Moment(this.endTime).subtract(i, 'days').format('YYYY-MM-DD'))
    }
    return _arr
  }
  // 时间选择
  private handleTimeChange() {
    this.getRelease({
      startTime: this.startTime,
      endTime: this.endTime,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
  }
  // 分页选择
  private handlePageChange(value: number) {
    this.getRelease({
      startTime: this.startTime,
      endTime: this.endTime,
      pageNum: value,
      pageSize: this.pageSize
    })
  }

  // echarts1 handle
  private initECharts1() {
    this.$nextTick(() => {
      const element = document.getElementById('eCharts1')
      this.myChartElement1 = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })
    })
  }

  // 获取数据
  private async getRelease(params: Partial<offlineDataStatisticsType>) {
    this.loading = true
    // 离线不区分系统，故传 -1
    params.systemId = `-1`
    params.dataType = 4

    const { data }: returnType = await this.h_request.httpGET<Partial<offlineDataStatisticsType>>(
      'GET_STATISTICS_STAT_TOPIC_DATA',
      params
    )

    this.showECharts = true
    this.loading = false
    if (data.list) {
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
      this.handleECharts1(data.list)
    } else {
      this.paginationLength = 1
      this.showECharts = false
    }
  }

  // echarts handle
  private handleECharts1(data: unknown) {
    this.$nextTick(() => {
      this.myChartElement1.setOption(this.getOption1(data), true)
    })
  }

  // setOption
  private getOption1(data: any) {
    const _data: [string, string, string][] = []
    const topics: string[] = []
    let MAX = 0

    data.map((item: any) => {
      let y = Object.keys(item)[0]
      const _time: string[] = []
      const _obj: { [key: string]: number } = {}
      item[y].map((i: { time: string; count: string }) => {
        // _data.push([i.time, y, i.count])
        if (_time.includes(i.time)) {
          _obj[i.time] += Number(i.count)
        } else {
          _time.push(i.time)
          _obj[i.time] = Number(i.count)
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

    return {
      title: {
        left: 'center',
        top: '15',
        text: `${this.startTime} - ${this.endTime}离线数据统计`
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return params.value[0] + `主题` + params.value[1] + `包含` + params.value[2] + `条数据`
        }
      },
      grid: {
        left: 20,
        bottom: 10,
        right: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.days,
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

  mounted(): void {
    // 初始化
    this.initECharts1()

    this.getRelease({
      startTime: this.startTime,
      endTime: this.endTime,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
  }
}
</script>
<style scoped>
#eCharts1 {
  width: 100%;
  height: 100%;
}
.echartsContainer {
  position: relative;
  height: 75vh;
  background: #fff;
  border-radius: 5px;
}
.showECharts {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  border-radius: 5px;
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
