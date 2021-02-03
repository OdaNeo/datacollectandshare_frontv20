<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { InputType } from '@/type/dialog-form.type'
import HInput from '@/components/h-input.vue'
import Validator from '@/decorator/validatorDecorator'

@Component({
  components: {
    HInput
  }
})
@http
@Validator(['fileProtoValidate', 'topicNameFormatter', 'isNumber'])
export default class PullFTP extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []

  private rules = [...this.h_validator.fileProtoValidate()]

  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称',
      valueName: 'topicName',
      type: 'input',
      require: true,
      otherRules: []
    },
    {
      label: 'baseUrl',
      valueName: 'baseUrl',
      type: 'input',
      require: true
    },
    {
      label: 'FTP地址',
      valueName: 'ftp',
      type: 'doubleInput',
      itemLabels: [
        { text: 'host', value: 'host' },
        { text: 'port', value: 'port' }
      ],
      addItem: false,
      require: true,
      otherRules_1: [...this.h_validator.isNumber()]
    },
    {
      label: 'FTP账号',
      valueName: 'userName',
      type: 'input',
      require: true
    },
    {
      label: 'FTP密码',
      valueName: 'password',
      type: 'input',
      require: true
    }
  ]

  // topicName validation
  @Watch('formProvide.formObj.topicName')
  private async nameNoRepeat(val: string) {
    if (!val) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
      topicName: val
    })
    if (success) {
      this.noRepeat = ['主题名称已被注册']
    } else {
      this.noRepeat = []
    }
    this.formTypeObj[0].otherRules = [...this.h_validator.topicNameFormatter(), ...this.noRepeat]
  }
}
</script>
