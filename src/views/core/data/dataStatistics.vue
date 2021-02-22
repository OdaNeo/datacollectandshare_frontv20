<template>
  <div id="dataStatistics">
    <v-row>
      <v-col cols="2">
        <v-select
          solo
          dense
          height="35px"
          v-model="systemValue"
          :items="systemItems"
          label="请选择系统"
          @change="getTopicList"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="beginDate"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              solo
              dense
              height="35px"
              v-model="beginDate"
              label="请选择日期"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="zh-cn"
            v-model="beginDate"
            @change="getTopicList"
            @click.native="$refs.menu.save(beginDate)"
            no-title
            scrollable
          >
            <!-- <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">取消</v-btn>
                            <v-btn text color="primary" @click="$refs.menu.save(beginDate)">确定</v-btn> -->
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-select
          solo
          dense
          height="35px"
          v-model="currentSelectMonth"
          @change="getTopicList"
          :items="monthSelectItems"
          label="获取更长时间信息"
        ></v-select>
      </v-col>
      <v-col cols="2" v-if="topicListNumber > 1">
        <v-select
          solo
          dense
          v-model="releasePageNum"
          height="35px"
          :items="pageList"
          label="获取更多主题信息"
          @change="getTopicList"
        ></v-select>
      </v-col>
      <!-- <v-col cols="2">
                   <v-btn
                       color="primary"
                       @click="getTopicList"
                       dark
                   >生成数据</v-btn>
                </v-col> -->
    </v-row>
    <v-row class="chartContent">
      <v-tabs v-model="tabs" background-color="indigo" center-active dark>
        <v-tab @click.native="issueTopic()"> 发布主题 </v-tab>
        <v-tab @click.native="subscriptionTopic()">订阅主题</v-tab>
        <v-tab @click.native="getData()">系统主题占比</v-tab>
        <v-tab-item class="tabContent">
          <!-- 不满足查询条件 不显示 -->
          <div v-show="!showEchartsBox">
            <div class="nodata-box">
              <p>请选择系统及初始时间</p>
              <div class="bg-box">
                <img src="../../../assets/image/kong.png" alt="" />
              </div>
            </div>
          </div>
          <!-- 满足查询条件 显示图表 -->
          <div v-show="showEchartsBox">
            <div class="before-btn" @click="beforeMonth">
              <img src="../../../assets/image/leftBtn.png" alt="" />
            </div>
            <div class="chart-box">
              <div v-show="haveData" id="canvasPackRelease" class="canvasPack echartsBox"></div>
              <div v-show="!haveData">
                <p>{{ beginDate }}至{{ afterDate }}时间内{{ getSystemName() }}系统暂无主题消息发布</p>
                <div class="bg-box">
                  <img src="../../../assets/image/kong.png" alt="" />
                </div>
              </div>
            </div>
            <div class="after-btn" @click="afterMonth">
              <img src="../../../assets/image/rightBtn.png" alt="" />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item class="tabContent">
          <!-- 不满足查询条件 不显示 -->
          <div v-show="!showEchartsBox">
            <div class="nodata-box">
              <p>请选择系统及初始时间</p>
              <div class="bg-box">
                <img src="../../../assets/image/kong.png" alt="" />
              </div>
            </div>
          </div>
          <!-- 满足查询条件 显示图表 -->
          <div v-show="showEchartsBox">
            <div class="before-btn" @click="beforeMonth">
              <img src="../../../assets/image/leftBtn.png" alt="" />
            </div>
            <div class="chart-box">
              <div v-show="haveData" id="canvasPackSubscribe" class="canvasPack echartsBox"></div>
              <div v-show="!haveData">
                <p>{{ beginDate }}至{{ afterDate }}时间内{{ getSystemName() }}系统暂无主题订阅信息</p>
                <div class="bg-box">
                  <img src="../../../assets/image/kong.png" alt="" />
                </div>
              </div>
            </div>
            <div class="after-btn" @click="afterMonth">
              <img src="../../../assets/image/rightBtn.png" alt="" />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item class="tabContent">
          <div class="noMsg" v-show="!noMsg">
            <p>暂无系统数据</p>
            <div class="bg-box">
              <img src="../../../assets/image/kong.png" alt="" />
            </div>
          </div>
          <div class="showChart" v-show="noMsg">
            <div id="canvasPackProportion" style="width: 780px !important; height: 360px"></div>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import { returnDataType } from '@/type/http-request.type'
