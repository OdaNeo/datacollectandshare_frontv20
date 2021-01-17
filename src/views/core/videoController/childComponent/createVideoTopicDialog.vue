<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'

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
      rules: ['topicNameNoRepeat', 'topicNameFormatter']
    },
    {
      label: 'rtsp/rtmp地址',
      valueName: 'sourceUrl',
      type: 'input',
      require: true
    },
    { label: '摄像头地址', valueName: 'address', type: 'input', require: true }
  ]
}
</script>
