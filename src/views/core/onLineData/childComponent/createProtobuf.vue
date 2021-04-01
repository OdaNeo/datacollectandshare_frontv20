<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
      :description="`主题名称`"
      v-topicNameNoRepeat="{
        set: n => {
          noRepeat = [...n]
        }
      }"
    />
    <!-- 内存过期时间 -->
    <HSlider
      v-model="formProvide.formObj['redisTimer']"
      :disabled="formProvide.formObj.canNotEdit"
      :description="`内存过期时间`"
      :max="30"
      :min="5"
      :required="false"
    />

    <!-- 上传文件 -->
    <HFileUpLoad
      :required="true"
      :description="`上传文件`"
      placeholder="支持.proto格式的单文件上传"
      accept=".proto"
      :rules="[...h_validator.fileProtoValidate()]"
      @change="$emit('upload-proto-file', $event)"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HFileUpLoad from '@/components/h-file-upload.vue'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSlider from '@/components/h-slider.vue'

@Component({
  components: {
    HFileUpLoad,
    HSimpleInput,
    HSlider
  }
})
@Validator(['fileProtoValidate', 'topicNameFormatter', 'noEmpty'])
export default class CreateProtobuf extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []
}
</script>
