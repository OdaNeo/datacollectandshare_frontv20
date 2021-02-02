<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
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
import { InputType } from '@/type/dialog-form.type'
import HInput from '@/components/h-input.vue'
import Validator from '@/decorator/validatorDecorator'

@Component({
  components: {
    HInput
  }
})
@http
@Validator(['topicNameFormatter'])
export default class CreateRest extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []

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

  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称',
      valueName: 'topicName',
      type: 'input',
      require: true,
      disabled: !!this.formProvide.formObj.topicName,
      otherRules: []
    },
    {
      label: '消息类型',
      valueName: 'queneType',
      type: 'radioGroup',
      items: [
        { text: '数据量优先', value: 1 },
        { text: '顺序优先', value: 2 }
      ],
      disabled: !!this.formProvide.formObj.topicName,
      require: true
    },
    // {
    //   label: '是否写入ES',
    //   valueName: 'writeElasticsearch',
    //   type: 'radioGroup',
    //   items: [
    //     { text: '是', value: '是' },
    //     { text: '否', value: '否' }
    //   ],
    //   disabled: !!this.formProvide.formObj.topicName,
    //   require: true
    // },
    {
      label: '内存过期时间',
      valueName: 'redisTimer',
      type: 'slider',
      items: ['5', '30'],
      disabled: !!this.formProvide.formObj.topicName,
      require: false
    },
    {
      label: '数据结构',
      valueName: 'topicList',
      type: 'tripleInput',
      items: [
        { text: 'Int', value: 1 },
        { text: 'String', value: 'str' },
        { text: 'Date', value: 'Date' },
        { text: 'TimeStamp', value: 'TimeStamp' }
      ],
      itemLabels: [
        { text: '字段名', value: 'key' },
        { text: '描述', value: 'description' },
        { text: '字段类型', value: 'type' }
      ],
      otherRules: [],
      require: true
    }
  ]

  // topicName validation
  @Watch('formProvide.formObj.topicName')
  private async nameNoRepeat(val: string) {
    if (!val) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
      topicName: val
    })
    if (success) {
      this.noRepeat = ['主题名称已被注册']
    } else {
      this.noRepeat = []
    }
    this.formTypeObj[0].otherRules = [...this.h_validator.topicNameFormatter(), ...this.noRepeat]
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
      this.formTypeObj[3].otherRules = ['字段名不能重复']
    } else {
      this.formTypeObj[3].otherRules = []
    }
  }
}
</script>
