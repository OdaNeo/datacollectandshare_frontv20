<template>
  <!-- <div
    class="viewBox rightBtmView animated"
    style="animation-duration: 2s; animation-delay: 1s"
    :class="`${fristFlag ? 'bounceInRight' : ''} ${enterFlag ? 'enter' : ''}`"
    @mouseenter="mouseEnterMethod()"
    @mouseleave="mouseLeaveMethod()"
    ref="rightBtmView"
  > -->
  <div class="viewBox rightBtmView" ref="rightBtmView">
    <v-overlay :absolute="true" :value="subscribeOverlay">
      <v-progress-circular indeterminate size="60">加载中</v-progress-circular>
    </v-overlay>
    <div style="width: 100%; height: 8%; padding-top: 10px">
      <p>{{ `${subscribeStartTime}至${subscribeEndTime}主题${subscribeSystemName}订阅情况` }}</p>
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
            <v-list-item v-for="(item, index) in systemItems" :key="index" @click="selectSubscribeSystem(item)">
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
            <v-list-item v-for="num in parseInt(subscribeTotal / 10) + 1" :key="num" @click="selectSubscribePage(num)">
              <v-list-item-title>{{
                `${(num - 1) * 10 + 1}~${num * 10 > subscribeTotal ? subscribeTotal : num * 10}`
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          v-model="subscribeTime"
          :close-on-content-click="false"
          :return-value.sync="subscribeDate"
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
          <v-date-picker
            v-model="subscribeDate"
            :allowed-dates="subscribeAllowedDates"
            no-title
            scrollable
            locale="zh-cn"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="subscribeTime = false">取消</v-btn>
            <v-btn text color="primary" @click="selectSubscribeTime">确定</v-btn>
          </v-date-picker>
        </v-menu>
      </div>
    </div>
    <div id="subscribe" style="height: 91%" v-if="subscribeTopicExist"></div>
    <div v-else>
      <p style="margin-top: 150px">
        {{ `主题${subscribeSystemName}在${subscribeStartTime}至${subscribeEndTime}没有发布主题` }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import Moment from 'moment'
import Welcome from '../welcome.vue'
import util from '@/decorator/utilsDecorator'

@Component
@http
@util
export default class SubscribeMenu extends Vue {
  @Prop() private systemItems!: unknown[]
  // private fristFlag = true
  // private enterFlag = false
  private subscribeOverlay = false
  private subscribeTopicExist = true
  private subscribeStartTime: string = Moment(Moment().subtract(11, 'months').calendar(), 'MM-DD-YYYY').format(
    'YYYY-MM-DD'
  )
  private subscribeEndTime: string = Moment().format('YYYY-MM-DD')
  private subscribePageNum = 1
  private subscribeSystemId = 1
  private subscribeSystemName = 'ATS'
  private subscribeTotal = 0
  private subscribeDate: string = new Date().toISOString().substr(0, 10)
  private subscribeTime = false

  // private mouseEnterMethod(): void {
  //   if (!this.fristFlag) {
  //     this.enterFlag = true
  //   }
  // }

  // private mouseLeaveMethod(): void {
  //   this.enterFlag = false
  // }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private async getSubscribe(params: unknown, callback: Function) {
    const result: returnDataType = await this.h_request.httpGET('GET_STATISTICS_STAT_TOPIC_DATA', params)
    callback(result)
  }

  private drawSubscribe({ data }: returnDataType) {
    this.subscribeTopicExist = true
    this.subscribeTotal = data.total
    const parent = this.$parent as Welcome
    parent.topicRanking('subscribe', data, this.subscribeEndTime)
  }

  private selectSubscribeSystem(system: { name: string; id: number }) {
    this.subscribeSystemName = system.name
    this.subscribeSystemId = system.id
    this.subscribeOverlay = true
    this.getSubscribe(
      {
        startTime: this.subscribeStartTime,
        endTime: this.subscribeEndTime,
        systemId: this.subscribeSystemId,
        dataType: 2,
        pageNum: this.subscribePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.subscribeOverlay = false
        if (result.data.list.length > 0) {
          this.drawSubscribe(result)
        } else {
          this.subscribeTopicExist = false
        }
      }
    )
  }

  private selectSubscribePage(pageNum: number) {
    this.subscribePageNum = pageNum
    this.subscribeOverlay = true
    this.getSubscribe(
      {
        startTime: this.subscribeStartTime,
        endTime: this.subscribeEndTime,
        systemId: this.subscribeSystemId,
        dataType: 2,
        pageNum: this.subscribePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.subscribeOverlay = false
        if (result.data.list.length > 0) {
          this.drawSubscribe(result)
        } else {
          this.subscribeTopicExist = false
        }
      }
    )
  }

  private selectSubscribeTime() {
    this.subscribeTime = false
    this.subscribeStartTime = Moment(this.subscribeDate).subtract(11, 'months').format('YYYY-MM-DD')
    this.subscribeEndTime = this.subscribeDate
    this.subscribeOverlay = true
    this.getSubscribe(
      {
        startTime: this.subscribeStartTime,
        endTime: this.subscribeEndTime,
        systemId: this.subscribeSystemId,
        dataType: 2,
        pageNum: this.subscribePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.subscribeOverlay = false
        if (result.data.list.length > 0) {
          this.drawSubscribe(result)
        } else {
          this.subscribeTopicExist = false
        }
      }
    )
  }

  private subscribeAllowedDates(time: string) {
    const timeStamp = this.h_utils.timeutil.timeToStamp(time, '-')
    const nowStamp = this.h_utils.timeutil.timeToStamp(Moment().format('YYYY-MM-DD'), '-')
    return timeStamp <= nowStamp
  }

  mounted(): void {
    this.subscribeOverlay = true
    this.getSubscribe(
      {
        startTime: this.subscribeStartTime,
        endTime: this.subscribeEndTime,
        systemId: this.subscribeSystemId,
        dataType: 2,
        pageNum: this.subscribePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        this.subscribeOverlay = false
        this.drawSubscribe(result)
        // const el = this.$refs.rightBtmView as HTMLElement
        // el.addEventListener('animationend', () => {
        //   if (this.fristFlag) {
        //     this.fristFlag = false
        //   }
        // })
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
.rightBtmView
    p
        text-align: center
        color:#FFF
        margin-bottom:0px
</style>
