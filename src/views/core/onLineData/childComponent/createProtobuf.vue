<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
    <v-col cols="12" class="d-flex justify-space-around">
      <label class="label mr-5"><span class="require-span">*</span>上传文件</label>
      <v-file-input
        class="mt-0 pt-0 mr-12"
        label="支持.proto格式的单文件上传"
        clearable
        accept=".proto"
        @change="$emit('upload-proto-file', $event)"
        :rules="rules"
      ></v-file-input>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { InputType } from '@/type/dialog-form.type'
import HInput from '@/components/h-input.vue'
import Validator from '@/validator2/t-validator'

@Component({
  components: {
    HInput
  }
})
@http
export default class CreateProtobuf extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []

  private rules = [...Validator['topic-validator'].fileProtoValidate]

  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称',
      valueName: 'topicName',
      type: 'input',
      require: true,
      otherRules: []
    },
    {
      label: '内存过期时间',
      valueName: 'redisTimer',
      type: 'slider',
      items: ['5', '30'],
      require: false
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
    this.formTypeObj[0].otherRules = [...Validator['topic-validator'].topicNameFormatter, ...this.noRepeat]
  }
}
</script>
