<template>
  <div id="videoDatePicker">
    <!-- 日期选择器 -->
    <v-row no-gutters style="display: flex; align-items: center; justify-content: center">
      <v-col cols="5">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-click="false"
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
          <div class="weektime-hd-title">日期\时间</div>
          <div class="weektime-hd-con">
            <div class="weektime-hd-con-top">
              <div class="weektime-date-range">00:00 - 11:59</div>
              <div class="weektime-date-range">12:00 - 23:59</div>
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
          <div v-if="!isSearching" class="time-body">
            <div
              :class="item.url.length > 0 ? `time-cell video-active` : `time-cell`"
              v-for="item in videoList"
              :key="item.id"
              @click="push2VideoListAvailable(item)"
            >
              <v-icon color="primary darken-4" v-if="item.url.length > 0 && item.available" size="16">{{
                mdiCheck
              }}</v-icon>
            </div>
          </div>
          <!-- loading -->
          <div v-else class="time-body" style="background-color: #f7f7f9"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import util from '@/decorator/utilsDecorator'
import { mdiMagnify, mdiCheck } from '@mdi/js'
@Component
@http
@util
export default class VideoDatePicker extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private menu = false
  private mdiMagnify = mdiMagnify
  private mdiCheck = mdiCheck

  private isSearching = true

  private videoList: { timer: string; url: string[] }[] = []

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
    this.isSearching = true
    const params: any = {}
    // -8小时，服务器时间有误
    // 2020-1-1-0时 ~ 2020-1-1-1时 视频文件数：1，overTime - beginTime=0ms
    params.beginTime = new Date(this.dates[0]).getTime() + (0 - 8) * 3600 * 1000
    params.overTime = new Date(this.dates[1]).getTime() + (23 - 8) * 3600 * 1000
    params.topicId = this.formProvide.formObj.topicId
    params.bucketName = this.formProvide.formObj.bucketName
    // 总共显示的视频数
    const { data } = await this.h_request['httpGET']('GET_VIDEO_ADDRESS', params)
    this.isSearching = false
    // const data = [
    //   { timer: '2021-01-01 03', url: ['4', '5', '6'] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: ['1', '2', '3'] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 05', url: [] },
    //   { timer: '2021-01-01 06', url: ['11', '21', '31'] }
    // ]
    let videoCount = 0
    this.videoList = data.map((item: { timer: string; url: string[] }) => {
      if (item.url.length > 0) {
        videoCount += item.url.length
      }
      return { ...item, available: false }
    })

    if (videoCount === 0) {
      this.h_utils['alertUtil'].open('该时间段视频不存在', true, 'error', 3000)
    }

    this.formProvide.formObj.videoListAvailable.length = 0
  }

  // 推入视频栈内
  private push2VideoListAvailable(item: { timer: string; url: string[]; available: boolean }) {
    if (item.url.length === 0) {
      return
    }
    let flag = 0
    this.formProvide.formObj.videoListAvailable.forEach((i: { timer: string }) => {
      if (item.timer === i.timer) {
        flag++
      }
    })

    if (flag === 0) {
      this.$set(item, `available`, true)
      this.formProvide.formObj.videoListAvailable.push(item)
    } else {
      this.$set(item, `available`, false)
      this.formProvide.formObj.videoListAvailable = this.formProvide.formObj.videoListAvailable.filter(
        (_i: { timer: string }) => _i.timer !== item.timer
      )
    }
  }

  @Watch(`menu`)
  private handleIsSearching(val: boolean) {
    if (val) {
      this.isSearching = true
    }
  }

  created(): void {
    this.getVideoList()
  }
}
</script>
<style scoped>
#videoDatePicker {
  height: 350px;
}
.weektime {
  width: 688px;
  font-size: 14px;
  box-sizing: border-box;
  line-height: 32px;
  color: #515a6e;
  user-select: none;
}
.weektime-main {
  border: 1px solid #dcdee2;
  box-sizing: border-box;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-active {
  cursor: pointer;
  background-color: #82b1ff;
}
</style>
