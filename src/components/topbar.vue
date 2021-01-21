<template>
  <div id="topbar">
    <v-row align="center" no-gutters>
      <v-col cols="12" align-self="center">
        <h1 class="titleshadow">{{ PROJECT_TITLE }}</h1>

        <div class="userMenu" v-show="userMenuState">
          <v-menu offset-y transition="slide-x-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-container class="mt-1 userAvatar">
                <v-avatar v-bind="attrs" v-on="on" color="white" size="30">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </v-container>
            </template>
            <v-list subheader>
              <v-list-item>
                <v-list-item-title>
                  <v-dialog v-model="dialog" width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <div dark v-bind="attrs" v-on="on">个人信息</div>
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
                        <v-btn color="primary" text @click="dialog = false">确定</v-btn>
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
        <div class="userName">
          {{ username }}
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
import { PROJECT_TITLE } from '@/config'

@Component
@http
export default class TopBar extends Vue {
  private dialog = false
  private titleState = false
  private userMenuState = false
  private userInfoObj = rootStoreModule.UserState
  private PROJECT_TITLE = PROJECT_TITLE

  get username(): string {
    return rootStoreModule.UserState.username
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
    // setTimeout(() => {
    this.titleState = true
    this.userMenuState = true
    // }, 1000)
  }
}
</script>

<style scoped>
#topbar {
  width: 100%;
}
.userAvatar {
  cursor: pointer;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute;
  right: 150px;
  top: 14px; */
}
.userMenu {
  position: absolute;
  right: 150px;
  top: -2px;
}
.userName {
  position: absolute;
  width: 100px;
  right: 70px;
  top: 17px;
  color: #fff;
}
.titleshadow {
  width: 100%;
  line-height: 50px;
  color: #fff;
  font-size: 30px;
  /* background: -webkit-gradient(
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
  animation: animate 3s infinite; */
}
/* @keyframes animate {
  from {
    background-position: -500px;
  }
  to {
    background-position: 500px;
  }
} */
</style>
