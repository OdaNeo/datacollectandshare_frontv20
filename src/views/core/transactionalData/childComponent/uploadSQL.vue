<template>
  <v-row no-gutters>
    <!-- 上传文件 -->
    <v-col cols="12" class="d-flex justify-space-around">
      <!-- <label class="label mr-5"><span class="require-span">*</span>上传文件</label> -->
      <v-file-input
        class="mt-2 pt-0 mx-8"
        label="支持.sql格式的单文件上传"
        clearable
        accept=".sql"
        @change="$emit('transform-sql-file', $event)"
        :rules="[...h_validator.fileSQLValidate()]"
      ></v-file-input>
    </v-col>
    <!-- 日志 -->
    <v-col v-if="message" cols="12" class="d-flex">
      <div
        class="mt-0 pt-0 mx-15"
        style="word-break: break-all; overflow: auto; font-size: 14px; line-height: 24px"
        v-html="obj"
      ></div>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import util from '@/decorator/utilsDecorator'

@util
@Component
@Validator(['fileSQLValidate'])
export default class UploadSQL extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private message!: string

  private get obj() {
    if (this.message !== '') {
      return ` ${this.message.replaceAll('/n', '<br/>')} `
    } else {
      return ``
    }
  }
}
</script>
