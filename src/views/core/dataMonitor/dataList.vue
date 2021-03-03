<template>
  <div id="dataMonitor">
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">转到今日</v-btn>
            <v-btn class="ml-12" fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>日</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>周</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>月</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="550">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            locale="zh-Hans"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
          ></v-calendar>
          <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title>主题ID: {{ selectedEvent.name }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span>状态: {{ selectedEvent.status }}</span>
                <br />
                <span>服务名: {{ selectedEvent.serverName }}</span>
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
import { CalendarData } from '@/type/calendar'
import { calendarType, calendarColorType } from '@/enum/calendar-enum'

@Component
@http
export default class dataMonitor extends Vue {
  private focus = ''
  private type = 'month'
  private typeToLabel = {
    'month': '月',
    'week': '周',
    'day': '日'
  }

  private selectedEvent = {}
  private selectedElement = null
  private selectedOpen = false
  private events: Array<CalendarData> = []
  private calendar: any

  private viewDay({ date }: { date: string }) {
    this.focus = date
    this.type = 'day'
  }

  private getEventColor(event: { color: unknown }) {
    return event.color
  }

  private setToday() {
    this.focus = ''
  }

  private prev() {
    this.calendar.prev()
  }
  private next() {
    this.calendar.next()
  }

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

  private updateRange() {
    const data = [
      {
        'id': 1,
        'topicId': 88888888,
        'serverName': '日志',
        'status': 1,
        'createTime': '1614783227618',
        'remarks': 'NullPointerException'
      },
      {
        'id': 1,
        'topicId': 88888886,
        'serverName': '事务',
        'status': 3,
        'createTime': '1614283227618',
        'remarks': 'NullPointerException'
      },
      {
        'id': 1,
        'topicId': 88888889,
        'serverName': '视频',
        'status': 2,
        'createTime': '1614094237618',
        'remarks': 'NullPointerException'
      }
    ]

    const _events: Array<CalendarData> = data.map(item => {
      return {
        start: new Date(Number(item['createTime'])),
        color: calendarColorType[item['status']],
        remarks: item['remarks'],
        status: calendarType[item['status']],
        name: item['topicId'].toString(),
        serverName: item['serverName'],
        timed: true
      }
    })

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
