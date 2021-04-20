<template>
  <v-row no-gutters>
    <!-- 步骤条 -->
    <HStep :step="step" :stepTitle="stepTitle" :MAX="2" @nextStep="nextStep" @prevStep="prevStep" />

    <v-window v-model="step">
      <!-- 1 -->
      <v-window-item :value="1" class="ml-6" eager>
        <!-- 主题名称 -->
        <v-row no-gutters>
          <!-- 选择主题ID -->
          <HSelect
            class="mt-6"
            :disabled="formProvide.formObj.canNotEdit"
            v-model="formProvide.formObj.id"
            :description="`选择主题ID`"
            :items="formProvide.formObj.activeTopicIDs"
            @input="$emit('changeTopic', $event)"
          />

          <!-- 主题 -->
          <HSimpleInput
            v-model="formProvide.formObj['topicName']"
            :disabled="formProvide.formObj.canNotEdit || formProvide.formObj.useSelectID"
            :description="`主题名称`"
            :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
          />

          <!-- 数据结构 -->
          <HTopicList :description="`数据结构`" :canAddTopicList="false" />
        </v-row>
      </v-window-item>
      <!-- 2 -->
      <v-window-item :value="2" class="ml-6" eager>
        <v-row no-gutters>
          <!--AuthorizationObj  -->
          <HDoubleInput
            class="mt-6"
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
          <HDoubleInput
            :required="false"
            :description="`头信息`"
            :object="header"
            :formObj="`header`"
            :accumulation="true"
          />
        </v-row>
      </v-window-item>
    </v-window>
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
import HDoubleInput from '@/components/h-double-input.vue'
import HStep from '@/components/h-step.vue'
@Component({
  components: {
    HStep,
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
  // 步骤条
  private step = 1
  // 标题
  private stepTitle = ['主题结构数据信息', '任务属性信息']
  //  前进
  private prevStep() {
    if (this.step < 1) {
      this.step = 1
      return
    } else {
      this.step--
    }
  }
  // 后退
  private nextStep() {
    if (this.step > 4) {
      this.step = 4
      return
    } else {
      this.step++
    }
  }
}
</script>
