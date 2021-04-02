<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
      :description="`主题名称`"
    />
    <!-- 消息类型 -->
    <HRadioGroup
      :description="`消息类型`"
      v-model="formProvide.formObj['queneType']"
      :rules="[...h_validator.noEmpty('消息类型')]"
      :items="queneTypeItem"
    />

    <!-- 内存过期时间 -->
    <HSlider
      v-model="formProvide.formObj['redisTimer']"
      :description="`内存过期时间`"
      :max="30"
      :min="5"
      :required="false"
    />

    <!-- 数据结构 -->
    <HTextArea
      v-model="formProvide.formObj['dataStructSchema']"
      :description="`数据结构`"
      :rules="[...h_validator.noEmpty('数据结构'), ...h_validator.isJSON()]"
    />

    <!-- 数据发送示例 -->
    <HExample :description="`数据发送示例`" :message="msgSendExample" />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSlider from '@/components/h-slider.vue'
import HRadioGroup from '@/components/h-radio-group.vue'
import HTextArea from '@/components/h-textarea.vue'
import HExample from '@/components/h-example.vue'
@Component({
  components: {
    HSimpleInput,
    HSlider,
    HRadioGroup,
    HTextArea,
    HExample
  }
})
@Validator(['noEmpty', 'isJSON', 'topicNameFormatter'])
export default class CreateJson extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private showConstruction = false
  private queneTypeItem = [
    { text: '数据量优先', value: 1 },
    { text: '顺序优先', value: 2 }
  ]

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
}
</script>
