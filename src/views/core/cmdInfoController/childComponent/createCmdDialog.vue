<template>
  <v-row id="createCmdDialog">
    <!-- 弹框 展示数据结 -->
    <v-dialog v-model="showConstruction" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">数据发送示例</v-card-title>

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
        :disabled="formProvide.formObj.canNotEdit"
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
        :disabled="formProvide.formObj.canNotEdit"
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
    <div style="width: 100%; max-height: 200px; overflow-y: auto; overflow-x: hidden">
      <div v-for="(item, index) in formProvide.formObj.consumersObj" style="display: flex; flex: 1" :key="index">
        <v-col cols="9" style="padding: 0" class="input-item">
          <v-text-field
            single-line
            outlined
            clearable
            dense
            height="32"
            class="dialogInput"
            @input="vilidata(item.val)"
            v-model="item.val"
            :rules="[...h_validator.cmdConsumersVilidata(item.val), ...cmdRepeat]"
            required
          >
            <template v-slot:prepend>
              <div class="text-label" v-if="index === 0">
                <label><span class="require-span">*</span>订阅系统名：</label>
              </div>
              <div class="text-label" v-else>
                <p></p>
                <label></label>
              </div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="2" class="input-item">
          <v-btn fab dark small color="error" class="add-btn" v-if="(formProvide.formObj.consumersObj.length !== index + 1 || index != 0) && !item.disabled" @click="minus(index)">
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
          <v-btn fab dark small color="indigo" class="add-btn" v-if="formProvide.formObj.consumersObj.length === index + 1" @click="add()">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </div>
    </div>
    <v-col cols="9" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.description"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label>描述</label>
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
import alertUtil from '../../../../utils/alertUtil'

@Component
@http
@validator(['cmdNameVilidata', 'cmdProducerVilidata', 'cmdConsumersVilidata'])
export default class CreateCmdDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private cmdName: string = ''
  private producer: string = ''
  private consumers: string = ''

  private consumersObj: Array<{ val: any }> = []

  private description: string = ''
  private showConstruction: boolean = false

  private cmdRepeat: Function[] = []

  private clearMethod() {
    this.formProvide.formObj = {
      id: '',
      canNotEdit: false, // 添加数据
      cmdName: '', // 命令名称
      producer: '', // 生产系统名
      consumers: '', // 订阅系统名
      description: '', // 描述,
      consumersObj: [{ val: '' }],
      topicList: []
    }
  }

  // 数据示例
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

  private add() {
    // 增加数据结构
    ;(this.formProvide.formObj.consumersObj as Array<{ val: any }>).push({
      val: ''
    })
  }
  private minus(num: number) {
    // 删减数据结构
    ;(this.formProvide.formObj.consumersObj as Array<{ val: any }>).splice(num, 1)
  }

  private vilidata(val: string | number) {
    const _consumers = []
    const _consumersObj = this.formProvide.formObj.consumersObj as Array<{ val: any }>

    for (let i = 0; i < _consumersObj.length; i++) {
      if(_consumersObj[i].val){
        _consumers.push(_consumersObj[i].val)
      }
    }

    console.log(_consumers)

    if (_consumers.indexOf(val)!==_consumers.lastIndexOf(val)) {
      alertUtil.open('订阅系统名"' + val + '"已存在', true, 'error')
    } else {
      alertUtil.close()
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
