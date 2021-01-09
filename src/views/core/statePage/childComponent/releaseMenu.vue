<template>
  <div
    class="viewBox leftBtmView animated"
    :class="`${firstFlag ? 'bounceInUp' : ''} ${enterFlag ? 'enter' : ''}`"
    style="animation-duration: 2s; animation-delay: 1s"
    @mouseenter="mouseEnterMethod"
    @mouseleave="mouseLeaveMethod"
    ref="leftBtmView"
  >
    <v-overlay :absolute="true" :value="releaseOverlay">
      <v-progress-circular indeterminate size="60">加载中</v-progress-circular>
    </v-overlay>
    <div style="width: 100%; height: 8%; padding-top: 10px">
      <p>{{ `${releaseStartTime}至${releaseEndTime}主题${releaseSystemName}发布情况` }}</p>
      <div class="iconCon">
        <v-menu offset-y max-height="200" min-width="130" transition="slide-x-transition">
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn color="primary" dark icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-icon color="#FFF">mdi-shield-lock</v-icon>
                </v-btn>
              </template>
              <span>系统名称选项</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in systemItems" :key="index" @click="selectReleaseSystem(item)">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y max-height="200" min-width="130" transition="slide-x-transition">
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn color="primary" dark icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-icon color="#FFF">mdi-shield-lock</v-icon>
                </v-btn>
              </template>
              <span>分页选项</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item v-for="num in parseInt(releaseTotal / 10) + 1" :key="num" @click="selectReleasePage(num)">
              <v-list-item-title>{{
                `${(num - 1) * 10 + 1}~${num * 10 > releaseTotal ? releaseTotal : num * 10}`
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          v-model="releaseTime"
          :close-on-content-click="false"
          :return-value.sync="releaseDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn color="primary" dark icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-icon color="#FFF">mdi-shield-lock</v-icon>
                </v-btn>
              </template>
              <span>时间选项</span>
            </v-tooltip>
          </template>
          <v-date-picker v-model="releaseDate" :allowed-dates="releaseAllowedDates" no-title scrollable locale="zh-cn">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="releaseTime = false">取消</v-btn>
            <v-btn text color="primary" @click="selectReleaseTime">确定</v-btn>
          </v-date-picker>
        </v-menu>
      </div>
    </div>
    <div id="release" style="height: 91%" v-if="releaseTopicExist"></div>
    <div v-else>
      <p style="margin-top: 150px">{{
        `主题${releaseSystemName}在${releaseStartTime}至${releaseEndTime}没有发布主题`
      }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import Moment from 'moment'
import Welcome from '../welcome.vue'
import util from '@/decorator/utilsDecorator'

@Component
@http
@util
export default class ReleaseMenu extends Vue {
  @Prop() private systemItems!: unknown[]
  private firstFlag = true
  private enterFlag = false
  private releaseOverlay = false
  private releaseTopicExist = true
  private releaseStartTime: string = Moment(Moment().subtract(11, 'months').calendar(), 'MM-DD-YYYY').format(
    'YYYY-MM-DD'
  )
  private releaseEndTime: string = Moment().format('YYYY-MM-DD')
  private releasePageNum = 1
  private releaseSystemId = 1
  private releaseSystemName = 'ATS'
  private releaseTotal = 0
  private releaseDate: string = new Date().toISOString().substr(0, 10)
  private releaseTime = false

  // eslint-disable-next-line @typescript-eslint/ban-types
  private async getRelease(params: unknown, callback: Function) {
    const result: returnDataType = await this.h_request.httpGET('GET_STATISTICS_STAT_TOPIC_DATA', params)
    callback(result)
  }

  private mouseEnterMethod(): void {
    if (!this.firstFlag) {
      this.enterFlag = true
    }
  }

  private mouseLeaveMethod(): void {
    this.enterFlag = false
  }

  private selectReleaseSystem(system: { name: string; id: number }) {
    this.releaseSystemName = system.name
    this.releaseSystemId = system.id
    this.releaseOverlay = true
    this.getRelease(
      {
        startTime: this.releaseStartTime,
        endTime: this.releaseEndTime,
        systemId: this.releaseSystemId,
        dataType: 0,
        pageNum: this.releasePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.releaseOverlay = false
        if (result.data.list.length > 0) {
          this.drawRelease(result)
        } else {
          this.releaseTopicExist = false
        }
      }
    )
  }

  private selectReleasePage(pageNum: number) {
    this.releasePageNum = pageNum
    this.releaseOverlay = true
    this.getRelease(
      {
        startTime: this.releaseStartTime,
        endTime: this.releaseEndTime,
        systemId: this.releaseSystemId,
        dataType: 0,
        pageNum: this.releasePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.releaseOverlay = false
        if (result.data.list.length > 0) {
          this.drawRelease(result)
        } else {
          this.releaseTopicExist = false
        }
      }
    )
  }

  private selectReleaseTime() {
    this.releaseTime = false
    this.releaseStartTime = Moment(this.releaseDate).subtract(11, 'months').format('YYYY-MM-DD')
    this.releaseEndTime = this.releaseDate
    this.releaseOverlay = true
    this.getRelease(
      {
        startTime: this.releaseStartTime,
        endTime: this.releaseEndTime,
        systemId: this.releaseSystemId,
        dataType: 0,
        pageNum: this.releasePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.releaseOverlay = false
        if (result.data.list.length > 0) {
          this.drawRelease(result)
        } else {
          this.releaseTopicExist = false
        }
      }
    )
  }

  private releaseAllowedDates(time: string) {
    const timeStamp = this.h_utils.timeutil.timeToStamp(time, '-')
    const nowStamp = this.h_utils.timeutil.timeToStamp(Moment().format('YYYY-MM-DD'), '-')
    return timeStamp <= nowStamp
  }

  private drawRelease({ data }: returnDataType) {
    this.releaseTopicExist = true
    this.releaseTotal = data.total
    const parent = this.$parent as Welcome
    parent.topicRanking('release', data, this.releaseEndTime)
  }

  mounted(): void {
    this.releaseOverlay = true
    this.getRelease(
      {
        startTime: this.releaseStartTime,
        endTime: this.releaseEndTime,
        systemId: this.releaseSystemId,
        dataType: 0,
        pageNum: this.releasePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.releaseOverlay = false
        this.drawRelease(result)
        const el = this.$refs.leftBtmView as HTMLElement
        el.addEventListener('animationend', () => {
          if (this.firstFlag) {
            this.firstFlag = false
          }
        })
      }
    )
  }
}
</script>
<style lang="stylus" scoped>
.iconCon
    position:absolute
    right:0
    top:5px
    width:20%
    display:flex
    z-index:999
.leftBtmView
    p
        text-align: center
        color:#FFF
        margin-bottom:0px
</style>