import echarts from '@/decorator/echartsDecorator'
import moment from 'moment'
@Component
@echarts
@http
@util
export default class DataStatistics extends Vue {
  private items: Array<string> = ['1', '2']
  private tabs = ''
  private menu = false
  private beginDate: string | null = ''
  private systemValue = ''
  private afterDate: string | null = ''
  private echartsProport: any = ''

  private noMsg = false
  private echartsType = 'Release'
  private systemItems: Array<object> = []
  private monthSelectItems: Array<object> = [
    {
      text: '1个月',
      value: 1
    },
    {
      text: '3个月',
      value: 3
    },
    {
      text: '6个月',
      value: 6
    },
    {
      text: '12个月',
      value: 12
    }
  ]
  private pageList: Array<object> = [
    {
      text: '第1条至第10条',
      value: 1
    }
  ]
  private showEchartsBox = false
  private haveData = true
  private myChartRelease: any = ''
  private myChartSubscribe: any = ''
  private startTimeRelease: any = ''
  private endTimeRelease: any = ''
  private startTimeSubscribe: any = ''
  private endTimeSubscribe: any = ''
  private topicMsgRelease: any = {}
  private topicMsgSubscribe: any = {}
  private tipicList: any = []
  private colorArr: Array<string> = ['#06AA77', '#0482F9']
  private topicListNumber = 1

