<template>
  <v-row no-gutters>
    <!-- 主题 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :description="`主题名称`"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
    />
    <!--AuthorizationObj  -->
    <HDoubleInput
      :required="false"
      :description="`Authorization`"
      :object="AuthorizationObj"
      :formObj="`AuthorizationObj`"
    />

    <!-- url -->
    <HSimpleInput
      v-model="formProvide.formObj['url']"
      :description="`URL`"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('URL')]"
    />

    <!-- 请求类型 -->
    <HSelect
      :description="`请求类型`"
      :disabled="formProvide.formObj.canNotEdit"
      v-model="formProvide.formObj['type']"
      :rules="[...h_validator.noEmpty('请求类型')]"
      :items="typeItem"
    />

    <!-- body  -->
    <HTextArea
      v-if="formProvide.formObj['type'] === 'post'"
      v-model="formProvide.formObj['body']"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`body`"
      :rules="[...h_validator.noEmpty('body'), ...h_validator.isJSON()]"
    />
    <!-- 头信息 -->
    <HDoubleInput :required="false" :description="`头信息`" :object="header" :formObj="`header`" :accumulation="true" />

    <!-- 数据结构 -->
    <HTopicList :description="`数据结构`" />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HTextArea from '@/components/h-textarea.vue'
import HSelect from '@/components/h-select.vue'
import HTopicList from '@/components/h-topic-list.vue'
import HDoubleInput from '@/components/f-double-input.vue'

@Component({
  components: {
    HSimpleInput,
    HTextArea,
    HSelect,
    HTopicList,
    HDoubleInput
  }
})
@Validator(['noEmpty', 'isJSON', 'topicNameFormatter'])
export default class CreateServePull extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private typeItem = ['get', 'post']

  private AuthorizationObj = [
    { text: '用户名', value: 'key' },
    { text: '密码', value: 'value' }
  ]

  private header = [
    { text: '键', value: 'key' },
    { text: '值', value: 'value' }
  ]
}
</script>
