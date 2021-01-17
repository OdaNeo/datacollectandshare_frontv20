<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import { userFormVar } from '@/type/user.type'
import http from '@/decorator/httpDecorator'
import { returnDataType, httpAllParams } from '@/type/http-request.type'
import { H_Vue } from '@/declaration/vue-prototype'

@http
@Component({
  components: {
    HInput
  }
})
export default class userDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private userStates: Array<userFormVar> = [
    { text: '正常', value: '1' },
    { text: '锁定', value: '2' },
    { text: '删除', value: '0' }
  ]
  private userRoots: Array<userFormVar> = []
  private systemNames: Array<userFormVar> = []

  private formTypeObj: Array<InputType> = [
    {
      label: '用户名',
      valueName: 'loginName',
      type: 'input',
      require: true
    },
    {
      label: '密码',
      valueName: 'loginPwd',
      type: 'input',
      require: true
    },
    {
      label: '用户类型',
      valueName: 'userType',
      type: 'select',
      items: [],
      require: true
    },
    {
      label: '用户状态',
      valueName: 'userState',
      type: 'radioGroup',
      items: this.userStates,
      require: true
    },
    {
      label: '系统名称',
      valueName: 'systemName',
      type: 'select',
      items: [],
      require: true
    }
  ]

  private getUserRoot({ data }: returnDataType) {
    this.userRoots = data.map((s: { name: string; id: number }) => {
      return {
        text: s.name,
        value: s.id.toString()
      }
    })
    // 响应式更新
    this.formTypeObj[2].items = this.userRoots.concat([])
  }
  private getSystemName({ data }: returnDataType) {
    this.systemNames = data.map((s: { name: string; id: number }) => {
      return {
        text: s.name,
        value: s.id.toString()
      }
    })
    // 响应式更新
    this.formTypeObj[4].items = this.systemNames.concat([])
  }

  private async httpAll() {
    const results = await this.h_request['httpAll']<httpAllParams>([
      {
        name: 'GET_USER_ADDUSER_FIND_ALL_ROLE',
        method: 'get',
        data: {}
      },
      {
        name: 'GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER',
        method: 'get',
        data: {}
      }
    ])
    this.getUserRoot(results[0])
    this.getSystemName(results[1])
  }
  created(): void {
    this.httpAll()
    // 编辑页面没有密码项，不能编辑用户名
    if (this.formProvide.formObj.loginName) {
      this.formTypeObj[0].disabled = true
      this.$set(this.formTypeObj, 1, {})
    }
  }
}
</script>
