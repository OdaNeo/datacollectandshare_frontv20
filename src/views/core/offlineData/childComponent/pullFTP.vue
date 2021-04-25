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
          <TopicList :description="`数据结构`" />
        </v-row>
      </v-window-item>
      <!-- 2 -->
      <v-window-item :value="2" eager>
        <!-- 任务 -->
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
        <!-- 任务 -->
        <v-row no-gutters>
          <!-- basePath  -->
          <HSimpleInput
            class="mt-6"
            v-model="formProvide.formObj['basePath']"
            :description="`basePath`"
            :rules="[...h_validator.noEmpty('basePath')]"
          />
          <!-- 文件前缀  -->
          <HSimpleInput
            v-model="formProvide.formObj['filePrefix']"
            :description="`文件前缀`"
            :rules="[...h_validator.noEmpty('文件前缀')]"
          />
          <!-- 表名  -->
          <HSimpleInput
            v-model="formProvide.formObj['tableName']"
            :description="`表名`"
            :rules="[...h_validator.noEmpty('表名')]"
          />
          <!-- FTP地址 -->
          <DoubleInput
            :required="true"
            :description="`FTP地址`"
            :object="ftpItem"
            :formObj="`ftp`"
            :accumulation="false"
            :rules1="[...h_validator.noEmpty('host')]"
            :rules2="[...h_validator.noEmpty('post'), ...h_validator.isNumber()]"
          />
          <!-- FTP账号  -->
          <HSimpleInput
            v-model="formProvide.formObj['userName']"
            :description="`FTP账号`"
            :rules="[...h_validator.noEmpty('FTP账号')]"
          />
          <!-- FTP密码  -->
          <HSimpleInput
            v-model="formProvide.formObj['password']"
            :description="`FTP密码`"
            :rules="[...h_validator.noEmpty('FTP密码')]"
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
import DoubleInput from './doubleInput.vue'
import HStep from '@/components/h-step.vue'
import HSelect from '@/components/h-select.vue'
import HSlider from '@/components/h-slider.vue'
import TopicList from './topicList.vue'

@Component({
  components: {
    HSimpleInput,
    DoubleInput,
    HStep,
    HSelect,
    HSlider,
    TopicList
  }
})
@Validator(['noEmpty', 'topicNameFormatter', 'isNumber'])
export default class PullFTP extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private ftpItem = [
    { text: 'host', value: 'host' },
    { text: 'port', value: 'port' }
  ]

  // 步骤条
  private step = 1
  // 标题
  private stepTitle = ['主题结构数据信息', '任务属性信息-1', '任务属性信息-2']

  //
  private changeTopic(val: number) {
    console.log(val)
  }
}
</script>
