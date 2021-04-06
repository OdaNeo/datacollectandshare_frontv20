<template>
  <v-app id="tct">
    <v-app-bar app height="57" width="100%" style="left: 0px; z-index: 10" flat color="rgb(0, 21, 41)">
      <TopBar />
    </v-app-bar>
    <v-navigation-drawer permanent style="padding-top: 57px; z-index: 9; max-width: 210px" width="15%" app>
      <NavBar />
    </v-navigation-drawer>
    <v-main style="background: rgb(246, 248, 251); width: 100%; height: 100%">
      <v-container fluid class="main-container mt-3">
        <!-- 面包屑导航 -->
        <!-- <v-breadcrumbs :items="items"></v-breadcrumbs> -->
        <transition name="fade-transform" mode="out-in">
          <router-view class="main-container-inner"></router-view>
        </transition>
      </v-container>
    </v-main>
    <div v-if="events.length > 0">
      <div v-if="showAlert" id="alert">
        <v-btn class="close-btn" icon color="white" @click="handleHideAlert" small>
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-alert style="font-size: 13px" v-for="item in events" :key="item.id" :color="item.color" dark dense>
          <span>主题ID: {{ item.name }}</span>
          <br />
          <span>状态: {{ item.status }}</span>
          <br />
          <span>作业名: {{ item.serverName }}</span>
          <br />
          <span>描述: {{ item.remarks }}</span>
        </v-alert>
      </div>
      <!-- <v-btn v-else id="alert-small" icon color="error" large @click="handleShowAlert">
        <v-icon>mdi-alert</v-icon>
      </v-btn> -->
    </div>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from './childComponent/navbar.vue'
import TopBar from './childComponent/topbar.vue'
import { CalendarData, realTimeData } from '@/type/calendar'
import { calendarType, calendarColorType } from '@/enum/calendar-enum'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import { mdiClose } from '@mdi/js'

@Component({
  components: {
    NavBar,
    TopBar
  }
})
@http
@util
export default class Layout extends Vue {
  mdiClose = mdiClose

  private timer = 0
  private interval = 60

  private events: Array<CalendarData> = []
  private showAlert = false

  private async updateRange() {
    // const data = [
    //   {
    //     'id': 1,
    //     'topicId': 88888888,
    //     'serverName': '日志',
    //     'status': 1,
    //     'createTime': '1614783227618',
    //     'remarks':
    //       'NullPointerExceptionNullPointerExceptionNullPointerExceptionNullPointerExceptionNullPointerExceptionNullPointerExceptionNullPointerExceptionNullPointerException'
    //   },
    //   {
    //     'id': 2,
    //     'topicId': 88888889,
    //     'serverName': '视频',
    //     'status': 2,
    //     'createTime': '1614094237618',
    //     'remarks': 'NullPointerExceptionsf'
    //   },
    //   {
    //     'id': 3,
    //     'topicId': 88888890,
    //     'serverName': '事务',
    //     'status': 3,
    //     'createTime': '1614094237618',
    //     'remarks': 'NullPointerExceptionsf'
    //   }
    // ]
    // const code = 200

    const { data } = await this.h_request['httpGET']('GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME', {
      date: new Date().getTime()
    })
    // 如果 data 不存在，说明没有权限或者http请求出错
    if (data === undefined) {
      this.h_utils.alertUtil.close()
      clearInterval(this.timer)
      return
    } else if (data.length === 0) {
      // data是空，直接返回
      return
    } else if (data.length > 0) {
      this.showAlert = true
    }

    const _events: Array<CalendarData> = data?.map((item: realTimeData) => {
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
      this.events = [..._events]
    })
  }
  // 面包屑导航内容
  // get items(): Array<{ text: string; disabled?: boolean; link?: boolean; to?: string }> {
  //   if (this.$route.matched[0].meta.title === 'tct') {
  //     return [
  //       { text: '首页', disabled: false },
  //       { text: this.$route.meta.title, disabled: true }
  //     ]
  //   } else {
  //     return [
  //       { text: '首页', disabled: false },
  //       { text: this.$route.matched[0].meta.title, disabled: false },
  //       { text: this.$route.meta.title, disabled: true }
  //     ]
  //   }
  // }

  private handleHideAlert() {
    this.showAlert = false
  }

  private handleShowAlert() {
    this.showAlert = true
  }
  mounted(): void {
    // this.updateRange()

    this.timer = setInterval(() => {
      this.updateRange()
    }, this.interval * 1000)
  }
  // 清除timer
  beforeDestroy(): void {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
#tct {
  width: 100%;
  height: auto;
}
#tct >>> .v-navigation-drawer__border {
  background-color: transparent;
}
#alert {
  position: fixed;
  right: 20px;
  bottom: 10px;
  width: 300px;
  word-break: break-all;
  z-index: 3;
}

#alert-small {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 3;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
.main-container {
  height: auto;
  width: 100%;
}
.main-container-inner {
  width: 97%;
  margin: 0 auto;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
