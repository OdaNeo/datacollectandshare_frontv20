<template>
  <v-row no-gutters @click="firstToTheEgg">
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import Validator from '@/decorator/validatorDecorator'
import http from '@/decorator/httpDecorator'

@Component({
  components: {
    HInput
  }
})
@http
@Validator(['topicNameFormatter'])
export default class CreateVideoTopicDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []

  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称',
      valueName: 'topicName',
      type: 'input',
      require: true,
      otherRules: []
    },
    {
      label: 'rtsp/rtmp地址',
      valueName: 'sourceUrl',
      type: 'input',
      require: true
    },
    {
      label: '摄像头地址',
      valueName: 'address',
      type: 'input',
      require: true
    }
  ]

  //
  private count = 0
  private timer = 0
  private firstToTheEgg() {
    clearTimeout(this.timer)
    this.count++
    this.timer = setTimeout(() => {
      this.count = 0
    }, 800)
    if (this.count === 10) {
      clearTimeout(this.timer)
      this.$router.push('/bulkCreateTopic')
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
}
</script>
