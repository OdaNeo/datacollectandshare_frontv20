<template>
  <v-row id="createCmdDialog" no-gutters>
    <!-- 弹框 展示数据结 -->
    <v-dialog v-model="showConstruction" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">Body示例</v-card-title>
        <v-card-text>
          <p style="padding-top: 20px; white-space: pre-wrap">
            <span
              >{<br />
              "cmddata": "{/"cmdId/":/"900001/",/"cmdContent/":/"这是一条测试信息/"}"
              <br />}
            </span>
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showConstruction = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.cmdName"
        :rules="[...h_validator.cmdNameValidate(), ...cmdRepeat]"
        :disabled="formProvide.formObj.canNotEdit"
        @input="inputEvent(formProvide.formObj.cmdName, formProvide.formObj.producer)"
        required
      >
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span">*</span>命令名称：</label>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-text-field class="dialogInput" single-line outlined dense solo v-model="formProvide.formObj.producer" disabled>
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span">*</span>生产系统名：</label>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-radio-group row>
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span">*</span>订阅系统名：</label>
        </template>
      </v-radio-group>
      <v-row class="checkbox-container" justify="start">
        <v-checkbox
          required
          v-model="formProvide.formObj.consumers"
          :rules="[...h_validator.cmdConsumersValidate()]"
          v-for="item in systemList"
          :key="item.id"
          class="mx-2 checkbox-item"
          :label="item.name"
          :value="item.name"
        >
        </v-checkbox>
      </v-row>
    </v-col>
    <v-col cols="11">
      <v-text-field
        class="dialogInput"
        solo
        single-line
        outlined
        clearable
        dense
        v-model="formProvide.formObj.description"
      >
        <template v-slot:prepend>
          <label class="text-label">描述：</label>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-radio-group row>
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span"></span>Body示例：</label>
        </template>
        <v-btn solo @click.native="showConstruction = true">查看</v-btn>
      </v-radio-group>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import validator from '@/decorator/validatorDecorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
@http
@validator(['cmdNameValidate', 'cmdConsumersValidate'])
export default class CreateCmdDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private showConstruction = false
  private systemList: Array<{ name: string }> = []
  private cmdRepeat: Function[] = []

  private async inputEvent(v: string, p: string) {
    // producer cmdName都有，才发送数据
    if (v && p) {
      const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
        cmdName: v,
        producer: p
      })
      if (success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.cmdRepeat = [(v: string) => '命令名称已被注册']
      } else {
        this.cmdRepeat = []
      }
    } else {
      this.cmdRepeat = []
    }
  }

  private async getProducerList() {
    let data: Array<{ id: string; name: string }>
    this.systemList.length = 0

    if (sessionStorage.systemInfo) {
      data = JSON.parse(sessionStorage.systemInfo)
      for (let i = 0; i < data.length; i++) {
        this.systemList.push({ name: data[i].name })
      }
      return
    } else {
      const res = await this.h_request['httpGET']('GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER', {})
      data = res.data
      sessionStorage.systemInfo = JSON.stringify(data)
      for (let i = 0; i < data.length; i++) {
        this.systemList.push({ name: data[i].name })
      }
      return
    }
  }

  created(): void {
    this.getProducerList()
  }
}
</script>

<style scoped>
.checkbox-container {
  margin: -25px 0px 0px 150px;
}
.checkbox-item {
  min-width: 70px;
  height: 40px;
}
</style>
