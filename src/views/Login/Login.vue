<template>
  <div id="login">
    <div class="bgImg">
      <div class="loginContent">
        <div class="loginTitle">交控科技天枢平台元数据管理中心</div>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rootStoreModule } from '../../store/modules/root'
import http from '../../decorator/httpDecorator'
import { returnDataType } from '../../type/http-request.type'
import { userAndPassType } from '../../type/login.type'

@Component
@http
export default class Login extends Vue {
  valid = false
  username = ''
  showPass = false
  password = ''
  remember = false
  userRules: Array<Function> = [(u: string): string | boolean => !!u || '用户名不能为空']
  passRules: Array<Function> = [(p: string): string | boolean => !!p || '密码不能为空']

  // 登录方法
  async signIn(): Promise<void> {
    if ((this.$refs.form as HTMLFormElement).validate()) {
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
  width: 400px;
  height: 370px;
  position: absolute;
  background: #fff;
  box-shadow: -2px 2px 8px #333;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.loginInput {
  width: 100%;
  height: 300px;
  color: #fff;
}
</style>
