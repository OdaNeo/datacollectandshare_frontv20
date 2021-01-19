<template>
  <v-row no-gutters @click="firstToTheEgg">
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import Validator from '@/validator2/t-validator'

@Component({
  components: {
    HInput
  }
})
export default class CreateVideoTopicDialog extends Vue {
  private formTypeObj: Array<InputType> = [
    {
      label: '主题名称',
      valueName: 'topicName',
      type: 'input',
      require: true,
      rules: Validator['topic-validator'].topicNameFormatter
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
    }, 500)
    if (this.count === 10) {
      clearTimeout(this.timer)
      this.$router.push('/bulkCreateTopic')
    }
  }
}
</script>
