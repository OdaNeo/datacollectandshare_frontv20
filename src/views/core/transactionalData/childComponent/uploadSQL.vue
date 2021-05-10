<template>
  <v-row no-gutters>
    <!-- 上传文件 -->
    <HFileUpLoad
      accept=".sql"
      class="mt-2"
      label="支持.sql格式的单文件上传"
      outlined
      description="上传文件"
      :rules="[...h_validator.fileSQLValidate()]"
      @change="$emit('change', $event)"
    />
    <v-card-subtitle class="ml-10 pt-0" style="color: red">注意：表字段说明不能有英文的分号。</v-card-subtitle>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HFileUpLoad from '@/components/h-file-upload.vue'

@Component({
  components: {
    HFileUpLoad
  }
})
@Validator(['fileSQLValidate'])
export default class UploadSQL extends Vue {
  @Inject() private readonly formProvide!: H_Vue
}
</script>
