<template>
  <div id="topbar">
    <v-row align="center" no-gutters>
      <v-col cols="12" align-self="center">
        <span class="titleShadow" @click="$router.push('/statePage/welcome')">{{ PROJECT_TITLE }}</span>

        <v-row class="userMenu">
          <v-menu left offset-y bottom max-width="200px" min-width="200px" rounded attach>
            <template v-slot:activator="{ on }">
              <div class="userMenuBtn" v-on="on">
                <v-avatar color="white" size="30" class="ml-4">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <div class="userName">{{ username }}</div>
              </div>
            </template>
            <v-card>
              <v-list-item-content class="justify-center py-1">
                <div style="width: 100%">
                  <div class="user">{{ userName }}</div>
                  <div class="user">{{ userType }}</div>
                  <div class="user">{{ userStatus }}</div>
                  <div class="user">{{ usersysName }}</div>
                  <div class="user">{{ userToken }}</div>

                  <v-divider class="my-1"></v-divider>
                  <v-btn
                    color="error"
                    style="display: block; margin: auto"
                    depressed
                    rounded
                    text
                    @click.stop="clicklLogout"
                    >注销</v-btn
                  >
                </div>
              </v-list-item-content>
            </v-card>
            <!-- <v-list subheader>
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
            </v-list> -->
          </v-menu>
        </v-row>
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
  // private dialog = false
  // private titleState = false
  // private userMenuState = false
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

  // userMenu = [{ title: '注销', clickMethod: this.clicklLogout }]

  // created(): void {
  // setTimeout(() => {
  // this.titleState = true
  // this.userMenuState = true
  // }, 1000)
  // }
}
</script>

<style scoped>
#topbar {
  width: 100%;
}
.user {
  line-height: 28px;
  font-size: 15px;
  white-space: wrap;
  padding: 10px 15px 5px 18px;
}
.userMenu {
  position: absolute;
  right: 18px;
  top: 12px;
  height: 100%;
}
.userMenuBtn {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 160px;
  height: 100%;
}
.userName {
  margin-left: 18px;
  color: #fff;
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
