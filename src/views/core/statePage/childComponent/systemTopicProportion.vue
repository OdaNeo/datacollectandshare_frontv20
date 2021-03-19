<template>
  <div class="viewBox leftTopView" ref="leftTopView">
    <p>系统主题占比</p>
    <div id="leftTopView">
      <div class="view-box-con" ref="viewBoxCon">
        <div>
          <div id="topicTotal" style="width: 150px; height: 150px"></div>
        </div>
        <div v-for="(topicMsg, index) in topicMsgList" :key="index">
          <div class="systemTotalNum" :style="'background:' + colors[index]">
            <p>{{ topicMsg.count }}</p>
            <span>系统{{ topicMsg.SystemName }}主题数量</span>
          </div>
          <div :id="topicMsg.SystemName + 'Total'" class="systemTotal" style="width: 150px; height: 150px"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { topicMsg, topicProportionOpt } from '@/type/welcome.type'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import echarts from '@/decorator/echartsDecorator'
import BScroll from '@better-scroll/core'

@Component
@echarts
@http
export default class SystemTopicProportion extends Vue {
  private systemOverlay = false
  private topicMsgList: Array<topicMsg> = []
  private colors: Array<string> = ['#884046', '#8a7e4e', '#749f83', '#a8d8ea']

  private topicProportion(elementName: string, opt: topicProportionOpt): void {
    const element = document.getElementById(elementName)
    const chartElement = this.h_echarts.init(element as HTMLCanvasElement, 'light', { renderer: 'svg' })
    chartElement.setOption(
      {
        title: {
          text: opt.text,
          textStyle: {
            fontSize: 16,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: '#FFF',
            rich: {
              a: {
                fontSize: 16
              }
            }
          },
          x: 'center',
          y: '35%'
        },
        graphic: [
          {
            type: 'group',
            left: 'center',
            top: '60%',
            children: [
              {
                type: 'text',
                z: 100,
                left: '10',
                top: 'middle',
                style: {
                  fill: '#fff',
                  text: opt.subtext,
                  font: '12px Microsoft YaHei'
                }
              }
            ]
          }
        ],
        series: [
          {
            type: 'liquidFill',
            radius: '80%',
            center: ['50%', '50%'],
            data: [opt.proportion, opt.proportion, opt.proportion],
            backgroundStyle: {
              borderWidth: 2,
              borderColor: '#1789fb',
              color: '#1c233f'
            },
            outline: {
              borderDistance: 1,
              itemStyle: {
                borderWidth: 3,
                borderColor: {
                  type: 'linear',
                  x: 1,
                  y: 0,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(212, 252, 125, 1)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(2, 193, 131, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(2, 193, 131, 1)'
                    }
                  ],
                  globalCoord: false
                },
                shadowBlur: 10,
                shadowColor: 'rgba(13, 13, 46, 1)'
              }
            },
            color: [opt.color],
            label: {
              normal: {
                formatter: ''
              }
            }
          }
        ]
      },
      true
    )
  }

  private initScroll(): void {
    this.$nextTick(() => {
      new BScroll('#leftTopView', {
        startX: 0,
        scrollX: true,
        scrollY: false,
        click: true
      })
    })
  }

  async mounted(): Promise<void> {
    this.systemOverlay = true
    const { data }: returnDataType = await this.h_request.httpGET('GET_STATISTICS_STAT_SYS_TOPIC', {})
    this.systemOverlay = false
    this.topicMsgList = data
    const { count: countTotal }: topicMsg = this.topicMsgList.reduce(
      ({ count: prevcount }: topicMsg, { count: nextcount }: topicMsg) => {
        return { count: prevcount + nextcount, SystemName: '' }
      }
    )
    this.$nextTick(() => {
      this.topicMsgList.forEach(({ count, SystemName }: topicMsg, index: number) => {
        this.topicProportion(SystemName + 'Total', {
          text: ((count / countTotal) * 100).toFixed(2) + '%',
          subtext: `系统${SystemName}主题占比`,
          proportion: (count / countTotal).toFixed(4),
          color: this.colors[index]
        })
      })
      this.topicProportion('topicTotal', {
        text: countTotal + '',
        subtext: '主题数据总数',
        proportion: '1',
        color: '#195ba6'
      })
    })

    this.initScroll()
  }
}
</script>
<style lang="stylus" scoped>
.viewBox
    width:49%
    height:100%
    background:#fff
    box-shadow: 2px 6px 15px 0 rgba(69,65,78,.1)
    border-radius: 5px
    position: relative
.leftTopView
    overflow-y: hidden
    overflow-x: scroll
    white-space: nowrap
    p
        text-align: center
        color:#000
        margin-top:10px
        margin-bottom:0px
    .view-box-con
        display: inline-flex
        align-items: center
        justify-content: space-around
        div
            width:150px
            height: 150px
            position:relative
            &:hover
                .systemTotal
                    transform:rotateY(-180deg)
            &:hover
                .systemTotalNum
                    transform:rotateY(0deg)
            .systemTotal
                width:150px
                height:150px
                position: absolute
                top:0
                left:0
                right:0
                bottom:0
                margin:auto
                transform-style: preserve-3d
                backface-visibility:hidden
                transition:all 1s
                transform:rotateY(0)
            .systemTotalNum
                width:120px
                height:120px
                position: absolute
                top:0
                left:0
                right:0
                bottom:0
                margin:auto
                border-radius:50% 50%
                border:2px solid rgb(23,137,251)
                // z-index:999
                color:#000
                text-align:center
                transform-style: preserve-3d
                backface-visibility:hidden
                transition:all 1s
                transform:rotateY(-180deg)
                p
                    font-size:14px
                    margin-top:35px
                    margin-bottom:7px
                span
                    font-size:12px
</style>
