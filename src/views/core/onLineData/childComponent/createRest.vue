<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
        class="ml-4 mr-15"
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
      ></v-text-field>
    </v-col>
    <!-- 消息类型 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>消息类型</label>
      <v-radio-group
        v-model="formProvide.formObj['queneType']"
        :disabled="formProvide.formObj.canNotEdit"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('消息类型')]"
        class="ml-4 my-0 pt-0 flex-grow-1"
      >
        <v-radio v-for="n in queneTypeItem" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>
    <!-- 内存过期时间 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">内存过期时间</label>
      <v-slider
        v-model="formProvide.formObj['redisTimer']"
        :disabled="formProvide.formObj.canNotEdit"
        class="align-center ml-4 mb-4 mr-15"
        :max="30"
        :min="5"
        hide-details
        :thumb-size="20"
        thumb-label="always"
      >
      </v-slider>
    </v-col>
    <!-- 数据结构 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>数据结构</label>
      <div class="ml-4">
        <v-row
          class="d-flex justify-space-between"
          no-gutters
          v-for="(item, index) in formProvide.formObj['topicList']"
          :key="item.id"
        >
          <v-col class="mr-2">
            <v-text-field
              v-model="item.key"
              dense
              outlined
              :disabled="item.disabled"
              label="字段名"
              :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col class="mr-2">
            <v-text-field
              v-model="item.description"
              dense
              :disabled="item.disabled"
              outlined
              label="描述"
              :rules="[...h_validator.noEmpty('描述')]"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="item.type"
              dense
              outlined
              :disabled="item.disabled"
              label="字段类型"
              :rules="[...h_validator.noEmpty('字段类型')]"
              height="34"
              :items="items2"
            ></v-select>
          </v-col>
          <!-- 按钮 -->
          <v-col class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
            <v-btn
              v-if="formProvide.formObj['topicList'].length === index + 1"
              fab
              dark
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="add"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-if="!item.disabled && formProvide.formObj['topicList'].length > 1"
              fab
              dark
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="minus(index, item.disabled)"
            >
              <v-icon dark>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <!-- 数据发送示例 -->
    <v-col cols="12" class="d-flex mb-5">
      <label class="label mr-6">数据发送示例</label>
      <v-btn color="grey" outlined @click="showConstruction = true">查看</v-btn>
    </v-col>

    <v-dialog v-model="showConstruction" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">数据发送示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p style="white-space: pre-wrap">
            {{ msgSendExample }}
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showConstruction = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col v-if="!formProvide.formObj.canNotEdit" cols="12" class="d-flex justify-space-around">
      <label class="label mr-5">通过文件创建</label>
      <v-file-input
        class="mt-0 pt-0 mr-12"
        label="支持.xls, .xlsx格式的单文件上传"
        clearable
        accept=".xls,.xlsx"
        @change="$emit('upload-file', $event)"
      ></v-file-input>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component
@http
@Validator(['noEmpty', 'topicNameFormatter'])
export default class CreateRest extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []
  private noRepeatKey: string[] = []
  private queneTypeItem = [
    { text: '数据量优先', value: 1 },
    { text: '顺序优先', value: 2 }
  ]
  private items2 = [
    { text: 'Int', value: 1 },
    { text: 'String', value: 'str' },
    { text: 'Date', value: 'Date' },
    { text: 'TimeStamp', value: 'TimeStamp' }
  ]

  private showConstruction = false

  private get msgSendExample() {
    const topicList = this.formProvide.formObj.topicList as Array<{ type: string; key: string }>
    let msg: any = {}

    topicList.forEach((element: any) => {
      msg[element.key] = element.type
    })
    return JSON.stringify(
      {
        requestid: new Date().getTime(),
        data: [msg]
      },
      null,
      '\t'
    )
  }

  // add
  private add() {
    this.formProvide.formObj['topicList'].push({
      ['key']: '',
      ['description']: '',
      ['type']: '',
      disabled: false
    })
  }
  // minus
  private minus(index: number, bo: boolean) {
    if (bo) {
      // disable 不能修改
      return
    } else {
      this.formProvide.formObj['topicList'].splice(index, 1)
    }
  }

  // validation topicList no-repeat-key
  @Watch('formProvide.formObj.topicList', { deep: true })
  private handleKeyNoRepeat(val: Array<any>) {
    let _L: Array<string> = []
    let _l: Array<string> = []
    val.forEach(item => {
      if (item.key && !_l.includes(item.key)) {
        _l.push(item.key)
      }
      if (item.key) {
        _L.push(item.key)
      }
    })
    if (_L.length > _l.length) {
      this.noRepeatKey = ['字段名不能重复']
    } else {
      this.noRepeatKey = []
    }
  }
}
</script>
