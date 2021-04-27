<template>
  <div id="HCron">
    <div>{{ cron }}</div>
    <!-- tab -->
    <HTabs v-model="tab" :items="items" />
    <v-tabs-items v-model="tab" class="px-4 pb-4">
      <!-- 秒 -->
      <v-tab-item eager>
        <CronSecond />
      </v-tab-item>
      <v-tab-item eager>
        <CronMinute />
      </v-tab-item>
      <v-tab-item eager>
        <CronHour />
      </v-tab-item>
      <v-tab-item eager>
        <CronDay />
      </v-tab-item>
      <v-tab-item eager>
        <CronMonth />
      </v-tab-item>
      <v-tab-item eager>
        <CronWeek />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator'
import HTabs from '@/components/h-tabs.vue'
import CronSecond from './second.vue'
import CronMinute from './minute.vue'
import CronHour from './hour.vue'
import CronDay from './day.vue'
import CronMonth from './month.vue'
import CronWeek from './week.vue'

@Component({
  components: {
    HTabs,
    CronSecond,
    CronMinute,
    CronHour,
    CronDay,
    CronMonth,
    CronWeek
  }
})
export default class HCron extends Vue {
  @Prop({ default: '* * * * * ?' }) private PropCron!: string

  @Provide('cronProvide') private cronProvide: any = new Vue({
    data() {
      return {
        // 秒
        second: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '5',
          rangeStart: '0',
          rangeEnd: '59',
          specificSpecific: []
        },
        // 分
        minute: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '5',
          rangeStart: '0',
          rangeEnd: '59',
          specificSpecific: []
        },
        // 小时
        hour: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '1',
          rangeStart: '0',
          rangeEnd: '23',
          specificSpecific: []
        },
        // 日
        day: {
          cronEvery: '',
          incrementStart: '1',
          incrementIncrement: '1',
          rangeStart: '1',
          rangeEnd: '31',
          specificSpecific: []
        },
        //   月
        month: {
          cronEvery: '',
          incrementStart: '1',
          incrementIncrement: '1',
          rangeStart: '1',
          rangeEnd: '12',
          specificSpecific: []
        },
        //   周
        week: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '1',
          rangeStart: '0',
          rangeEnd: '1',
          specificSpecific: []
        }
      }
    }
  })

  private tab = 0
  private items = ['秒', '分', '时', '日', '月', '周']

  // 秒
  private get secondsText() {
    let seconds = ''
    let cronEvery = this.cronProvide.second.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        seconds = '*'
        break
      case '2':
        seconds = this.cronProvide.second.incrementStart + '/' + this.cronProvide.second.incrementIncrement
        break
      case '3':
        this.cronProvide.second.specificSpecific.map((val: string) => {
          seconds += val + ','
        })
        seconds ? (seconds = seconds.slice(0, -1)) : (seconds = '*')
        break
      case '4':
        seconds = this.cronProvide.second.rangeStart + '-' + this.cronProvide.second.rangeEnd
        break
      default:
        seconds = '*'
        break
    }
    return seconds
  }
  //  分钟
  private get minutesText() {
    let minutes = ''
    let cronEvery = this.cronProvide.minute.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        minutes = '*'
        break
      case '2':
        minutes = this.cronProvide.minute.incrementStart + '/' + this.cronProvide.minute.incrementIncrement
        break
      case '3':
        this.cronProvide.minute.specificSpecific.map((val: string) => {
          minutes += val + ','
        })
        minutes ? (minutes = minutes.slice(0, -1)) : (minutes = '*')
        break
      case '4':
        minutes = this.cronProvide.minute.rangeStart + '-' + this.cronProvide.minute.rangeEnd
        break
      default:
        minutes = '*'
        break
    }
    return minutes
  }
  //  小时
  private get hoursText() {
    let hours = ''
    let cronEvery = this.cronProvide.hour.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        hours = '*'
        break
      case '2':
        hours = this.cronProvide.hour.incrementStart + '/' + this.cronProvide.hour.incrementIncrement
        break
      case '3':
        this.cronProvide.hour.specificSpecific.map((val: string) => {
          hours += val + ','
        })
        hours ? (hours = hours.slice(0, -1)) : (hours = '*')
        break
      case '4':
        hours = this.cronProvide.hour.rangeStart + '-' + this.cronProvide.hour.rangeEnd
        break
      default:
        hours = '*'
        break
    }
    return hours
  }
  //  日期
  private get daysText() {
    let days = ''
    let cronEvery = this.cronProvide.day.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        days = '?'
        break
      case '2':
        days = '*'
        break
      case '3':
        days = this.cronProvide.day.incrementStart + '/' + this.cronProvide.day.incrementIncrement
        break
      case '4':
        this.cronProvide.day.specificSpecific.map((val: string) => {
          days += val + ','
        })
        days ? (days = days.slice(0, -1)) : (days = '*')
        break
      case '5':
        days = this.cronProvide.day.rangeStart + '-' + this.cronProvide.day.rangeEnd
        break

      default:
        days = '*'
        break
    }
    return days
  }
  //  月
  private get monthsText() {
    let months = ''
    let cronEvery = this.cronProvide.month.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        months = '*'
        break
      case '2':
        months = this.cronProvide.month.incrementStart + '/' + this.cronProvide.month.incrementIncrement
        break
      case '3':
        this.cronProvide.month.specificSpecific.map((val: string) => {
          months += val + ','
        })
        months ? (months = months.slice(0, -1)) : (months = '*')
        break
      case '4':
        months = this.cronProvide.month.rangeStart + '-' + this.cronProvide.month.rangeEnd
        break
      default:
        months = '*'
        break
    }
    return months
  }

  //   周
  private get weeksText() {
    let weeks = ''
    let cronEvery = this.cronProvide.week.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        weeks = '?'
        break
      case '2':
        weeks = this.cronProvide.week.incrementStart + '/' + this.cronProvide.week.incrementIncrement
        break
      case '3':
        this.cronProvide.week.specificSpecific.map((val: { value: string }) => {
          weeks += val.value + ','
        })
        weeks ? (weeks = weeks.slice(0, -1)) : (weeks = '*')
        break
      case '4':
        weeks = this.cronProvide.week.rangeStart + '-' + this.cronProvide.week.rangeEnd
        break
      default:
        weeks = '?'
        break
    }
    return weeks
  }

  private get cron() {
    return `${this.secondsText} ${this.minutesText} ${this.hoursText} ${this.daysText} ${this.monthsText} ${this.weeksText}`
  }

  @Watch('PropCron', { immediate: true })
  private setCron(val: string) {
    const _val = val.replaceAll(' ', '')
    console.log(_val)
    // this.second = _val[0]
  }
}
</script>
<style scoped>
#HCron >>> .v-input__append-inner {
  margin-top: 3px !important;
}
.cronItem {
  display: flex;
  justify-content: center;
  align-items: center;
}
.cronInput {
  margin: 0 10px;
  width: 68px;
}
</style>
