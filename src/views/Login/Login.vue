<template>
  <div id="login">
    <div class="bgImg">
      <div class="loginContent">
        <p class="loginSubTitle">交控科技天枢平台</p>
        <p class="loginTitle">数据采集管理中心</p>

        <v-form v-model="userDialogValid">
          <label class="labelLogin">用户名：</label>
          <v-text-field v-model="username" dense color="white" class="my-4"></v-text-field>

          <label class="labelLogin">密码：</label>
          <v-text-field
            v-model="password"
            dense
            color="white"
            class="my-4"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPass ? 'text' : 'password'"
            @click:append="showPass = !showPass"
          ></v-text-field>
        </v-form>

        <v-switch class="mt-0 pt-3" dense v-model="remember" label="记住账号" color="white" hide-details></v-switch>
        <v-btn depressed color="primary" width="150" class="mt-10" @click.stop="signIn">登录</v-btn>
      </div>
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
import { PROJECT_TITLE } from '@/config'

@Component({})
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
    if (!this.username || !this.password) {
      return
    }
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
.bgImg::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to left, rgba(0, 21, 41, 0), rgba(0, 21, 41, 1));
}
#login >>> .v-icon.v-icon {
  font-size: 16px;
}
#login >>> input {
  -webkit-text-fill-color: #fff !important;
}

#login >>> .v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  color: #fff;
  font-size: 16px;
}

#login >>> .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: #fff;
}

#login >>> .theme--light.v-icon {
  color: #fff;
}

#login >>> .v-application .error--text {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
.loginContent {
  width: 400px;
  height: 400px;
  /* background-color: transparent !important; */
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  margin-left: 300px;
  color: #fff;
}
.loginSubTitle {
  font-style: italic;
  font-size: 18px;
  margin-bottom: 8px;
}
.loginTitle {
  font-style: italic;
  font-size: 38px;
  margin-bottom: 32px;
}
.labelLogin {
  color: #fff;
  font-size: 16px;
}
</style>
