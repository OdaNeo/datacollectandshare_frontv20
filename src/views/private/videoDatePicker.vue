<template>
  <div id="videoDatePicker">
    <!-- 日期选择器 -->
    <v-row no-gutters>
      <v-col cols="3">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          :return-value.sync="dates"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              outlined
              placeholder="请选择时间范围，最长一周"
              height="35px"
              :append-icon="mdiMagnify"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker locale="zh-Hans" v-model="dates" no-title range :allowed-dates="allowedDates">
            <v-spacer></v-spacer>
            <v-btn text color="grey" @click="menu = false">取消</v-btn>
            <v-btn
              text
              :disabled="dates.length < 2"
              color="primary"
              @click="
                $refs.menu.save(dates)
                getVideoList()
              "
            >
              确定
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <!-- 查看日期 -->
    <div class="weektime">
      <div class="weektime-main">
        <div class="weektime-hd">
          <div class="weektime-hd-title">星期\时间</div>
          <div class="weektime-hd-con">
            <div class="weektime-hd-con-top">
              <div class="weektime-date-range">00:00 - 12:00</div>
              <div class="weektime-date-range">12:00 - 24:00</div>
            </div>
            <div class="weektime-hd-con-bottom">
              <span class="weektime-date-cell" v-for="hour in 24" :key="hour">{{ hour - 1 }}</span>
            </div>
          </div>
        </div>
        <div class="weektime-bd">
          <div class="week-body">
            <div v-for="week in weekDays" :key="week.id" class="week-item">{{ week }}</div>
          </div>
          <div class="time-body">
            <div
              :class="item.url.length > 0 ? `time-cell video-active` : `time-cell`"
              :style="{ color: item.available ? `red` : 'green' }"
              v-for="item in videoList"
              :key="item.id"
              @click="push2VideoListAvailable(item)"
            >
              1
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 视频列表 -->
    <div>
      <div v-for="item in videoListAvailable" :key="item.id">{{ item }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import { mdiMagnify } from '@mdi/js'

@Component
@http
@util
export default class videoDatePicker extends Vue {
  private menu = false
  private mdiMagnify = mdiMagnify

  private videoList: { timer: string; url: string[]; available: boolean }[] = []

  private videoListAvailable: { timer: string; url: string[]; available: boolean }[] = []

  private curTime = new Date().getTime()

  // 默认显示当前周
  private dates = [
    this.h_utils.timeUtil.stamptoTime(this.curTime - 6 * 24 * 60 * 60 * 1000, '-'),
    this.h_utils.timeUtil.stamptoTime(this.curTime, '-')
  ]

  private get weekDays() {
    if (this.dates.length !== 2) {
      return []
    } else {
      let _start = new Date(this.dates[0]).getTime()
      const _end = new Date(this.dates[1]).getTime()
      const _arr: number[] = []
      while (_end >= _start) {
        _arr.push(_start)
        _start += 24 * 60 * 60 * 1000
      }

      return _arr.map(item => {
        return this.h_utils.timeUtil.stamptoTime(item, '-')
      })
    }
  }

  private allowedDates(val: string) {
    if (this.dates.length === 0) {
      return true
    } else if (this.dates.length === 1) {
      const beginTime = this.h_utils.timeUtil.timeToStamp(val, '-')
      const endTime = this.h_utils.timeUtil.timeToStamp(this.dates[0], '-')
      return beginTime + 24 * 60 * 60 * 1000 > endTime && beginTime < endTime + 7 * 24 * 60 * 60 * 1000
    } else {
      return true
    }
  }
  private get dateRangeText() {
    return this.dates.length > 1 ? this.dates.join(' ~ ') : ''
  }
  // 获得视频列表
  private async getVideoList() {
    const params: any = {}
    // -8小时，服务器时间有误
    // 2020-1-1-0时 ~ 2020-1-1-1时 视频文件数：1，overTime - beginTime=0ms
    params.beginTime = new Date(this.dates[0]).getTime() + (0 - 8) * 3600 * 1000
    params.overTime = new Date(this.dates[1]).getTime() + (23 - 8) * 3600 * 1000
    params.topicId = 9008392
    params.bucketName = `topic9008392`
    // 总共显示的视频数
    // const { data } = await this.h_request['httpGET']('GET_VIDEO_ADDRESS', params)
    const data = [
      { timer: '2021-01-01 02', url: [] },
      { timer: '2021-01-01 03', url: ['4', '5', '6'] },
      { timer: '2021-01-01 04', url: [] },
      { timer: '2021-01-01 05', url: ['1', '2', '3'] }
    ]
    this.videoList = data.map(item => {
      return { ...item, available: false }
    })
  }

  // 推入视频栈内
  private push2VideoListAvailable(item: { timer: string; url: string[]; available: boolean }) {
    if (item.url.length === 0) {
      return
    }
    let flag = 0
    this.videoListAvailable.forEach(i => {
      if (item.timer === i.timer) {
        flag++
      }
    })
    if (flag === 0) {
      this.$set(item, `available`, true)
      this.videoListAvailable.push(item)
    }
  }

  created(): void {
    this.getVideoList()
  }
}
</script>
<style scoped>
.weektime {
  width: 688px;
  font-size: 14px;
  line-height: 32px;
  color: #515a6e;
  user-select: none;
}
.weektime-main {
  border: 1px solid #dcdee2;
  position: relative;
}
.weektime-hd {
  display: flex;
  background: #f8f8f9;
}
.weektime-hd-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 65px;
}
.weektime-hd-con {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.weektime-hd-con-top {
  display: flex;
  border-bottom: 1px solid #dcdee2;
}
.weektime-date-range {
  width: 288px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-left: 1px solid #dcdee2;
}
.weektime-hd-con-bottom {
  display: flex;
}
.weektime-date-cell {
  width: 24px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-left: 1px solid #dcdee2;
}
.weektime-bd {
  display: flex;
}
.week-body {
  width: 110px;
  flex-shrink: 0;
}
.week-item {
  border-top: 1px solid #dcdee2;
  text-align: center;
  height: 30px;
  line-height: 30px;
}
.time-body {
  width: 576px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  position: relative;
}
.time-cell {
  box-sizing: border-box;
  position: relative;
  width: 24px;
  height: 30px;
  border-left: 1px solid #efefef;
  border-top: 1px solid #efefef;
  overflow: hidden;
  transition: all 0.3s ease;
  outline-width: 0;
}

.video-active {
  cursor: pointer;
  background-color: #1890ff;
}
</style>
