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
@Validator(['dataStructValidate', 'topicNameFormatter'])
export default class CreateServePull extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private noRepeat: string[] = []
  private typeItem = ['get', 'post']

  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称',
      valueName: 'topicName',
      type: 'input',
      require: true,
      otherRules: []
    },
    {
      label: 'Authorization',
      valueName: 'AuthorizationObj',
      type: 'doubleInput',
      itemLabels: [
        { text: '用户名', value: 'key' },
        { text: '密码', value: 'value' }
      ],
      addItem: false,
      require: false
    },
    {
      label: 'url',
      valueName: 'url',
      type: 'input',
      require: true
    },
    {
      label: '请求类型',
      valueName: 'type',
      type: 'select',
      items: this.typeItem,
      require: true
    },
    {
      label: 'body',
      valueName: 'body',
      type: '',
      require: true,
      otherRules: [...this.h_validator.dataStructValidate()]
    },
    {
      label: '头信息',
      valueName: 'header',
      type: 'doubleInput',
      itemLabels: [
        { text: '键', value: 'key' },
        { text: '值', value: 'value' }
      ],
      addItem: true,
      require: false
    },
    {
      label: '数据结构',
      valueName: 'topicList',
      type: 'tripleInput',
      items: [
        { text: 'Int', value: 1 },
        { text: 'String', value: 'str' },
        { text: 'Date', value: 'Date' },
        { text: 'TimeStamp', value: 'TimeStamp' }
      ],
      itemLabels: [
        { text: '字段名', value: 'key' },
        { text: '描述', value: 'description' },
        { text: '字段类型', value: 'type' }
      ],
      otherRules: [],
      require: true
    }
  ]

  // 请求类型
  @Watch('formProvide.formObj.type')
  private handleRequestType(val: string) {
    // 选择是否显示body
    if (val === this.typeItem[0]) {
      this.formTypeObj[4].type = ''
    } else if (val === this.typeItem[1]) {
      this.formTypeObj[4].type = 'textarea'
    } else {
      this.formTypeObj[4].type = ''
    }
  }

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
  // validation topicList no-repeat-key
  @Watch('formProvide.formObj.topicList', { deep: true })
  private handleKeyNoRepeat(val: Array<any>) {
    let _L: Array<string> = []
    let _l: Array<string> = []
    val.forEach(item => {
      if (item.key && !_l.includes(item.key)) {
        _l.push(item.key)
      }
      if (item.key) {
        _L.push(item.key)
      }
    })
    if (_L.length > _l.length) {
      this.formTypeObj[6].otherRules = ['字段名不能重复']
    } else {
      this.formTypeObj[6].otherRules = []
    }
  }
}
</script>
