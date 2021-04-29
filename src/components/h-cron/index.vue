<template>
  <v-col cols="12">
    <div class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>运行周期</label>
      <v-text-field disabled outlined dense height="35px" class="ml-4 mr-15" :value="cron"></v-text-field>
    </div>
    <div id="HCron">
      <!-- tab -->
      <HTabs v-model="tab" :items="items" />
      <!-- items -->
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
  </v-col>
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
  @Prop({ default: '* * * * * ?' }) private value!: string

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
          specificSpecific: [`0`]
        },
        // 分
        minute: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '5',
          rangeStart: '0',
          rangeEnd: '59',
          specificSpecific: [`0`]
        },
        // 小时
        hour: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '1',
          rangeStart: '0',
          rangeEnd: '23',
          specificSpecific: [`0`]
        },
        // 日
        day: {
          cronEvery: '',
          incrementStart: '1',
          incrementIncrement: '1',
          rangeStart: '1',
          rangeEnd: '31',
          specificSpecific: [`1`]
        },
        //   月
        month: {
          cronEvery: '',
          incrementStart: '1',
          incrementIncrement: '1',
          rangeStart: '1',
          rangeEnd: '12',
          specificSpecific: [`1`]
        },
        //   周
        week: {
          cronEvery: '',
          incrementStart: '0',
          incrementIncrement: '1',
          rangeStart: '0',
          rangeEnd: '1',
          specificSpecific: [`0`]
        },
        // 日期和周互斥，默认是'day'
        mutexDayAndWeek: 'day'
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
        days = '*'
        break
      case '2':
        days = this.cronProvide.day.incrementStart + '/' + this.cronProvide.day.incrementIncrement
        break
      case '3':
        this.cronProvide.day.specificSpecific.map((val: string) => {
          days += val + ','
        })
        days ? (days = days.slice(0, -1)) : (days = '*')
        break
      case '4':
        days = this.cronProvide.day.rangeStart + '-' + this.cronProvide.day.rangeEnd
        break
      case '5':
        days = '?'
        // 如果日期和周都是不设置'?'，则都可以点击
        if (this.cronProvide.week.cronEvery.toString() === '5') {
          this.cronProvide.mutexDayAndWeek = 'mutex'
        } else {
          this.cronProvide.mutexDayAndWeek = 'week'
        }
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
      case '2':
        weeks = this.cronProvide.week.incrementStart + '/' + this.cronProvide.week.incrementIncrement
        break
      case '3':
        this.cronProvide.week.specificSpecific.map((val: string) => {
          weeks += val + ','
        })

        weeks ? (weeks = weeks.slice(0, -1)) : (weeks = '*')
        break
      case '4':
        weeks = this.cronProvide.week.rangeStart + '-' + this.cronProvide.week.rangeEnd
        break
      case '5':
        weeks = '?'
        // 如果日期和周都是不设置'?'，则都可以点击
        if (this.cronProvide.day.cronEvery.toString() === '5') {
          this.cronProvide.mutexDayAndWeek = 'mutex'
        } else {
          this.cronProvide.mutexDayAndWeek = 'day'
        }
        break
      default:
        weeks = '?'
        break
    }
    return weeks
  }

  // cron计算方法
  private get cron() {
    const _text = `${this.secondsText} ${this.minutesText} ${this.hoursText} ${this.daysText} ${this.monthsText} ${this.weeksText}`
    this.$emit('input', _text)
    return _text
  }

  // 回显cron
  private handlePropCron(val: string, key: string) {
    if (val.includes('/')) {
      // 3/4
      const _val = val.split('/')
      this.cronProvide[key].cronEvery = '2'
      this.cronProvide[key].incrementStart = _val[0]
      this.cronProvide[key].incrementIncrement = _val[1]
    } else if (val.includes('-')) {
      // 1-2
      const _val = val.split('-')
      this.cronProvide[key].cronEvery = '4'
      this.cronProvide[key].rangeStart = _val[0]
      this.cronProvide[key].rangeEnd = _val[1]
    } else if (val === '?') {
      // ?
      this.cronProvide[key].cronEvery = '5'
    } else if (val === '*') {
      // *
      this.cronProvide[key].cronEvery = '1'
    } else {
      // 1,2,3,4 或 1
      const _val = val.split(',')
      this.cronProvide[key].cronEvery = '3'
      this.cronProvide[key].specificSpecific = [..._val]
    }
  }

  @Watch('value', { immediate: true })
  private setCron(val: string) {
    const _val = val.split(' ')
    const _arr = [`second`, `minute`, 'hour', 'day', 'month', 'week']

    _arr.forEach((item, index) => {
      this.handlePropCron(_val[index], item)
    })
  }
}
</script>
<style scoped>
#HCron {
  height: 270px;
  width: 540px;
  margin: 0 auto;
}
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
