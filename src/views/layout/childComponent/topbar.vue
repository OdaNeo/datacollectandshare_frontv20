<template>
  <div id="topbar">
    <v-row align="center" no-gutters>
      <v-col cols="12" align-self="center">
        <div class="titleShadow">
          <span @click="handleNavRouter">{{ PROJECT_TITLE }}</span>
          <span class="subTitle">版本：{{ PROJECT_SUB_TITLE }}</span>
        </div>
        <v-row class="userMenu">
          <v-menu
            left
            offset-y
            bottom
            max-width="200px"
            min-width="200px"
            rounded
            attach
            :close-on-content-click="true"
          >
            <template v-slot:activator="{ on }">
              <div class="userMenuBtn" v-on="on">
                <v-avatar color="white" size="30" class="ml-4">
                  <v-icon size="22">{{ mdiAccount }}</v-icon>
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
                  <div class="btn">
                    <v-btn color="primary" depressed rounded text @click="updatePassword">修改密码</v-btn>
                    <v-btn color="error" depressed rounded text @click="clickLogout">注销</v-btn>
                  </div>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </v-row>
      </v-col>
    </v-row>
    <!-- 修改密码弹框 -->
    <HDialog v-if="dialogFlag" v-model="dialogFlag">
      <UpdatePassword v-if="fDialogFlag === 1" />
    </HDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { rootStoreModule } from '@/store/modules/root'
import { userState } from '@/enum/user-enum'
import { PROJECT_TITLE, PROJECT_SUB_TITLE } from '../../../../config'
import { mdiAccount } from '@mdi/js'
import util from '@/decorator/utilsDecorator'
import HDialog from '@/components/h-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import { updateUserPassword } from '@/type/user.type'
import UpdatePassword from './updatePassword.vue'
import http from '@/decorator/httpDecorator'
import { returnType } from '@/type/http-request.type'
@Component({
  components: {
    HDialog,
    UpdatePassword
  }
})
@util
@http
export default class TopBar extends Vue {
  @Provide('formProvide') private formProvide: FormObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {}
      }
    }
  })
  private userInfoObj = rootStoreModule.UserState
  private mdiAccount = mdiAccount
  private dialogFlag = false
  private fDialogFlag = 0

  private PROJECT_TITLE = PROJECT_TITLE
  private PROJECT_SUB_TITLE = PROJECT_SUB_TITLE

  private get username(): string {
    return rootStoreModule.UserState.username
  }

  private get userName(): string {
    return '用户姓名：' + rootStoreModule.UserState.userMessage.loginName
  }

  private get userType(): string {
    return '用户类型：' + rootStoreModule.UserState.userMessage.userTypeName
  }

  private get userStatus(): string {
    if (rootStoreModule.UserState.userMessage.userState) {
      return `用户状态：${userState[rootStoreModule.UserState.userMessage.userState]}`
    } else {
      return '用户状态：' + '无'
    }
  }

  private get userSysName(): string {
    if (sessionStorage.systemInfo) {
      const data = JSON.parse(sessionStorage.systemInfo)
      let name = ''
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === rootStoreModule.UserState.userMessage.systemName) {
          name = data[i].name
        }
      }
      return `系统名称：${name}`
    } else {
      return `系统名称： -`
    }
  }

  private get userToken(): string {
    return '用户Token：' + rootStoreModule.UserState.userMessage.userToken
  }

  private clickLogout(): void {
    this.h_utils.lib.logout()
  }

  // 修改密码
  private updatePassword() {
    this.formProvide.title = '修改个人密码'
    this.formProvide.methodName = 'handleUpdate'
    this.formProvide.btnName = [`立即修改`]
    this.formProvide.formObj = {}
    this.dialogFlag = true
    this.fDialogFlag = 1
  }
  // handle
  private async handleUpdate(formObj: updateUserPassword) {
    console.log(formObj)
    const { oldPass, passWord1, passWord2 } = formObj
    const { success }: returnType = await this.h_request['httpPOST']('POST_USER_UPDATEPASSWORD', {
      oldPass,
      passWord1,
      passWord2
    })
    console.log(success)
    if (success) {
      this.h_utils['alertUtil'].open('密码修改成功', true, 'success')
      return Promise.resolve(true)
    }
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
.subTitle {
  padding-left: 40px;
  font-size: 18px;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}
</style>
