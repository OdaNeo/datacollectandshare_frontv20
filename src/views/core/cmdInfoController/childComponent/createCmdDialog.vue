<template>
  <v-row id="createCmdDialog">
    <!-- 弹框 展示数据结 -->
    <v-dialog v-model="showConstruction" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> 数据发送示例 </v-card-title>

        <v-card-text>
          <p style="padding-top: 20px; white-space: pre-wrap">
            {{ msgSendExample }}
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showConstruction = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="9" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.cmdName"
        :rules="[...h_validator.cmdNameVilidata(), ...cmdRepeat]"
        @input="inputEvent(formProvide.formObj.cmdName, formProvide.formObj.producer)"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>命令名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="9" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.producer"
        :rules="[...h_validator.cmdProducerVilidata(), ...cmdRepeat]"
        @input="inputEvent(formProvide.formObj.cmdName, formProvide.formObj.producer)"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>生产系统名：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="9" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.consumers"
        :rules="[...h_validator.cmdConsumersVilidata(), ...cmdRepeat]"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>订阅系统名：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="9" style="padding: 0">
      <v-radio-group single-line outlined dense class="dialogInput" height="32" row required>
        <template v-slot:prepend>
          <div class="text-label" style="margin-top: 7px">
            <label><span class="require-span"></span>数据发送示例：</label>
          </div>
        </template>
        <v-btn solo @click.native="showConstruction = true">查看</v-btn>
      </v-radio-group>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import http from '../../../../decorator/httpDecorator'
import validator from '../../../../decorator/validatorDecorator'
import { H_Vue } from '../../../../declaration/vue-prototype'

@Component
@http
@validator(['cmdNameVilidata', 'cmdProducerVilidata', 'cmdConsumersVilidata'])
export default class CreateCmdDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private cmdName: string = ''
  private producer: string = ''
  private consumers: string = ''

  private messageType: string = ''
  private bool: boolean = false
  private showConstruction: boolean = false

  private cmdRepeat: Function[] = []

  private clearMethod() {
    this.formProvide.formObj = {
      canNotEdit: false, // 添加数据
      cmdName: '', // 命令名称
      messageType: '', // 消息类型
    }
  }

  private get msgSendExample() {
    let msg: any = {}
    return JSON.stringify(
      {
        'requestid': new Date().getTime(),
        'data': [msg]
      },
      null,
      '\t'
    )
  }

  private async inputEvent(v: string, p: string) {
    // producer cmdName都有，才发送数据
    if (v && v != '' && p && p != '') {
      console.log(1)
      const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
        cmdName: v,
        producer: p
      })
      if (success) {
        this.cmdRepeat = [(v: string) => '命令名称已被注册']
      } else {
        this.cmdRepeat = []
      }
    } else {
      this.cmdRepeat = []
    }
  }
}
</script>

<style scoped>
.text-label {
  width: 130px;
  display: inline-block;
  text-align: right;
}
.text-label p {
  color: red;
}
.btn-line {
  padding-bottom: 20px;
}
.btn-line .v-btn {
  margin-right: 10px;
}
.input-item {
  margin-right: 6px;
  padding: 0;
}
.add-btn {
  width: 30px;
  height: 30px;
  margin-right: 4px;
}
.text-label-line {
  width: 130px;
  display: inline-block;
  box-sizing: border-box;
  padding-right: 14px;
  font-size: 16px;
  text-align: right;
  color: #000;
}
.text-label-line label {
  font-size: 16px;
}
.require-span {
  color: red;
  margin-right: 4px;
}
.dialogInput .v-input__slot {
  box-shadow: 2px 2px 10px #dddddd !important;
}
</style>
