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
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">内存过期时间</label>
      <v-slider
        v-model="formProvide.formObj['redisTimer']"
        :disabled="formProvide.formObj.canNotEdit"
        class="align-center ml-4 mb-4 mr-15"
        :max="30"
        :min="5"
        hide-details
        :thumb-size="20"
        thumb-label="always"
      >
        <template v-slot:append>
          <v-text-field
            v-model="formProvide.formObj['redisTimer']"
            class="mt-0 pt-0"
            hide-details
            dense
            disabled
            single-line
            style="width: 30px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-col>

    <!-- 上传文件 -->
    <HFileUpLoad
      :required="true"
      :description="`上传文件`"
      label="支持.proto格式的单文件上传"
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
@Component({
  components: {
    HFileUpLoad,
    HSimpleInput
  }
})
@Validator(['fileProtoValidate', 'topicNameFormatter', 'noEmpty'])
export default class CreateProtobuf extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []
}
</script>
