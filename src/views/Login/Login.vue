<template>
  <div id="login">
    <div class="bgImg">
      <v-card class="loginContent">
        <v-card-title class="headline grey lighten-2 pt-12 pl-6" style="color: #1976d2">{{
          PROJECT_TITLE
        }}</v-card-title>

        <v-form v-model="userDialogValid">
          <v-row class="mt-12">
            <v-col cols="12" class="d-flex justify-space-around py-1">
              <label class="label"><span class="require-span">*</span>用户名：</label>
              <v-text-field
                v-model="username"
                outlined
                dense
                clearable
                class="ml-4 mr-12"
                append-icon="mdi-account"
                :rules="[v => !!v || '用户名不能为空']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-space-around py-1">
              <label class="label"><span class="require-span">*</span>密码：</label>
              <v-text-field
                v-model="password"
                outlined
                dense
                clearable
                class="ml-4 mr-12"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                :rules="[v => !!v || '密码不能为空']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions class="pt-4">
          <v-switch class="mt-0 pt-0 ml-12" v-model="remember" label="记住账号" color="primary" hide-details></v-switch>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" class="px-8 mr-10" @click.stop="signIn" :disabled="!userDialogValid"
            >登录</v-btn
          >
        </v-card-actions>
      </v-card>
      <!--  -->
      <!-- <div class="loginContent2">
        <div class="loginTitle">{{ PROJECT_TITLE }}</div>
        <v-row justify="center">
          <v-col cols="11">
            <div class="loginInput">
              <v-form ref="form" lazy-validation>
                <v-text-field
                  v-model="username"
                  label="用户名"
                  required
                  color="#17a0df"
                  prepend-inner-icon="mdi-account"
                  :rules="userRules"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="密码"
                  required
                  color="#17a0df"
                  prepend-inner-icon="mdi-lock"
                  :type="showPass ? 'text' : 'password'"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPass = !showPass"
                  :rules="passRules"
                ></v-text-field>
                <v-checkbox v-model="remember" label="记住账号" required></v-checkbox>
                <v-btn :disabled="valid" width="100%" color="primary" class="mr-4" @click="signIn">登录</v-btn>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rootStoreModule } from '@/store/modules/root'
import http from '@/decorator/httpDecorator'
import { returnDataType } from '@/type/http-request.type'
import { userAndPassType } from '@/type/login.type'
import HInput from '@/components/h-input.vue'
import { PROJECT_TITLE } from '@/config'

@Component({
  components: {
    HInput
  }
})
@http
export default class Login extends Vue {
  PROJECT_TITLE = PROJECT_TITLE

  private userDialogValid = true
  private showPass = false

  private username = ''
  private password = ''
  private remember = false

  // 登录方法
  async signIn(): Promise<void> {
    if (this.remember && !localStorage.getItem('userAndPass')) {
      localStorage.setItem('userAndPass', JSON.stringify({ user: this.username, pass: this.password }))
    } else if (this.remember && localStorage.getItem('userAndPass')) {
      localStorage.removeItem('userAndPass')
    }

    const result: returnDataType = await this.h_request.httpPOST<userAndPassType>('POST_LOGIN_LOGIN', {
      username: this.username,
      password: this.password
    })
    // userinfo
    const username = this.username
    const bool: boolean = await rootStoreModule.login({ username, result })
    // systemInfo
    const { data } = await this.h_request.httpGET('GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER', {})
    sessionStorage.systemInfo = JSON.stringify(data)
    if (bool) {
      this.$router.replace({
        path: '/statePage/welcome'
      })
    }
  }
}
</script>

<style scoped>
#login {
  width: 100%;
  height: 100%;
}
.bgImg {
  width: 100%;
  height: 100%;
  background: url(../../assets/image/loginBg.jpg) no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
}
.loginTitle {
  font-size: 24px;
  color: #17a0df;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 15px;
}
.loginContent {
  width: 600px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.label {
  min-width: 125px;
  display: flex;
  justify-content: flex-end;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 42px;
}
.label-end {
  width: 80px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 42px;
}
</style>
