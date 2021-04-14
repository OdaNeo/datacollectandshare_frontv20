<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`主题名称`"
      :rules="[...h_validator.noEmpty('主题名称')]"
    />

    <!-- 服务器IP -->
    <HSimpleInput
      v-model="formProvide.formObj['logIp']"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`服务器IP`"
      :rules="[...h_validator.noEmpty('服务器IP'), ...h_validator.realIP()]"
    />

    <!-- 用户名 -->
    <HSimpleInput
      v-model="formProvide.formObj['logUserName']"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`用户名`"
      :rules="[...h_validator.noEmpty('用户名')]"
    />

    <!-- 密码 -->
    <HSimpleInput
      v-model="formProvide.formObj['logPassWord']"
      v-if="!formProvide.formObj.canNotEdit"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`密码`"
      :rules="[...h_validator.noEmpty('密码')]"
    />
    <!-- <div style="font-size: 12px; width: 110px; line-height: 18px">如不希望暴露密码，可输入 ******</div> -->

    <!-- 日志采集路径 -->
    <HSimpleInput
      v-model="formProvide.formObj['savePath']"
      :description="`日志采集路径`"
      :rules="[...h_validator.noEmpty('日志采集路径')]"
    />

    <!-- 存储方式 -->
    <HMultiCheckBoxes
      v-model="formProvide.formObj['saveType']"
      :disabled="formProvide.formObj.canNotEdit"
      :items="saveTypeItems"
      :description="`存储方式`"
      :rules="[...h_validator.noEmpty('存储方式')]"
    ></HMultiCheckBoxes>

    <!-- 采集校验关键字 1,2,3 提示：使用逗号隔开-->
    <HSimpleInput
      v-model="formProvide.formObj['keywords']"
      :required="false"
      label="关键字之间请使用英文逗号（,）隔开"
      :description="`采集校验关键字`"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HMultiCheckBoxes from '@/components/h-multi-checkboxes.vue'
import HSimpleInput from '@/components/h-simple-input.vue'

@Component({
  components: {
    HMultiCheckBoxes,
    HSimpleInput
  }
})
@Validator(['noEmpty', 'realIP', 'topicNameFormatter'])
export default class CreateLogTopic extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private saveTypeItems: Array<{ text: string; value: string }> = [
    { text: 'ElasticSearch', value: 'ElasticSearch' },
    { text: 'HDFS', value: 'HDFS' }
  ]
  private test = []
}
</script>
