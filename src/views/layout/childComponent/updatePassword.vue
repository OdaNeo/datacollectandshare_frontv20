<template>
  <v-row no-gutters>
    <!-- 旧密码 -->
    <HSimpleInput
      v-model="formProvide.formObj['oldPass']"
      :rules="[...h_validator.noEmpty('旧密码')]"
      :description="`旧密码`"
    />

    <!-- 修改密码 -->
    <HSimpleInput
      v-model="formProvide.formObj['passWord1']"
      :rules="[...h_validator.noEmpty('新密码'), ...h_validator.passwordRules(), ...pwv]"
      @input="handelPwv"
      :description="`修改密码`"
    />

    <!-- 再次输入密码 -->
    <HSimpleInput
      v-model="formProvide.formObj['passWord2']"
      :rules="[...h_validator.noEmpty('新密码'), ...h_validator.passwordRules(), ...pwv]"
      @input="handelPwv"
      :description="`再次输入密码`"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
@Component({
  components: {
    HSimpleInput
  }
})
@Validator(['noEmpty', 'passwordRules'])
export default class updatePassword extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private pwv: string[] = []

  private handelPwv() {
    const pw1 = this.formProvide.formObj.passWord1
    const pw2 = this.formProvide.formObj.passWord2
    if (!pw1 && !pw2) {
      // 如果 没有输入密码，直接返回
      this.pwv = []
      return
    } else if (!pw1 || !pw2) {
      this.pwv = [`请再次输入密码`]
      return
    }

    pw1 === pw2 ? (this.pwv = []) : (this.pwv = ['两次输入的密码不同'])
  }
}
</script>
