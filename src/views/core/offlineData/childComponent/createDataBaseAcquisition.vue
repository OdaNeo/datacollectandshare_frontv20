<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :description="`主题名称`"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
    />
    <!-- 数据库地址 -->
    <HSimpleInput
      v-model="formProvide.formObj['dataBaseIp']"
      :description="`数据库地址`"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('数据库地址')]"
    />

    <!-- 数据库类型 -->
    <HSelect
      :description="`数据库类型`"
      placeholder="请选择数据库类型"
      v-model="formProvide.formObj['dataBaseType']"
      :rules="[...h_validator.noEmpty('数据库类型')]"
      :items="items"
    />

    <!-- 数据结构 -->
    <HTopicList :description="`数据结构`" />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSelect from '@/components/h-select.vue'
import HTopicList from '@/components/h-topic-list.vue'
@Component({
  components: {
    HSimpleInput,
    HSelect,
    HTopicList
  }
})
@Validator(['topicNameFormatter', 'noEmpty'])
export default class CreateDataBaseAcquisition extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private items = ['Mysql', 'Oracle', 'Sql Server']
}
</script>
