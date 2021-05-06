<template>
  <div id="LogDataStatistics">
    <!-- tab -->
    <v-tabs v-model="tab" @change="tabChange">
      <v-tab>日志主题占比</v-tab>
      <v-tab>日志主题查询</v-tab>
    </v-tabs>
    <!-- 切换 -->
    <v-tabs-items v-model="tab">
      <v-tab-item eager style="display:flex;height:100%;overflow:hidden;height:570px">
        <v-row class="echartsLeft">
          <div id="eCharts3"></div>
        </v-row>
        <!-- 默认日历表 -->
        <v-row class="eChartsRight">
          <div id="eCharts4"></div>
          <div id="followListContainer">
            <v-row>
            <HSearch :cols="7" v-model="followTopicName" label="添加关注主题名称" :showAppEnd="false" style="margin-left:30px"/>
            <v-col>
              <v-btn color="primary" small depressed dark @click="follow()">关注</v-btn>
            </v-col>
            </v-row>
            <v-list class="followTopicList">
              <v-list-item v-for="(item,index) in followList" :key="index">
                  <template v-slot:default="{ }">
                    <v-list-item-action>
                      <v-checkbox
                        v-model="item.flag"
                        color="primary"
                        @change="changeCheckBox(item)"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content style="color:rgb(0,160,233)">{{item.name}}</v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                        small
                        text
                        color="warning"
                        @click="cancelFollow(item,index)"
                      >取消关注</v-btn>
                    </v-list-item-action>
                  </template>
              </v-list-item>
            </v-list>
          </div>
        </v-row>
      </v-tab-item>
      <v-tab-item eager>
        <v-row class="ml-2" style="padding-top:10px;padding-left:10px">
          <!-- 搜索框 主题ID-->
          <HSearch :cols="3" :showAppEnd="false" v-model="queryTopicID" label="日志主题ID" v-only-num />
          <!-- 搜索框 日期 -->
          <v-col cols="3">
            <v-menu
              ref="menu"
              v-model="showMenu"
              :close-on-content-click="false"
              :return-value.sync="queryTopicDate"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  height="35px"
                  v-model="queryTopicDate"
                  label="截止日期"
                  readonly
                  clearable
                  :clear-icon="mdiCloseCircleOutline"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="zh-cn"
                v-model="queryTopicDate"
                @click.native="$refs.menu.save(queryTopicDate)"
                @change="getOption1(123)"
                no-title
                scrollable
              >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-btn color="primary" small depressed dark @click="searchMethod">开始查询</v-btn>
          </v-col>
        </v-row>
        <!-- 默认日历表 -->
        <div id="eCharts1"></div>
        <!-- eChartsDataDom -->
        <div id="eCharts2"></div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import HSearch from '@/components/h-search.vue'
import echarts from '@/decorator/echartsDecorator'
import util from '@/decorator/utilsDecorator'
import { mdiCloseCircleOutline } from '@mdi/js'
import Moment from 'moment'
import HTabs from '@/components/h-tabs.vue'
@Component({
  components: {
    HSearch,
    HTabs
  }
})
@http
@echarts
@util
export default class LogDataStatistics extends Vue {
  private mdiCloseCircleOutline = mdiCloseCircleOutline

  private myChartElement1: any = null
  private myChartElement2: any = null
  private myChartElement3: any = null
  private myChartElement4: any = null
  // tab
  private tab = 0
  //private items = ['日志主题占比', '日志主题查询']

  // 默认显示我的主题中的第一条
  // 默认显示当天
  private queryEndDate = Moment(new Date()).format(`YYYY-MM-DD`)
  private queryTopicID = '' // 查询主题ID input框内容
  private queryTopicDate = this.queryEndDate

  private showMenu = false
  private followList:any[] = []
  private followTopicName = "" 

  private data3 = [
    {name:"abc01000000",topicId:900300,value:100},
    {name:"abc02000000",topicId:900300,value:200},
    {name:"abc03000000",topicId:900300,value:300},
    {name:"abc04000000",topicId:900300,value:400},
    {name:"abc05000000",topicId:900300,value:500},
    {name:"abc06000000",topicId:900300,value:600},
    {name:"abc07000000",topicId:900300,value:700},
    {name:"abc08000000",topicId:900300,value:800},
    {name:"abc09000000",topicId:900300,value:900},
    {name:"abc10000000",topicId:900300,value:1000}
  ]

