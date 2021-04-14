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
      :rules="[...h_validator.noEmpty('密码')]"
      :description="`密码`"
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
@Validator(['noEmpty'])
export default class userDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private userRoots!: Array<userFormVar>
  @Prop() private systemNames!: Array<userFormVar>

  private userStates: Array<userFormVar> = [
    { text: '正常', value: '1' },
    { text: '锁定', value: '2' },
    { text: '删除', value: '0' }
  ]

  // private noRepeat: Array<string> = []
  // private editDialog = false
  // private timer = 0

  // private getUserRoot(data: Array<{ name: string; id: number }>) {
  //   this.userRoots = data.map((s: { name: string; id: number }) => {
  //     return {
  //       text: s.name,
  //       value: s.id.toString()
  //     }
  //   })
  // }
  // private getSystemName(data: Array<{ name: string; id: number }>) {
  //   this.systemNames = data.map((s: { name: string; id: number }) => {
  //     return {
  //       text: s.name,
  //       value: s.id.toString()
  //     }
  //   })
  // }

  // private async httpAll() {
  //   const [{ data: data1 }, { data: data2 }]: Array<returnType> = await this.h_request['httpAll']([
  //     {
  //       name: 'GET_USER_ADDUSER_FIND_ALL_ROLE',
  //       method: 'get',
  //       data: {}
  //     },
  //     {
  //       name: 'GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER',
  //       method: 'get',
  //       data: {}
  //     }
  //   ])

  //   data1 && this.getUserRoot(data1)
  //   data2 && this.getSystemName(data2)
  // }

  // private async loginNameNoRepeat(val: string) {
  //   if (val === undefined) {
  //     return
  //   }

  //   clearTimeout(this.timer)
  //   this.timer = setTimeout(async () => {
  //     const { data } = await this.h_request['httpGET']('GET_USER_FIND_ALL_USER_BY_PARAM', { loginName: val })
  //     if (data?.list?.length > 0) {
  //       this.noRepeat = ['用户名重复']
  //     } else {
  //       this.noRepeat = []
  //     }
  //   }, 150)
  // }

  // created(): void {
  //   this.httpAll()
  // }
}
</script>
