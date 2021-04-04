<template>
  <div id="topbar">
    <v-row align="center" no-gutters>
      <v-col cols="12" align-self="center">
        <span class="titleShadow" @click="handleNavRouter">{{ PROJECT_TITLE }}</span>

        <v-row class="userMenu">
          <v-menu left offset-y bottom max-width="200px" min-width="200px" rounded attach>
            <template v-slot:activator="{ on }">
              <div class="userMenuBtn" v-on="on">
                <v-avatar color="white" size="30" class="ml-4">
                  <v-icon size="24">{{ mdiAccount }}</v-icon>
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
                  <div class="user">{{ userSysName }}</div>
                  <div class="user">{{ userToken }}</div>

                  <v-divider class="my-1"></v-divider>
                  <v-btn
                    color="error"
                    style="display: block; margin: auto"
                    depressed
                    rounded
                    text
                    @click.stop="clickLogout"
                    >注销</v-btn
                  >
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rootStoreModule } from '@/store/modules/root'
import { userState } from '@/enum/user-enum'
import { PROJECT_TITLE } from '../../../../config'
import { mdiAccount } from '@mdi/js'

@Component
export default class TopBar extends Vue {
  // private dialog = false
  // private titleState = false
  // private userMenuState = false
  private userInfoObj = rootStoreModule.UserState
  private mdiAccount = mdiAccount

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

  get userSysName(): string {
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

  clickLogout(): void {
    // 清除vuex 的状态
    rootStoreModule.logout()
    // 页面跳转
    this.$router.replace({
      path: '/login'
    })
  }
  private handleNavRouter() {
    this.$router.push('/statePage/welcome')
  }
}
</script>

<style scoped>
#topbar {
  width: 100%;
}

#topbar >>> .v-menu__content {
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 3%), 0px 8px 10px 1px rgb(0 0 0 / 3%), 0px 3px 14px 2px rgb(0 0 0 / 3%);
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
.titleShadow {
  position: fixed;
  cursor: pointer;
  color: #fff;
  font-size: 22px;
  font-weight: normal;
  letter-spacing: 4px;
  z-index: 7;
  top: 13px;
  left: 15px;
}
</style>
