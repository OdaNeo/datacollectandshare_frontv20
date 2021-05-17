<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
      :description="`主题名称`"
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
    <HTopicList :description="`数据结构`" />

    <!-- 数据发送示例 -->
    <HExample :description="`数据发送示例`" :message="msgSendExample" />

    <!-- 文件上传 -->
    <HFileUpLoad
      v-if="!formProvide.formObj.canNotEdit"
      :required="false"
      :description="`通过文件创建`"
      label="支持.xls, .xlsx格式的单文件上传"
      accept=".xls,.xlsx"
      @change="$emit('upload-file', $event)"
    />

    <!-- 文件上传示例 -->
    <HExample
      v-if="!formProvide.formObj.canNotEdit"
      :description="`文件上传示例`"
      :headers="headers"
      :desserts="desserts"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import http from '@/decorator/httpDecorator'
import HFileUpLoad from '@/components/h-file-upload.vue'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSlider from '@/components/h-slider.vue'
import HRadioGroup from '@/components/h-radio-group.vue'
import HExample from '@/components/h-example.vue'
import HTopicList from '@/components/h-topic-list.vue'
@Component({
  components: {
    HFileUpLoad,
    HSimpleInput,
    HSlider,
    HRadioGroup,
    HExample,
    HTopicList
  }
})
@http
@Validator(['noEmpty', 'topicNameFormatter'])
export default class CreateRest extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private queneTypeItem = [
    { text: '数据量优先', value: 1 },
    { text: '顺序优先', value: 2 }
  ]

  private get msgSendExample() {
    const topicList = this.formProvide.formObj.topicList
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

  // 数据示例 headers
  private headers = [
    {
      text: '字段名',
      align: 'center',
      value: 'key'
    },
    {
      text: '字段类型(Int,String,TimeStamp)',
      align: 'center',
      value: 'type'
    },
    {
      text: '字段含义',
      align: 'center',
      value: 'description'
    }
  ]

  // 数据示例 desserts
  private desserts = [
    {
      key: 'key1',
      type: 'type1',
      description: 'description1'
    },
    {
      key: 'key2',
      type: 'type2',
      description: 'description2'
    }
  ]
}
</script>
