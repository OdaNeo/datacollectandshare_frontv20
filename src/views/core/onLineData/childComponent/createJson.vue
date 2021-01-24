<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />

    <v-col cols="12" class="d-flex mb-6">
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
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { InputType } from '@/type/dialog-form.type'
import HInput from '@/components/h-input.vue'
import Validator from '@/validator2/t-validator'

@Component({
  components: {
    HInput
  }
})
@http
export default class CreateJson extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private noRepeat: string[] = []
  private showConstruction = false

  private get msgSendExample() {
    let msg = ''
    msg = this.formProvide.formObj.dataStructSchema
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
      require: true
    },
    {
      label: '是否写入ES',
      valueName: 'writeElasticsearch',
      type: 'radioGroup',
      items: [
        { text: '是', value: '是' },
        { text: '否', value: '否' }
      ],
      require: true
    },
    {
      label: '内存过期时间',
      valueName: 'redisTimer',
      type: 'slider',
      items: ['5', '30'],
      require: false
    },
    {
      label: '数据结构',
      valueName: 'dataStructSchema',
      type: 'textarea',
      require: true,
      otherRules: Validator['topic-validator'].dataStructValidate
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
    this.formTypeObj[0].otherRules = [...Validator['topic-validator'].topicNameFormatter, ...this.noRepeat]
  }
}
</script>
