<template>
  <div class="viewBox leftBtmView">
    <HOverLay :loading="loading" />
    <div v-if="!loading" style="width: 100%; height: 8%; padding-top: 10px">
      <p>{{ `${releaseStartTime}至${releaseEndTime} ${releaseSystemName}系统主题消息发布情况` }}</p>
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
                  <v-icon>{{ mdiShieldLock }}</v-icon>
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
                  <v-icon>{{ mdiShieldLock }}</v-icon>
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
    <div id="release" style="height: 90%" v-show="releaseTopicExist"></div>
    <div v-show="!releaseTopicExist">
      <p style="margin-top: 150px">
        {{ `主题${releaseSystemName}在${releaseStartTime}至${releaseEndTime}没有发布主题` }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
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
export default class ReleaseMenu extends Vue {
  @Prop() private systemItems!: unknown[]
  private loading = true
  private mdiShieldLock = mdiShieldLock

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

  private async getRelease(params: any, callback: Function) {
    this.loading = true
    const result: returnDataType = await this.h_request.httpGET('GET_STATISTICS_STAT_TOPIC_DATA', params)
    this.loading = false
    callback(result)
  }

  private selectReleaseSystem(system: { name: string; id: number }) {
    this.releaseSystemName = system.name
    this.releaseSystemId = system.id
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
        if (result.data.list?.length > 0) {
          this.drawRelease(result)
        } else {
          this.releaseTopicExist = false
        }
      }
    )
  }

  private selectReleasePage(pageNum: number) {
    this.releasePageNum = pageNum
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
        if (result.data.list?.length > 0) {
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
        if (result.data.list?.length > 0) {
          this.drawRelease(result)
        } else {
          this.releaseTopicExist = false
        }
      }
    )
  }

  private releaseAllowedDates(time: string) {
    const timeStamp = this.h_utils.timeUtil.timeToStamp(time, '-')
    const nowStamp = this.h_utils.timeUtil.timeToStamp(Moment().format('YYYY-MM-DD'), '-')
    return timeStamp <= nowStamp
  }

  private drawRelease({ data }: returnDataType) {
    // console.log(data)
    this.releaseTopicExist = true
    this.releaseTotal = data.total
    // const parent = this.$parent as Welcome
    // parent.topicRanking('release', data, this.releaseEndTime)

    this.h_utils.topicRanking.init('release', data, this.releaseEndTime)
  }

  mounted(): void {
    // this.releaseOverlay = true
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
        // this.releaseOverlay = false
        this.drawRelease(result)
        // const el = this.$refs.leftBtmView as HTMLElement
        // el.addEventListener('animationend', () => {
        //   if (this.firstFlag) {
        //     this.firstFlag = false
        //   }
        // })
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
.leftBtmView
    p
        text-align: center
        color:#000
        margin-bottom:0px
</style>