  // 获得30天数据并生成option1
  private async getStatisticsLoggerTopicByTopicIdAnd30Days(params: { topicId: number; timeDate: string }) {
    const { data }: { data: { date: string; count: number }[] } = await this.h_request['httpGET'](
      'GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAYAND30DAYS',
      params
    )
    // console.log(data)
    // const data = [
    //   { date: '2021-4-23', count: 27 },
    //   { date: '2021-4-9', count: 5 },
    //   { date: '2021-4-12', count: 12 }
    // ]

    if (data) {
      const _data = data.map(item => [item.date, item.count] as const).sort((prev, next) => next[1] - prev[1])
      this.myChartElement1.setOption(this.getOption1(_data), true)
    }
  }


  private follow(){
    this.data3.shift()
    this.data3.push({
      name:this.followTopicName,topicId:900300,value:1100
    })
    this.followList.push({
      name:this.followTopicName,topicId:900300,value:1100,flag:true
    })
    this.myChartElement3.setOption(this.getOption3(), true)
    this.myChartElement4.setOption(this.getOption4(), true)
    this.followTopicName = ""
  }

  private getOption4(){
    const colorList = ['#FC619D', '#FF904D', '#48BFE3', '#00a0e9', '#8957a1', '#80f1b0', '#ff6692', '#f29b76','#ff6692', '#f29b76'];
    let areaValueData = [15, 20, 30, 40, 50, 65,15, 20, 30, 40]
    return{
      title:{
        text:"主题数据占比",
        x:'center',
        y:5,
        textStyle: {
            color: '#3A7BD5',
            fontSize: 16
        }
      },
      tooltip: {},
      // tooltip: {
      //   trigger: 'item',
      //   borderColor: 'rgba(255,255,255,.3)',
      //   backgroundColor: 'rgba(13,5,30,.6)',
      //   borderWidth: 1,
      //   padding: 5,
      //   formatter: function(parms:any) {
      //       var str = parms.marker + "" + parms.data.name + "</br>" +
      //           "日志数据量：" + parms.data.value + "条</br>" +
      //           "数据占比：" + parms.percent + "%";
      //       return str;
      //   }
      // },
      radar: {
        zlevel: 11,
        shape: 'circle',
        scale: true,
        indicator: this.data3,
        center: ['50%', '50%'],
        radius: '40%',
        startAngle: 30,
        name: {
            show: true,
            color: 'transparent'
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(32,126,255, .5)',
                // opacity: 0.2
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(32,126,255, .5)'
            }
        },
        splitArea: {
            areaStyle: {
                color: 'rgba(32,126,255, 0.1)',

            }
        }
      },
      polar: {
        radius: '40%',
      },
      angleAxis: {
        zlevel: 0,
        min: 0,
        max: 360,
        interval: 5,
        clockwise: false,
        axisTick: {
            show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      radiusAxis: {
        zlevel: 0,
        axisLabel: {
          textStyle: {
            color: 'rgba(29,208,240,.5)'
          }
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        }
      },
      series: [
        {
          type: 'radar',
          data: [{
            value: [15000, 20000, 30000, 40000, 50000, 65000,15000, 20000, 30000, 40000],
            name: '各主题数据量：',
            areaStyle: {
              normal: {
                color: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(32,126,255, 0.5)' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(32,126,255, 0.1)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          }],
          zlevel: 2,
          z: 4
        },
        {
          type: 'pie',
          startAngle: 0,
          data: this.data3.map(item => {
            return {
              name: item.name,
              value: item.value,
              tooltip:{
                borderColor: 'rgba(255,255,255,.3)',
                backgroundColor: 'rgba(13,5,30,.6)',
                borderWidth: 1,
                padding: 5,
                formatter: function(parms:any) {
                    var str = parms.marker + "" + parms.data.name + "</br>" +
                        "日志数据量：" + parms.data.value + "条</br>" +
                        "数据占比：" + parms.percent + "%";
                    return str;
                }
              }
            }
          }).reverse(),
          radius: ['45%', '60%'],
          zlevel: -1,
          name: '',
          itemStyle: {
            color:function(params:any){
              return colorList[colorList.length-params.dataIndex-1]
            }
          },
          label: {
            show: true,
            backgroundColor: 'auto',
            height: 0,
            width: 0,
            lineHeight: 0,
            distanceToLabelLine: 0,
            borderRadius: 1,
            padding: [1, -1, 1, -1],
            rich: {
              a: {
                padding: [0, 0, 0, 10]
              },
              b: {
                padding: [0, 10, 0, 0]
              }
            },
            normal: {
                position: 'top',
                fontSize: '12'
            }
          }
        }
      ]
    }
  }

  private getOption3(){
    const colorList = ['#FC619D', '#FF904D', '#48BFE3', '#00a0e9', '#8957a1', '#80f1b0', '#ff6692', '#f29b76','#ff6692', '#f29b76'];
    return {
      //标题
      title: {
         text:"主题展示列表",
          x:'center',
          y:5,
          textStyle: {
              color: '#3A7BD5',
              fontSize: 20
          }
      },
      tooltip:{
        trigger:'axis',
        axisPointer:{
          type: 'shadow'
        },
        padding: 0,
        textStyle: {
          fontSize: 16,
          fontFamily: 'Simsun',
          color: '#fff' //弹框文字的颜色
        },
        formatter: function(params:any, ticket:any) {
          var res = '<table class="charts_tip">' +
              '<thead>' +
              '<tr><th colspan="2" style="padding:2px 5px; background:' + params[0].color + '">主题：' + params[0].name + '</th></tr>' +
              '</thead>' +
              '<tbody>' +
              '<tr><td class="cc" style="padding:2px 5px;"></td><td>主题ID：' + params[0].data.topicId + '</td></tr>' +
              '<tr><td class="cc" style="padding:2px 5px;"></td><td>共计生产：' + params[0].data.value + '条数据</td></tr>' +
              '</tbody>' +
              '</table>';
          return res;
        }
      },
      legend: {
        show: false
      },
      toolbox: {
        show: false,
      },
      grid: {
        top: '11%',
        left: '8%',
        right: '10%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: {
        show:true,
        type: 'value',
        min: 0,
        axisTick: {
            show: true // 坐标轴小标记
        },
        splitLine: {
            show: false
        },
        axisLine: {  //设置Y轴颜色和宽度
            lineStyle: {
                color: 'rgb(204, 204, 204)',
                width: 1
            }
        },
        axisLabel: {
            textStyle: {
                color: 'rgb(204, 204, 204)',
                fontSize: 14
            }
        },
      },
      yAxis: {
        type: 'category',
        position: 'left',
        axisLabel: {
            textStyle: {
                color: function(value:any,index:number){
                  return colorList[index]
                },
                fontSize: 14
            }
        },
        axisLine: {  //设置Y轴颜色和宽度
            lineStyle: {
                color: 'rgb(204, 204, 204)',
                width: 1
            }
        },
        axisTick: {
            show: false // 坐标轴小标记
        },
        splitLine: {
            show: true
        },
        data: (function(data) {
            console.log(data)
            var arr:String[] = [];
            data.forEach(function(items:any) {
                arr.push(items.name);
            });
            return arr;
        })(this.data3) // 载入y轴数据
      },
      series: [{
        type: 'bar',
        label: {
            normal: {
                show: true,
                position: 'right', // top, right, inside, insideTop,...
                textStyle: {
                    color: 'rgba(118, 111, 111, 0.55)',
                    fontSize: 16
                },
                formatter: '{c}' + "条"
            }
        },
        barWidth: 27,
        itemStyle: {
            normal: {
                //color:'#ffc938', // 图表颜色
                color: function(params:any) { // 颜色定制显示（按顺序）
                    return colorList[params.dataIndex]
                },
                arBorderRadius: [0, 17, 17, 0]  //圆角
            }
        },
        data: this.data3, // 载入数据(内含自定义参数)
        z: 1
      }]
    }
  }


  private getOption1(data: (readonly [string, number])[]) {
    const START = Moment(Number(Moment(this.queryTopicDate).format('x')) - 30 * 1000 * 60 * 60 * 24).format(
      `YYYY-MM-DD`
    )
    const END = this.queryTopicDate
    const MAX = data[0][1]

    return {
      title: {
        left: 'center',
        text: '30天内日志数目',
        subtext: '点击日期显示日志详情',
        subtextStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: ({ data }: { data: [string, number] }) => {
          return `日期：${data[0]}<br />日志条数：${data[1]}`
        }
      },
      visualMap: {
        min: 0,
        max: Math.ceil(MAX / 5) * 5,
        type: 'piecewise',
        splitNumber: 5,
        orient: 'horizontal',
        left: 'center',
        top: 60,
        textStyle: {
          color: '#000'
        }
      },
      calendar: {
        top: 110,
        left: 180,
        right: 150,
        height: 100,
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
        data: data
      }
    }
  }

  // 获得指定天数据
  private async getStatisticsLoggerTopicByTopicIdAndDay(params: { topicId: number; timeDate: string }) {
    const { data }: { data: { hour: string; count: number }[] } = await this.h_request['httpGET'](
      'GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAY',
      params
    )
    // console.log(data)
    // const data = [
    //   { hour: '2', count: 27 },
    //   { hour: '4', count: 5 },
    //   { hour: '6', count: 12 }
    // ]

    if (data) {
      const _data: number[] = []

      for (let i = 0; i < 24; i++) {
        const _item = data.filter(item => Number(item.hour) === i)
        _data[i] = _item.length > 0 ? _item[0].count : 0
      }

      this.myChartElement2.setOption(this.getOption2(_data, params), true)
    } else {
      // this.h_utils['alertUtil'].open('查询失败', true, 'error')
    }
  }
  // getOption2
  private getOption2(data: number[], params: { topicId: number; timeDate: string }) {
    const xData = data.map((_, index) => {
      return `${index}时`
    })

    return {
      title: {
        left: 'center',
        text: `主题${params.topicId}在${params.timeDate}日志详情`
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: 100,
        right: 100,
        bottom: 5,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          name: '日志条数',
          type: 'line',
          step: 'middle',
          data: data
        }
      ]
    }
  }

  // 查询通用调用方法
  private async searchMethod() {
    if (!this.queryTopicID || !this.queryTopicDate) {
      return
    }
    // 30 天
    this.getStatisticsLoggerTopicByTopicIdAnd30Days({
      topicId: Number(this.queryTopicID),
      timeDate: this.queryTopicDate
    })
    // 当天
    this.getStatisticsLoggerTopicByTopicIdAndDay({
      topicId: Number(this.queryTopicID),
      timeDate: this.queryTopicDate
    })
  }

  // 获取今日日志条数
  private async getStatisticsAllLoggerTopicByDayTime() {
    const { data } = await this.h_request.httpGET('GET_TOPICS_STATISTICSALLLOGGERTOPICBYDAYTIME', {
      dayTime: Moment(new Date()).format(`YYYY-MM-DD`)
    })
    console.log(data)
  }

  // echarts1 2 3 handle
  private initECharts() {
    this.$nextTick(() => {
      const element = document.getElementById('eCharts1')
      const element2 = document.getElementById('eCharts2')
      const element3 = document.getElementById('eCharts3')
      const element4 = document.getElementById('eCharts4')

      this.myChartElement1 = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })
      this.myChartElement2 = this.h_echarts.init(element2 as HTMLCanvasElement, 'light', { renderer: 'svg' })
      this.myChartElement3 = this.h_echarts.init(element3 as HTMLCanvasElement, 'light', { renderer: 'svg' })
      this.myChartElement4 = this.h_echarts.init(element4 as HTMLCanvasElement, 'light', { renderer: 'svg' })

      // 点击获取某天详情
      this.myChartElement1.on('click', (item: { data: [string, number] }) => {
        this.getStatisticsLoggerTopicByTopicIdAndDay({ topicId: Number(this.queryTopicID), timeDate: item.data[0] })
      })
    })
  }

  // tab 切换
  private tabChange(number: number) {
    console.log(number)
  }

  private cancelFollow(item:any,index:number){
    this.followList.splice(index,1)
    this.data3.forEach((obj,index)=>{
        if(item.name==obj.name){
          this.data3.splice(index,1)
        }
    })
    this.myChartElement3.setOption(this.getOption3(), true)
    this.myChartElement4.setOption(this.getOption4(), true)
  }

  private changeCheckBox(item:any){
    if(item.flag==true){
      this.data3.push(item)
    }else{
      this.data3.forEach((obj,index)=>{
        if(item.name==obj.name){
          this.data3.splice(index,1)
        }
      })
    }
    this.myChartElement3.setOption(this.getOption3(), true)
    this.myChartElement4.setOption(this.getOption4(), true)
  }

  mounted(): void {
    // 初始化
    let _this =this
    this.initECharts()
    this.$nextTick(()=>{
      this.myChartElement3.setOption(this.getOption3(), true)
      this.myChartElement4.setOption(this.getOption4(), true)
      this.myChartElement3.on("click",function(params:any){
        console.log(params)
        _this.tab = 1
        _this.queryTopicID = params.data.topicId
      })
    })
  }
}
</script>
<style scoped>
#eCharts1 {
  width: 100%;
  height: 250px;
}
#eCharts2 {
  width: 95%;
  height: 250px;
  margin: 0 auto;
}
#eChartsContainer{
  display: flex;
  flex-wrap:wrap;
  height:470px;
  width:100%;
}
.echartsLeft{
  width:65%;
  border-right:1px solid rgb(204, 204, 204);
}
#eCharts3 {
  width: 100%;
  height: 480px;
  margin-top:20px;
}
.eChartsRight{
  width:35%;
  margin-left:12px;
  margin-right:0px;
  border-top:1px solid rgb(204, 204, 204);
  display: block;
}
#eCharts4{
  width:100%;
  height:50%;
  border-bottom:1px solid rgb(204, 204, 204);
}
#followListContainer{
  width:100%;
  height:220px;
  
  margin-bottom:0;
  padding-top:10px;
}
.followTopicList{
  margin-top:-25px;
  overflow-x:hidden;
  overflow-y: auto;
  height:90%;
}
</style>
