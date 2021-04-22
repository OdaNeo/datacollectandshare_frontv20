<template>
  <v-row no-gutters @click="firstToTheEgg">
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter()]"
      :description="`主题名称`"
    />

    <!-- rtsp/rtmp地址 -->
    <HSimpleInput
      v-model="formProvide.formObj['sourceUrl']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('rtsp/rtmp地址')]"
      :description="`rtsp/rtmp地址`"
    />
    <!-- 摄像头地址 -->
    <HSimpleInput
      v-model="formProvide.formObj['address']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('摄像头地址')]"
      :description="`摄像头地址`"
    />

    <!-- 视频描述 -->
    <HSimpleInput v-model="formProvide.formObj['videoDescribe']" :required="false" :description="`视频描述`" />

    <!-- 关键字 -->
    <MultiInput :required="false" :description="`关键字`" />

    <div class="ml-10">注：添加主题成功后视频流会自动启动</div>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import MultiInput from './multiInput.vue'

@Component({
  components: {
    HSimpleInput,
    MultiInput
  }
})
@Validator(['topicNameFormatter', 'noEmpty'])
export default class CreateVideoTopicDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

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
