<template>
  <div>
    <v-btn class="ml-12 mt-12" color="primary" height="35px" dark @click.stop="createTopicVideo"
      >批量创建视频主题</v-btn
    >
    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <v-row no-gutters>
        <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
      </v-row>
    </f-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import FDialog from '@/components/f-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'
import { dataType } from '@/enum/topic-datatype-enum.ts'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import Validator from '@/validator2/t-validator'

@Component({
  components: {
    FDialog,
    HInput
  }
})
@http
export default class bulkCreateTopic extends Vue {
  @Provide('formProvide') private formProvide: FormObj = {
    title: '' as string,
    btnName: [] as Array<string>,
    methodName: '' as string,
    formObj: {}
  }
  private count = 0

  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称母版',
      valueName: 'topicNameItem',
      type: 'input',
      require: true,
      otherRules: Validator['topic-validator'].topicNameFormatter
    },
    {
      label: 'rtsp/rtmp地址',
      valueName: 'sourceUrl',
      type: 'input',
      require: false
    },
    {
      label: '批量创建数量',
      valueName: 'number',
      type: 'input',
      require: true,
      otherRules: [(v: any) => !!(typeof Number(v) === 'number' && !isNaN(v)) || '请输入数字']
    }
  ]

  private dialogFlag = false // 弹窗展示
  //  创建主题
  private createTopicVideo() {
    this.dialogFlag = true
    this.formProvide.title = '创建非结构化主题'
    this.formProvide.btnName = ['立即提交', '取消']
    this.formProvide.methodName = 'bulkAddVideoTopic'
    this.formProvide.formObj = {}
  }

  //  提交创建 非结构化数据
  private async bulkAddVideoTopic(formObj: any) {
    this.count = 0
    const params: any = {}

    for (let i = 0; i < formObj.number; i++) {
      params['topicName'] = formObj.topicNameItem + '_' + i
      params['address'] = '海鹰路海鹰路海鹰路海鹰路'
      params['sourceUrl'] = formObj.sourceUrl || 'rtmp://58.200.131.2:1935/livetv/cctv8'
      params['topicInterFaceType'] = topicInterFaceType['VIDEO']
      params['dataType'] = dataType['非结构化']
      const { success } = await this.h_request['httpPOST']('POST_TOPICS_ADD', params)
      if (success) {
        this.count++
      }
    }
    alert(this.count)
    this.count = 0
  }
}
</script>
