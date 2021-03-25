<template>
  <div class="viewBox rightBtmView">
    <HOverLay :loading="loading" />
    <div v-if="!loading" style="width: 100%; height: 8%; padding-top: 10px">
      <p>{{ `${subscribeStartTime}至${subscribeEndTime}主题${subscribeSystemName}订阅情况` }}</p>
      <div class="iconCon">
        <v-menu offset-y max-height="200" min-width="130" transition="slide-x-transition">
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn color="primary" dark icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-icon>{{ mdiShieldLock }}</v-icon>
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
                  <v-icon>{{ mdiShieldLock }}</v-icon>
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
                  <v-icon>{{ mdiShieldLock }}</v-icon>
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
    <div id="subscribe" style="height: 90%" v-show="subscribeTopicExist"></div>
    <div v-show="!subscribeTopicExist">
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
import util from '@/decorator/utilsDecorator'
import HOverLay from '@/components/h-overlay.vue'
import { mdiShieldLock } from '@mdi/js'

@Component({
  components: {
    HOverLay
  }
})
@http
@util
export default class SubscribeMenu extends Vue {
  @Prop() private systemItems!: unknown[]
  private loading = true
  private mdiShieldLock = mdiShieldLock

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

  private async getSubscribe(params: any, callback: Function) {
    this.loading = true
    const result: returnDataType = await this.h_request.httpGET('GET_STATISTICS_STAT_TOPIC_DATA', params)

    this.loading = false
    callback(result)
  }

  private drawSubscribe({ data }: returnDataType) {
    this.subscribeTopicExist = true
    this.subscribeTotal = data.total
    this.h_utils.topicRanking.init('subscribe', data, this.subscribeEndTime)
  }

  private selectSubscribeSystem(system: { name: string; id: number }) {
    this.subscribeSystemName = system.name
    this.subscribeSystemId = system.id
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
        if (result.data.list?.length > 0) {
          this.drawSubscribe(result)
        } else {
          this.subscribeTopicExist = false
        }
      }
    )
  }

  private selectSubscribePage(pageNum: number) {
    this.subscribePageNum = pageNum
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
        if (result.data.list?.length > 0) {
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
        if (result.data.list?.length > 0) {
          this.drawSubscribe(result)
        } else {
          this.subscribeTopicExist = false
        }
      }
    )
  }

  private subscribeAllowedDates(time: string) {
    const timeStamp = this.h_utils.timeUtil.timeToStamp(time, '-')
    const nowStamp = this.h_utils.timeUtil.timeToStamp(Moment().format('YYYY-MM-DD'), '-')
    return timeStamp <= nowStamp
  }

  mounted(): void {
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
        this.drawSubscribe(result)
      }
    )
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
.iconCon
    position:absolute
    right:0
    top:5px
    width:20%
    display:flex
    // z-index:999
.rightBtmView
    p
        text-align: center
        color:#000
        margin-bottom:0px
</style>
