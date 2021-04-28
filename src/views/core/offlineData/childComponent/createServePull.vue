<template>
  <v-row no-gutters>
    <!-- 步骤条 -->
    <HStep :step="step" :stepTitle="stepTitle" :MAX="3" @nextStep="step++" @prevStep="step--" />

    <v-window v-model="step">
      <!-- 1 -->
      <v-window-item :value="1" eager>
        <!-- 主题名称 -->
        <v-row no-gutters>
          <!-- 选择主题ID -->
          <HSelect
            class="mt-6"
            v-model="formProvide.formObj.id"
            :description="`选择/新建主题ID`"
            :disabled="formProvide.formObj.isEdit"
            :items="formProvide.formObj.activeTopicIDs"
            @input="changeTopic"
          />

          <!-- 主题 -->
          <HSimpleInput
            v-model="formProvide.formObj['topicName']"
            :disabled="!formProvide.formObj.newTopics"
            :description="`主题名称`"
            :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
          />

          <!-- 数据结构 -->
          <TopicList v-if="!formProvide.formObj.isEdit" :description="`数据结构`" />
        </v-row>
      </v-window-item>

      <!-- 2 -->
      <v-window-item :value="2" eager>
        <v-row no-gutters>
          <!-- taskName -->
          <HSimpleInput
            class="mt-6"
            :disabled="formProvide.formObj.isEdit"
            v-model="formProvide.formObj['taskName']"
            :description="`任务名称`"
            :rules="[...h_validator.noEmpty('任务名称')]"
          />
          <!-- cron -->
          <HSlider
            :description="`每日运行周期`"
            :polyfill="`时`"
            :polyfillWidth="35"
            min="0"
            max="23"
            v-model="formProvide.formObj['cron']"
          />
        </v-row>
      </v-window-item>

      <!-- 3 -->
      <v-window-item :value="3" eager>
        <v-row no-gutters>
          <!--AuthorizationObj  -->
          <DoubleInput
            class="mt-6"
            :disabled="formProvide.formObj.isEdit"
            :required="false"
            :description="`Authorization`"
            :object="AuthorizationObj"
            :formObj="`AuthorizationObj`"
          />

          <!-- url -->
          <HSimpleInput
            v-model="formProvide.formObj['url']"
            :disabled="formProvide.formObj.isEdit"
            :description="`URL`"
            :rules="[...h_validator.noEmpty('URL')]"
          />

          <!-- 是否存入ES -->
          <HRadioGroup
            :description="`是否写入ES`"
            v-model="formProvide.formObj['saveEs']"
            :rules="[...h_validator.noEmpty('是否存入ES'), ...EsOrHBase]"
            :items="saveESItem"
            @input="handleEsOrHBase"
          />

          <!-- 是否存入HBase -->
          <HRadioGroup
            :description="`是否写入HBase`"
            v-model="formProvide.formObj['saveHbase']"
            :rules="[...h_validator.noEmpty('是否存入HBase'), ...EsOrHBase]"
            :items="saveHBaseItem"
            @input="handleEsOrHBase"
          />

          <!-- 请求类型 -->
          <HSelect
            :description="`请求类型`"
            v-model="formProvide.formObj['type']"
            :disabled="formProvide.formObj.isEdit"
            :rules="[...h_validator.noEmpty('请求类型')]"
            :items="typeItem"
          />

          <!-- body  -->
          <HTextArea
            v-if="formProvide.formObj['type'] === 'post'"
            v-model="formProvide.formObj['body']"
            :disabled="formProvide.formObj.isEdit"
            :description="`body`"
            :rules="[...h_validator.noEmpty('body'), ...h_validator.isJSON()]"
          />

          <!-- 头信息 -->
          <DoubleInput
            :required="false"
            :description="`头信息`"
            :disabled="formProvide.formObj.isEdit"
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
import TopicList from './topicList.vue'
import DoubleInput from './doubleInput.vue'
import HStep from '@/components/h-step.vue'
import HSlider from '@/components/h-slider.vue'
import HRadioGroup from '@/components/h-radio-group.vue'
import util from '@/decorator/utilsDecorator'

@Component({
  components: {
    HStep,
    HSimpleInput,
    HTextArea,
    HSelect,
    TopicList,
    DoubleInput,
    HSlider,
    HRadioGroup
  }
})
@util
@Validator(['noEmpty', 'isJSON', 'topicNameFormatter'])
export default class CreateServePull extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private typeItem = ['get', 'post']

  private EsOrHBase: string[] = []

  private AuthorizationObj = [
    { text: '用户名', value: 'key' },
    { text: '密码', value: 'value' }
  ]

  private header = [
    { text: '键', value: 'key' },
    { text: '值', value: 'value' }
  ]

  private saveESItem = [
    { text: '否', value: '0' },
    { text: '是', value: '1' }
  ]

  private saveHBaseItem = [
    { text: '否', value: '0' },
    { text: '是', value: '1' }
  ]
  // 步骤条
  private step = 1
  // 标题
  private stepTitle = ['主题结构数据信息', '任务属性信息-1', '任务属性信息-2']

  // 切换主题
  private changeTopic(val: string | null) {
    if (val && val !== `新增主题`) {
      const item = this.formProvide.formObj.activeTopicIDs
      let obj1: any
      let obj2: any
      let topicName = ''
      item.forEach((item: { value: string | null; dataStruct: string; topicName: string; dsAnnotation: string }) => {
        if (item.value === val) {
          obj1 = item.dataStruct
          obj2 = item.dsAnnotation
          topicName = item.topicName
        }
      })
      const topicList = this.h_utils.topicListUtil.transJsonToTopicList(obj1, obj2)

      this.formProvide.formObj.id = val
      this.formProvide.formObj.topicName = topicName
      this.formProvide.formObj.newTopics = false
      this.formProvide.formObj.topicList = topicList.map((item: {}) => ({ ...item, disabled: true }))
    } else {
      this.formProvide.formObj.id = val
      this.formProvide.formObj.topicName = ''
      this.formProvide.formObj.newTopics = true
      this.formProvide.formObj.topicList = [
        {
          key: '',
          description: '',
          type: '',
          disabled: false
        }
      ]
    }
  }

  private handleEsOrHBase() {
    const _saveEs = Number(this.formProvide.formObj.saveEs)
    const _saveHbase = Number(this.formProvide.formObj.saveHbase)

    if (_saveEs === 0 && _saveHbase === 0) {
      this.EsOrHBase = [`至少存入ES或HBase其中之一`]
    } else {
      this.EsOrHBase = []
    }
  }
}
</script>
