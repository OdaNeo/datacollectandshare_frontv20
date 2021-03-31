<template>
  <v-row no-gutters @click="firstToTheEgg">
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
      :description="`主题名称`"
      v-topicNameNoRepeat="{
        set: n => {
          noRepeat = [...n]
        }
      }"
    />
    <!-- rtsp/rtmp地址 -->
    <HSimpleInput
      v-model="formProvide.formObj['sourceUrl']"
      :rules="[...h_validator.noEmpty('rtsp/rtmp地址')]"
      :description="`rtsp/rtmp地址`"
    />
    <!-- 摄像头地址 -->
    <HSimpleInput
      v-model="formProvide.formObj['address']"
      :rules="[...h_validator.noEmpty('摄像头地址')]"
      :description="`摄像头地址`"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
@Component({
  components: {
    HSimpleInput
  }
})
@Validator(['topicNameFormatter', 'noEmpty'])
export default class CreateVideoTopicDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []

  // firstToTheEgg
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
      this.$router.push('/private/bulkCreateTopic')
    }
  }
}
</script>
