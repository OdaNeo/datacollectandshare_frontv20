<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
      :description="`主题名称`"
      v-topicNameNoRepeat="{
        set: n => {
          noRepeat = [...n]
        }
      }"
    />
    <!-- 消息类型 -->
    <HRadioGroup
      :description="`消息类型`"
      v-model="formProvide.formObj['queneType']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('消息类型')]"
      :items="queneTypeItem"
    />

    <!-- 内存过期时间 -->
    <HSlider
      v-model="formProvide.formObj['redisTimer']"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`内存过期时间`"
      :max="30"
      :min="5"
      :required="false"
    />

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
              placeholder="字段名"
              :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
              height="35"
            ></v-text-field>
          </v-col>
          <v-col class="mr-2">
            <v-text-field
              v-model="item.description"
              dense
              :disabled="item.disabled"
              outlined
              placeholder="描述"
              :rules="[...h_validator.noEmpty('描述')]"
              height="35"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="item.type"
              dense
              outlined
              :disabled="item.disabled"
              placeholder="字段类型"
              :rules="[...h_validator.noEmpty('字段类型')]"
              height="35"
              :items="items2"
            ></v-select>
          </v-col>
          <!-- 按钮 -->
          <v-col class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
            <v-btn
              v-if="formProvide.formObj['topicList'].length === index + 1"
              fab
              dark
              depressed
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="add"
            >
              <v-icon dark>{{ mdiPlus }}</v-icon>
            </v-btn>
            <v-btn
              v-if="!item.disabled && formProvide.formObj['topicList'].length > 1"
              fab
              dark
              depressed
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="minus(index, item.disabled)"
            >
              <v-icon dark>{{ mdiMinus }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <!-- 数据发送示例 -->
    <v-col cols="12" class="d-flex mb-5">
      <label class="label mr-6">数据发送示例</label>
      <v-btn color="grey" height="35" outlined @click="showConstruction = true">查看</v-btn>
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
    <!-- 文件上传 -->
    <HFileUpLoad
      v-if="!formProvide.formObj.canNotEdit"
      :required="false"
      :description="`通过文件创建`"
      placeholder="支持.xls, .xlsx格式的单文件上传"
      accept=".xls,.xlsx"
      @change="$emit('upload-file', $event)"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import http from '@/decorator/httpDecorator'
import { mdiPlus, mdiMinus } from '@mdi/js'
import HFileUpLoad from '@/components/h-file-upload.vue'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSlider from '@/components/h-slider.vue'
import HRadioGroup from '@/components/h-radio-group.vue'

@Component({
  components: {
    HFileUpLoad,
    HSimpleInput,
    HSlider,
    HRadioGroup
  }
})
@http
@Validator(['noEmpty', 'topicNameFormatter'])
export default class CreateRest extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private mdiPlus = mdiPlus
  private mdiMinus = mdiMinus
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

  // topicName 验重方法 用于上传文件
  public async handleTopicNameNoRepeat(): Promise<void> {
    const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
      topicName: this.formProvide.formObj.topicName
    })
    if (success) {
      this.noRepeat = ['主题名称已被注册']
    } else {
      this.noRepeat = []
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
