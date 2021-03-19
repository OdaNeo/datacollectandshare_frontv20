<template>
  <div id="OfflineDataStatistics">
    <p style="text-align: center; color: #000; font-size: 20px; line-height: 30px">
      {{ `${releaseStartTime}至${releaseEndTime}主题${releaseSystemName}离线数据任务统计` }}
    </p>
    <div class="iconCon">
      <v-menu offset-y max-height="200" min-width="130" transition="slide-x-transition">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn color="primary" dark icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-icon>mdi-shield-lock</v-icon>
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
                <v-icon>mdi-shield-lock</v-icon>
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
                <v-icon>mdi-shield-lock</v-icon>
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
    <div id="release" style="height: 90%" v-show="releaseTopicExist"></div>
    <div v-show="!releaseTopicExist">
      <p style="margin-top: 180px; text-align: center">
        {{ `主题${releaseSystemName}在${releaseStartTime}至${releaseEndTime}没有任务执行` }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import Moment from 'moment'
import util from '@/decorator/utilsDecorator'

@Component
@http
@util
export default class OfflineDataStatistics extends Vue {
  private systemItems = []
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
    const result: returnDataType = await this.h_request.httpGET('GET_STATISTICS_STAT_TOPIC_DATA', params)
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
        dataType: 4,
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
        dataType: 4,
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
        dataType: 4,
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
    this.releaseTopicExist = true
    this.releaseTotal = data.total

    this.h_utils.topicRanking.init('release', data, this.releaseEndTime)
  }

  private async getSysRelease() {
    const result: returnDataType = await this.h_request.httpGET('GET_SYSTEM_GETSYSTEMINFO', {})
    this.systemItems = result.data
  }

  mounted(): void {
    this.getRelease(
      {
        startTime: this.releaseStartTime,
        endTime: this.releaseEndTime,
        systemId: this.releaseSystemId,
        dataType: 4,
        pageNum: this.releasePageNum,
        pageSize: 10
      },
      (result: returnDataType) => {
        // if (result.data.list?.length > 0) {
        this.drawRelease(result)
        // } else {
        //   this.releaseTopicExist = false
        // }
      }
    )
    this.getSysRelease()
  }
}
</script>
<style scoped>
#OfflineDataStatistics {
  position: relative;
  width: 80%;
  height: 75vh;
  padding-top: 20px;
  margin-top: 20px;
  box-shadow: 2px 6px 15px 0 rgba(69, 65, 78, 0.1);
  border-radius: 5px;
  background: #fff;
}
.iconCon {
  position: absolute;
  right: 0;
  top: 18px;
  width: 20%;
  display: flex;
}
</style>