  private releasePageNum = 1
  private selectMonth: Array<number> = [1, 3, 6, 12]
  private currentSelectMonth = 1
  // 上个月
  private beforeMonth() {
    // 当前月份 - 选定月数
    this.beginDate = moment(this.beginDate).subtract(this.currentSelectMonth, 'months').format('YYYY-MM-DD')
    this.afterDate = moment(this.beginDate).add(this.currentSelectMonth, 'months').format('YYYY-MM-DD')
    this.topicListNumber = 1
    this.releasePageNum = 1
    this.getTopicList()
  }
  // 下个月
  private afterMonth() {
    // 当前月份 + 选定月份
    this.beginDate = moment(this.beginDate).add(this.currentSelectMonth, 'months').format('YYYY-MM-DD')
    this.afterDate = moment(this.beginDate).add(this.currentSelectMonth, 'months').format('YYYY-MM-DD')
    this.topicListNumber = 1
    this.releasePageNum = 1
    this.getTopicList()
  }
  // 系统选择
  @Watch('beginDate')
  private dessertsChanged(val: any): void {
    this.afterDate = moment(val).add(this.currentSelectMonth, 'months').format('YYYY-MM-DD')
  }
  @Watch('currentSelectMonth')
  private selectMonthChanged(): void {
    this.afterDate = moment(this.beginDate).add(this.currentSelectMonth, 'months').format('YYYY-MM-DD')
  }
  private judgStartTime() {
    return this.echartsType === 'Release' ? this.startTimeRelease : this.startTimeSubscribe
  }
  private judgEndTime() {
    return this.echartsType === 'Release' ? this.endTimeRelease : this.endTimeSubscribe
  }
  private judgTopicMsg() {
    return this.echartsType === 'Release' ? this.topicMsgRelease : this.topicMsgSubscribe
  }
  private timeStamp(time: any) {
    const date = time.replace(/-/g, '/')
    const timestamp = new Date(date).getTime()
    return timestamp
  }
  private dataStructure(msg: any) {
    const res: Array<any> = []
    const keys: Array<any> = []
    if (msg.length === 0) {
      return
    }
    msg.forEach((element: any, index: number) => {
      let startTime = 0
      let endTime = 0
      let count = 0
      const key: any = Object.keys(element)
      keys.push(key)
      element[key].forEach((item: any, index2: any) => {
        if (!startTime || !endTime) {
          if (!element[key][index2 + 1]) {
            const s = this.timeStamp(item.time)
            const e = this.timeStamp(item.time) + 12 * 60 * 60 * 1000
            const c = parseInt(item.count)
            res.push({
              name: key[0],
              value: [index, s, e, c],
              itemStyle: {
                normal: {
                  color: this.colorArr[index % 2]
                }
              }
            })
          } else {
            if (this.timeStamp(item.time) + 24 * 60 * 60 * 1000 !== this.timeStamp(element[key][index2 + 1]['time'])) {
              const s = this.timeStamp(item.time)
              const e = this.timeStamp(item.time) + 12 * 60 * 60 * 1000
              const c = parseInt(item.count)
              res.push({
                name: key[0],
                value: [index, s, e, c],
                itemStyle: {
                  normal: {
                    color: this.colorArr[index % 2]
                  }
                }
              })
            } else {
              startTime = this.timeStamp(item.time)
              count = parseInt(item.count)
              endTime = this.timeStamp(item.time)
            }
          }
        } else {
          endTime = this.timeStamp(item.time)
          count += parseInt(item.count)
          if (
            !element[key][index2 + 1] ||
            endTime + 24 * 60 * 60 * 1000 !== this.timeStamp(element[key][index2 + 1]['time'])
          ) {
            res.push({
              name: key[0],
              value: [index, startTime, endTime, count],
              itemStyle: {
                normal: {
                  color: this.colorArr[index % 2]
                }
              }
            })
            startTime = 0
            endTime = 0
            0
          }
        }
      })
    })
    return { res, keys }
  }
  private renderItem(params: any, api: any) {
    var categoryIndex = api.value(0)
    var start = api.coord([api.value(1), categoryIndex])
    var end = api.coord([api.value(2), categoryIndex])
    var height = api.size([0, 1])[1] * 0.6
    var rectShape = this.h_echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      }
    )

    return (
      rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
      }
    )
  }
  private getSystemName() {
    let returnText = ''
    this.systemItems.forEach((obj: any) => {
      if (obj.value === this.systemValue) {
        returnText = obj.text
      }
    })
    return returnText
  }
  private yAxisShow(topicMsg: any) {
    const length = topicMsg.keys.length
    if (topicMsg.keys.length <= 0 || topicMsg.keys.length < 10) {
      for (let i = 0; i < 10 - length; i++) {
        topicMsg.keys.push('')
      }
    } else if (topicMsg.keys.length > 10) {
      topicMsg.keys.splice(-1, length - 10)
    }
    return topicMsg.keys
  }
  private draw() {
    const options = {
      tooltip: {
        formatter: (name: any) => {
          //   const startTime = name.data.value[1]
          //   const endTime = name.data.value[2]
          const count = name.data.value[3]
          const topicName = name.data.name
          return (
            this.beginDate +
            '至' +
            this.afterDate +
            '<br />' +
            '主题' +
            topicName +
            (this.echartsType === 'Release' ? '共计发出' + count + '条数据' : '共计' + count + '个订阅量')
          )
        }
      },
      title: {
        text:
          this.beginDate +
          '至' +
          this.afterDate +
          '时间内' +
          this.getSystemName() +
          (this.echartsType === 'Release' ? '系统主题消息发布情况' : '系统主题订阅情况'),
        left: 'center',
        textStyle: {
          color: '#606266'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 320,
          height: 7,
          borderColor: 'transparent',
          backgroundColor: '#CBD1DA',
          handleIcon:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARVBMVEX////R0dvN0tvL0tvL0dvM0trO2OLM09vL0dvO0dvL0trM09zM0tvM0tvL0drU2eHp6+/3+Pn9/f7N09vq7PD////y9PaQXLgBAAAADnRSTlMAHGu22fMam/xO8m79/nbCHu4AAAABYktHRACIBR1IAAAAB3RJTUUH4wcSEhgvIlxSlgAAAJtJREFUKM91kusShCAIhfGeZaamvf+jLpS7qzPx/WDGcxQQBXgQUmljtJICRqxbYmdx9q/7NQ6s/qtvIU6Ere/faXWkXEpOx+3cZyzlOWvr1JOyUR1H+tV+XOQ47JP6qW2gUm8CJOVvE1RHgsKYZiOhpEBjzLORUdJgMJbZKCgZ3mBTscXZdtkLsiPhhwg+vI+dfyj+afnP8PZ9PjqGHTJG9o2tAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTE4VDEwOjI0OjQ3KzA4OjAwIkgiHgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0xOFQxMDoyNDo0NyswODowMFMVmqIAAAAASUVORK5CYII=',
          handleSize: 20,
          labelFormatter: ''
        },
        {
          type: 'inside',
          filterMode: 'weakFilter'
        }
      ],
      grid: {
        top: 30,
        height: 250,
        width: '70%',
        left: '20%'
      },
      xAxis: {
        type: 'time',
        min: this.judgStartTime(),
        max: this.judgEndTime(),
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#474747'
        },
        axisLine: {
          lineStyle: {
            color: '#06AA77'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: this.yAxisShow(this.judgTopicMsg()),
        axisLabel: {
          textStyle: {
            color: (value: any, index: any) => {
              return this.colorArr[index % 2]
            }
          }
        },
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#06AA77'
          }
        },
        splitArea: {
          show: true
        }
      },
      series: [
        {
          type: 'custom',
          renderItem: this.renderItem,
          itemStyle: {
            normal: {
              opacity: 0.8
            }
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: this.judgTopicMsg().res
        }
      ]
    }
    if (options && typeof options === 'object') {
      this.echartsType === 'Release'
        ? this.myChartRelease.setOption(options, true)
        : this.myChartSubscribe.setOption(options, true)
    }
  }

  // 生成数据
  private async getTopicList() {
    // 获得 this.afterDate的值
    await this.$nextTick()
    // 判断系统和是时间都有值的情况下
    if (this.systemValue === '' || this.beginDate === '' || this.afterDate === '') {
      return
    }
    if (this.echartsType === 'Release') {
      const Release = document.getElementById('canvasPackRelease')
      this.myChartRelease = this.h_echarts.init(Release)
    } else {
      const Subscribe = document.getElementById('canvasPackSubscribe')
      this.myChartSubscribe = this.h_echarts.init(Subscribe)
    }
    this.getRelease(
      {
        startTime: this.beginDate,
        endTime: this.afterDate,
        systemId: this.systemValue,
        dataType: this.echartsType === 'Release' ? 0 : 2,
        pageNum: this.releasePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.showEchartsBox = true
        this.startTimeRelease = this.beginDate
        this.startTimeSubscribe = this.beginDate
        this.endTimeRelease = this.afterDate
        this.endTimeSubscribe = this.afterDate
        if (result.data.list && result.data.list.length) {
          this.haveData = true
          this.echartsType === 'Release'
            ? (this.topicMsgRelease = this.dataStructure(result.data.list))
            : (this.topicMsgSubscribe = this.dataStructure(result.data.list))
          // 根据请求的数据 生成下拉菜单
          this.topicListNumber = Math.ceil(result.data.total / 10) || 1
          this.pageList = []
          for (let j = 0; j < this.topicListNumber; j++) {
            this.pageList.push({
              text: `第${j * 10 + 1}条至第${(j + 1) * 10}条`,
              value: j + 1
            })
          }
          this.draw()
        } else {
          this.haveData = false
        }
      }
    )
  }

  // 发布主题
  private issueTopic() {
    this.echartsType = 'Release'
    this.getTopicList()
    this.topicListNumber = 1
    this.releasePageNum = 1
  }
  // 订阅主题
  private subscriptionTopic() {
    this.echartsType = 'Subscribe'
    this.getTopicList()
    this.topicListNumber = 1
    this.releasePageNum = 1
  }

  // 获取主题
  private async getRelease(params: any, callback: Function) {
    const result: returnDataType = await this.h_request['httpGET']('GET_STATISTICS_STAT_TOPIC_DATA', params)
    callback(result)
  }
  // 处理系统主题占比
  private genData(data: Array<any>) {
    const legendData: any = []
    const selected: any = {}
    const seriesData: any = []
    data.forEach(element => {
      legendData.push(element.SystemName)
      selected[element.SystemName] = true
      seriesData.push({ name: element.SystemName, value: element.count })
    })
    return {
      legendData,
      selected,
      seriesData
    }
  }
  private painting({ legendData, selected, seriesData }: any) {
    const options = {
      title: {
        text: '系统主题占比情况',
        x: 'center',
        textStyle: {
          color: '#606266'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '系统{b} <br/>主题数量{c}[占比：{d}%]'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: legendData,
        selected: selected
      },
      series: [
        {
          name: '姓名',
          type: 'pie',
          radius: '75%',
          center: ['50%', '55%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '系统{b}-主题数量{c}[占比：{d}%]'
          }
        }
      ]
    }
    if (options && typeof options === 'object') {
      this.echartsProport.setOption(options, true)
    }
  }
  private async getData() {
    const doc = document.getElementById('canvasPackProportion')
    this.echartsProport = this.h_echarts.init(doc)
    const { data }: returnDataType = await this.h_request['httpGET']('GET_STATISTICS_STAT_SYS_TOPIC', {})
    // 判断是否显示
    if (data.length > 0) {
      this.noMsg = true
      this.painting(this.genData(data))
    } else {
      this.noMsg = false
    }
  }
  private async getSystemItems(params: any, callback: Function) {
    const result: returnDataType = await this.h_request['httpGET']('GET_SYSTEM_GETSYSTEMINFO', params)
    callback(result)
  }
  // 获取系统占比数据
  async mounted(): Promise<void> {
    this.getSystemItems({}, (result: returnDataType) => {
      this.systemItems = []
      result.data.forEach((currentItem: any) => {
        this.systemItems.push({
          text: currentItem.name,
          value: currentItem.id
        })
      })
    })
  }
}
</script>
<style lang="scss">
#canvasPackProportion {
  width: 500px;
  margin: 0 auto;
  height: 340px;
  background: #fff;
}
.echartsBox {
  padding-top: 20px;
  width: 800px;
  height: 400px;
  margin: 0 auto;
}
.showChart {
  padding-top: 20px;
}
.chartContent {
  margin: 0;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  .tabContent {
    height: 400px;
    padding: 10px;
  }
  .before-btn,
  .after-btn {
    width: 15%;
    float: left;
    img {
      width: 70px;
      display: block;
      margin: 170px auto;
      cursor: pointer;
      transition: all 0.5s;
      opacity: 0.4;
    }
    img:hover {
      opacity: 1;
    }
  }
  .noMsg {
    text-align: center;
    position: relative;
    height: 400px;
    padding-top: 100px;
    font-size: 18px;
    color: #666;
    .bg-box {
      position: absolute;
      left: 0;
      bottom: 80px;

      width: 100%;
      img {
        width: 560px;
        display: block;
        margin: 0 auto;
      }
    }
  }
  .nodata-box {
    width: 100%;
    .bg-box {
      position: absolute;
      left: 0;
      bottom: 80px;
      width: 100%;
    }
    p {
      line-height: 220px;
      font-size: 18px;
      color: #666;
      text-align: center;
    }
    img {
      width: 560px;
      display: block;
      margin: 0 auto;
    }
  }
  .chart-box {
    width: 70%;
    float: left;
    text-align: center;
    position: relative;
    height: 400px;
    .bg-box {
      position: absolute;
      left: 0;
      bottom: 80px;
      width: 100%;
    }
    p {
      line-height: 220px;
      font-size: 18px;
      color: #666;
    }
    img {
      width: 560px;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
