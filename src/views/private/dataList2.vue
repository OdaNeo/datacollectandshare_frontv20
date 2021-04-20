<template>
  <div id="dataMonitor">
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              :color="type === 'category' ? `primary` : `grey darken-2`"
              width="70px"
              class="mr-4"
              @click="type = 'category'"
              >日</v-btn
            >
            <v-btn
              outlined
              :color="type === 'week' ? `primary` : `grey darken-2`"
              width="70px"
              class="mr-4"
              @click="type = 'week'"
              >周</v-btn
            >
            <v-btn outlined :color="type === 'month' ? `primary` : `grey darken-2`" width="70px" @click="type = 'month'"
              >月</v-btn
            >
            <v-btn class="ml-12" fab text small color="grey darken-2" @click="prev">
              <v-icon small>{{ mdiChevronLeft }}</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>{{ mdiChevronRight }}</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">转到今日</v-btn>
          </v-toolbar>
        </v-sheet>
        <v-sheet :height="type === 'month' ? '77vh' : undefined">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            locale="zh-Hans"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            category-show-all
            interval-width="0"
            :categories="categories"
            :event-more-text="`显示更多`"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
          >
          </v-calendar>
          <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark dense flat>
                <v-toolbar-title> {{ selectedEvent.name }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span>时间: {{ selectedEvent.timeFormatter }}</span>
                <br />
                <span>状态: {{ selectedEvent.status }}</span>
                <br />
                <span>作业名: {{ selectedEvent.category }}</span>
                <br />
                <span>描述: {{ selectedEvent.remarks }}</span>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import { CalendarData, realTimeData } from '@/type/calendar'
import { calendarType, calendarColorType } from '@/enum/calendar-enum'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
@Component
@http
@util
export default class dataMonitor extends Vue {
  private focus = ''
  private type = 'month'
  private typeToLabel = {
    'month': '月',
    'week': '周',
    'category': '日'
  }

  private mdiChevronLeft = mdiChevronLeft
  private mdiChevronRight = mdiChevronRight

  private categories = ['日志', '事务', '视频']

  private selectedEvent = {}
  private selectedElement = null
  private selectedOpen = false
  private events: Array<CalendarData> = []
  private calendar: any
  // 按照天显示
  private viewDay({ date }: { date: string }) {
    this.focus = date
    this.type = 'category'
  }

  private getEventColor(event: { color: unknown }) {
    return event.color
  }
  // 转到今天
  private setToday() {
    this.focus = ''
  }
  // 上一条
  private prev() {
    this.calendar.prev()
  }
  // 下一条
  private next() {
    this.calendar.next()
  }
  // 显示事件详情
  private showEvent({ nativeEvent, event }: any) {
    const open = () => {
      this.selectedEvent = event
      this.selectedElement = nativeEvent.target
      setTimeout(() => {
        this.selectedOpen = true
      }, 10)
    }
    if (this.selectedOpen) {
      this.selectedOpen = false
      setTimeout(open, 10)
    } else {
      open()
    }
    nativeEvent.stopPropagation()
  }
  // 获得event
  private async updateRange() {
    const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG', {})

    const _events: Array<CalendarData> = data.list?.map((item: realTimeData) => {
      return {
        start: new Date(Number(item['createTime'])),
        color: calendarColorType[item['status']],
        remarks: item['remarks'],
        status: calendarType[item['status']],
        name: `作业ID：${item['topicId'].toString()}`,
        category: item['serverName'],
        timeFormatter: this.h_utils.timeUtil.stamptoFullTime(item['createTime'], '/'),
        timed: false
      }
    })
    // console.log(_events)

    this.$nextTick(() => {
      this.events = _events
    })
  }

  mounted(): void {
    this.calendar = this.$refs.calendar as any
    this.calendar.checkChange()
    this.updateRange()
  }
}
</script>
<style scoped>
#dataMonitor >>> .v-calendar-daily__body {
  display: none;
}
</style>
