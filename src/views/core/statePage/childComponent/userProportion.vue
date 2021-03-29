<template>
  <div class="viewBox rightTopView" ref="rightTopView">
    <HOverLay :loading="loading" />
    <p v-if="!loading">用户占比</p>
    <div v-if="!loading" id="rightTopView">
      <div id="userRoolProportion" :style="{ width: '175px', height: '175px' }"></div>
      <div id="userSystemProportion" :style="{ width: '175px', height: '175px' }"></div>
      <div id="userStateProportion" :style="{ width: '175px', height: '175px' }"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnType } from '@/type/http-request.type'
import { userProportion, topicRankingInfo } from '@/type/welcome.type'
import { userInfo } from '@/type/user.type'
import echarts from '@/decorator/echartsDecorator'
import Enum from '@/decorator/enumDecorator'
import HOverLay from '@/components/h-overlay.vue'

@Component({
  components: {
    HOverLay
  }
})
@echarts
@http
@Enum([
  {
    tsFileName: 'user-enum',
    enumName: 'userState'
  }
])
export default class UserProportion extends Vue {
  private loading = true

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
    const chartElement = this.h_echarts.init(element as HTMLCanvasElement)
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
    this.loading = true
    const { data }: returnType = await this.h_request.httpGET('GET_USER_FIND_ALL_USER', {
      pageSize: 100,
      pageNum: 1
    })
    this.loading = false
    if (data) {
      this.$nextTick(() => {
        this.userProportion('userRoolProportion', this.getUserProportionList(data, 'phone'), '角色占比')
        this.userProportion('userSystemProportion', this.getUserProportionList(data, 'systemName'), '系统占比')
        this.userProportion('userStateProportion', this.getUserProportionList(data, 'userState'), '状态占比')
      })
    }
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
.rightTopView
    #rightTopView
        display: flex
        align-items:center
        justify-content:space-around
        margin-top:-10px

    p
        color:#000
        text-align:center
        margin-top:10px
        margin-bottom:0px
</style>
