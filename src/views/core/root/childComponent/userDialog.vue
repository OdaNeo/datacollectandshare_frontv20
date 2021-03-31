<template>
  <v-row no-gutters>
    <!-- 用户名 -->
    <HSimpleInput
      v-model="formProvide.formObj['loginName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('用户名'), ...noRepeat]"
      @input="loginNameNoRepeat"
      :description="`用户名`"
    />
    <!-- 密码 -->
    <HSimpleInput
      v-if="!formProvide.formObj.canNotEdit"
      v-model="formProvide.formObj['loginPwd']"
      :rules="[...h_validator.noEmpty('密码')]"
      :description="`密码`"
    />

    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>用户类型</label>
      <v-select
        v-model="formProvide.formObj['userType']"
        outlined
        dense
        height="34"
        :loading="userRoots.length === 0"
        label="请选择用户类型"
        :items="userRoots"
        :rules="[...h_validator.noEmpty('用户类型')]"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>用户状态</label>
      <v-radio-group
        v-model="formProvide.formObj['userState']"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('用户状态')]"
        class="ml-4 my-0 pt-0 flex-grow-1 mr-15"
      >
        <v-radio v-for="n in userStates" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>系统名称</label>
      <v-select
        v-model="formProvide.formObj['systemName']"
        outlined
        dense
        :loading="userRoots.length === 0"
        height="34"
        label="请选择系统名称"
        :items="systemNames"
        :rules="[...h_validator.noEmpty('系统名称')]"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { userFormVar } from '@/type/user.type'
import http from '@/decorator/httpDecorator'
import { returnType } from '@/type/http-request.type'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
@http
@Component({
  components: {
    HSimpleInput
  }
})
@Validator(['noEmpty'])
export default class userDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private userStates: Array<userFormVar> = [
    { text: '正常', value: '1' },
    { text: '锁定', value: '2' },
    { text: '删除', value: '0' }
  ]
  private userRoots: Array<userFormVar> = []
  private systemNames: Array<userFormVar> = []
  private noRepeat: Array<string> = []
  // private editDialog = false
  private timer = 0

  private getUserRoot(data: Array<{ name: string; id: number }>) {
    this.userRoots = data.map((s: { name: string; id: number }) => {
      return {
        text: s.name,
        value: s.id.toString()
      }
    })
  }
  private getSystemName(data: Array<{ name: string; id: number }>) {
    this.systemNames = data.map((s: { name: string; id: number }) => {
      return {
        text: s.name,
        value: s.id.toString()
      }
    })
  }

  private async httpAll() {
    const [{ data: data1 }, { data: data2 }]: Array<returnType> = await this.h_request['httpAll']([
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

    data1 && this.getUserRoot(data1)
    data2 && this.getSystemName(data2)
  }

  private async loginNameNoRepeat(val: string) {
    if (val === undefined) {
      return
    }

    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      const { data } = await this.h_request['httpGET']('GET_USER_FIND_ALL_USER_BY_PARAM', { loginName: val })
      if (data?.list?.length > 0) {
        this.noRepeat = ['用户名重复']
      } else {
        this.noRepeat = []
      }
    }, 150)
  }

  created(): void {
    this.httpAll()
  }
}
</script>
