<template>
  <div id="topbar">
    <v-row align="center" no-gutters justify="center">
      <v-col cols="12" align-self="center">
        <h1 style="color: #fff; text-align: center" class="titleshadow">{{ PROJECT_TITLE }}</h1>
        <div class="userMenu" v-show="userMenuState">
          <v-menu left offset-y bottom attach transition="slide-x-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                retain-focus-on-click
                color="teal darken-1"
                v-bind="attrs"
                v-on="on"
                class="white--text ma-8"
              >
                {{ username }}
              </v-btn>
            </template>
            <v-list subheader>
              <v-list-item>
                <v-list-item-title>
                  <v-dialog v-model="dialog" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <span color="red lighten-2" dark v-bind="attrs" v-on="on">个人信息</span>
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2">个人信息</v-card-title>
                      <v-card-text style="padding-top: 20px">
                        {{ userName }}
                      </v-card-text>
                      <v-card-text>
                        {{ userType }}
                      </v-card-text>
                      <v-card-text>
                        {{ userStatus }}
                      </v-card-text>
                      <v-card-text>
                        {{ usersysName }}
                      </v-card-text>
                      <v-card-text>
                        {{ userToken }}
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="dialog = false"> 确定 </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-for="(item, index) in userMenu" :key="index" @click="item.clickMethod">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rootStoreModule } from '../store/modules/root'
import http from '../decorator/httpDecorator'
import { userState } from '@/enum/user-enum'
import { PROJECT_TITLE } from '../../config'

@Component
@http
export default class TopBar extends Vue {
  private dialog = false
  private titleState = false
  private userMenuState = false
  private userInfoObj = rootStoreModule.UserState
  private PROJECT_TITLE = PROJECT_TITLE

  get username(): string {
    return '用户：' + rootStoreModule.UserState.username
  }

  get userName(): string {
    return '用户姓名：' + rootStoreModule.UserState.userMessage.loginName
  }

  get userType(): string {
    return '用户类型：' + rootStoreModule.UserState.userMessage.userTypeName
  }

  get userStatus(): string {
    if (rootStoreModule.UserState.userMessage.userState) {
      return `用户状态：${userState[rootStoreModule.UserState.userMessage.userState]}`
    } else {
      return '用户状态：' + '无'
    }
  }

  get usersysName(): string {
    const data = JSON.parse(sessionStorage.systemInfo)
    let name = ''
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === rootStoreModule.UserState.userMessage.systemName) {
        name = data[i].name
      }
    }
    return `系统名称：${name}`
  }

  get userToken(): string {
    return '用户Token：' + rootStoreModule.UserState.userMessage.userToken
  }

  clicklLogout(): void {
    // 清除vuex 的状态
    rootStoreModule.logout()
    // 页面跳转
    this.$router.replace({
      path: '/login'
    })
  }

  userMenu = [{ title: '注销', clickMethod: this.clicklLogout }]

  created(): void {
    setTimeout(() => {
      this.titleState = true
      this.userMenuState = true
    }, 1000)
  }
}
</script>

<style scoped>
#topbar {
  width: 100%;
}
.userMenu {
  position: absolute;
  right: 50px;
  top: -15px;
}
.titleshadow {
  width: 100%;
  height: 50px;
  text-align: center;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, #fff),
    color-stop(0.4, #fff),
    color-stop(0.5, rgb(255, 172, 20)),
    color-stop(0.6, #fff),
    color-stop(1, #fff)
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: animate 3s infinite;
}
@keyframes animate {
  from {
    background-position: -500px;
  }
  to {
    background-position: 500px;
  }
}
</style>
