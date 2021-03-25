<template>
  <v-row no-gutters>
    <!-- 上传文件 -->
    <v-col cols="12" class="d-flex justify-space-around">
      <!-- <label class="label mr-5"><span class="require-span">*</span>上传文件</label> -->
      <v-file-input
        class="mt-2 pt-0 mx-12"
        label="支持.sql格式的单文件上传"
        clearable
        @change="$emit('transform-sql-file', $event)"
      ></v-file-input>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component
@Validator(['fileSQLValidate'])
export default class UploadSQL extends Vue {
  @Inject() private readonly formProvide!: H_Vue
}
</script>
