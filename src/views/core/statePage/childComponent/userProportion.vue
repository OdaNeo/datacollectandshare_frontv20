<template>
  <div class="viewBox rightTopView" ref="rightTopView">
    <!-- <div
    class="viewBox animated rightTopView"
    :class="`${fristFlag ? 'bounceInDown' : ''} ${enterFlag ? 'enter' : ''}`"
    @mouseenter="mouseEnterMethod()"
    @mouseleave="mouseLeaveMethod()"
    ref="rightTopView"
  > -->
    <v-overlay :absolute="true" :value="userOverlay">
      <v-progress-circular indeterminate size="60">加载中</v-progress-circular>
    </v-overlay>
    <p>用户占比</p>
    <div id="rightTopView">
      <div id="userRoolProportion" :style="{ width: '180px', height: '180px' }"></div>
      <div id="userSystemProportion" :style="{ width: '180px', height: '180px' }"></div>
      <div id="userStateProportion" :style="{ width: '180px', height: '180px' }"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import { userProportion, topicRankingInfo } from '@/type/welcome.type'
import { userInfo } from '@/type/user.type'
import echarts from '@/decorator/echarsDecorator'
import Enum from '@/decorator/enumDecorator'

@Component
@echarts
@http
@Enum([
  {
    tsFileName: 'user-enum',
    enumName: 'userState'
  }
])
export default class UserProportion extends Vue {
  // private fristFlag = true
  // private enterFlag = false
  private userOverlay = false

  // private mouseEnterMethod(): void {
  //   if (!this.fristFlag) {
  //     this.enterFlag = true
  //   }
  // }

  // private mouseLeaveMethod(): void {
  //   this.enterFlag = false
  // }

  private getUserProportionList(data: topicRankingInfo, str: string): Array<userProportion> {
    const roolList: Array<userProportion> = []
    data.list.forEach((element: userInfo) => {
      const flag = roolList.find((item: userProportion) => {
        return item.name === (str === 'userState' ? this.h_enum.userState[element[str]] : element[str])
      })
      if (flag) {
        flag.value += 1
      } else {
        roolList.push({
          name: str === 'userState' ? this.h_enum.userState[element[str]] : element[str],
          value: 1
        })
      }
    })
    return roolList
  }

  private userProportion(elementName: string, msgList: Array<userProportion>, title: string): void {
    const element = document.getElementById(elementName)
    const chartElement = this.h_echars.init(element as HTMLCanvasElement)
    chartElement.setOption({
      color: ['#d34e58', '#f49d13', '#f6d748', '#45dbf6', '#44aff0', '#4877f4', '#4f46f6', '#ad45f4', '#f845f1'],
      tooltip: {
        trigger: 'item',
        formatter: '{b}({d}%)'
      },
      series: [
        {
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          type: 'pie',
          label: {
            show: false
          },
          data: msgList
        },
        {
          radius: ['0%', '30%'],
          center: ['50%', '50%'],
          type: 'pie',
          labelLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          label: {
            normal: {
              position: 'center',
              formatter: '{center|' + title + '}',
              rich: {
                center: {
                  fontSize: 12,
                  color: '#fff'
                }
              }
            }
          },
          animation: false,
          tooltip: {
            show: false
          },
          data: [
            {
              value: 1,
              itemStyle: {
                color: '#1291ff'
              }
            }
          ]
        }
      ]
    })
  }

  async mounted(): Promise<void> {
    this.userOverlay = true
    const { data }: returnDataType = await this.h_request.httpGET('GET_USER_FIND_ALL_USER', {
      pageSize: 100,
      pageNum: 1
    })
    this.userOverlay = false
    this.$nextTick(() => {
      this.userProportion('userRoolProportion', this.getUserProportionList(data, 'phone'), '角色占比')
      this.userProportion('userSystemProportion', this.getUserProportionList(data, 'systemName'), '系统占比')
      this.userProportion('userStateProportion', this.getUserProportionList(data, 'userState'), '状态占比')
    })
    // const el = this.$refs.rightTopView as HTMLElement
    // el.addEventListener('animationend', () => {
    //   if (this.fristFlag) {
    //     this.fristFlag = false
    //   }
    // })
  }
}
</script>

<style lang="stylus" scoped>
.rightTopView
    #rightTopView
        display: flex
        align-items:center
        justify-content:space-around
        margin-top:-10px

    p
        color:#FFF
        text-align:center
        margin-top:10px
        margin-bottom:0px
</style>
