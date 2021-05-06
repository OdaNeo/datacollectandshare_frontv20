<template>
  <v-row no-gutters>
    <!-- 用户名 -->
    <HSimpleInput
      v-model="formProvide.formObj['loginName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('用户名')]"
      :description="`用户名`"
    />

    <!-- 密码 -->
    <HSimpleInput
      v-if="!formProvide.formObj.canNotEdit"
      v-model="formProvide.formObj['loginPwd']"
      :rules="[...h_validator.noEmpty('密码'), ...h_validator.passwordRules()]"
      :description="`密码`"
    />

    <!-- 修改密码 -->
    <HSimpleInput
      v-if="formProvide.formObj.canNotEdit"
      :disabled="!formProvide.formObj.canEditPassword"
      :placeholder="passwordPlaceholder"
      :required="false"
      v-model="formProvide.formObj['newLoginPwd']"
      :rules="[...h_validator.passwordRules(), ...pwv]"
      @input="handelPwv"
      :description="`修改密码`"
    />

    <!-- 再次输入密码 -->
    <HSimpleInput
      v-if="formProvide.formObj.canNotEdit"
      :disabled="!formProvide.formObj.canEditPassword"
      :placeholder="passwordPlaceholder"
      :required="false"
      v-model="formProvide.formObj['newLoginPwd2']"
      :rules="[...h_validator.passwordRules(), ...pwv]"
      @input="handelPwv"
      :description="`再次输入密码`"
    />

    <!-- 用户类型 -->
    <HSelect
      :description="`用户类型`"
      label="请选择用户类型"
      v-model="formProvide.formObj['userType']"
      :rules="[...h_validator.noEmpty('用户类型')]"
      :items="userRoots"
    />

    <!-- 用户状态 -->
    <HRadioGroup
      :description="`用户状态`"
      v-model="formProvide.formObj['userState']"
      :rules="[...h_validator.noEmpty('用户状态')]"
      :items="userStates"
    />

    <!-- 系统名称 -->
    <HSelect
      :description="`系统名称`"
      label="请选择系统名称"
      v-model="formProvide.formObj['systemName']"
      :rules="[...h_validator.noEmpty('系统名称')]"
      :items="systemNames"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import { userFormVar } from '@/type/user.type'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HRadioGroup from '@/components/h-radio-group.vue'
import HSelect from '@/components/h-select.vue'
@Component({
  components: {
    HSimpleInput,
    HRadioGroup,
    HSelect
  }
})
@Validator(['noEmpty', 'passwordRules'])
export default class userDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private userRoots!: Array<userFormVar>
  @Prop() private systemNames!: Array<userFormVar>

  private pwv: string[] = []

  private get passwordPlaceholder() {
    const bo = this.formProvide.formObj.canEditPassword
    if (bo) {
      return ``
    } else {
      return `该用户类型没有修改密码权限`
    }
  }

  private userStates: Array<userFormVar> = [
    { text: '正常', value: '1' },
    { text: '锁定', value: '2' },
    { text: '删除', value: '0' }
  ]

  private handelPwv() {
    const pw1 = this.formProvide.formObj.newLoginPwd
    const pw2 = this.formProvide.formObj.newLoginPwd2
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
