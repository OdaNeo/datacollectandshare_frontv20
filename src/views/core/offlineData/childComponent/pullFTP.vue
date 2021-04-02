<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :description="`主题名称`"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
    />
    <!-- baseUrl  -->
    <HSimpleInput
      v-model="formProvide.formObj['baseUrl']"
      :description="`baseUrl`"
      :rules="[...h_validator.noEmpty('baseUrl')]"
    />
    <!-- FTP地址 -->
    <HDoubleInput
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
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HDoubleInput from '@/components/f-double-input.vue'
@Component({
  components: {
    HSimpleInput,
    HDoubleInput
  }
})
@Validator(['noEmpty', 'topicNameFormatter', 'isNumber'])
export default class PullFTP extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private ftpItem = [
    { text: 'host', value: 'host' },
    { text: 'port', value: 'port' }
  ]
}
</script>
