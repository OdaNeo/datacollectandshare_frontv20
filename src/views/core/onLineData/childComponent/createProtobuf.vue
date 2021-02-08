<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

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
      </v-slider>
    </v-col>

    <!-- 上传文件 -->
    <v-col cols="12" class="d-flex justify-space-around">
      <label class="label mr-5"><span class="require-span">*</span>上传文件</label>
      <v-file-input
        class="mt-0 pt-0 mr-12"
        label="支持.proto格式的单文件上传"
        clearable
        accept=".proto"
        @change="$emit('upload-proto-file', $event)"
        :rules="[...h_validator.fileProtoValidate()]"
      ></v-file-input>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component({})
@http
@Validator(['fileProtoValidate', 'topicNameFormatter', 'noEmpty'])
export default class CreateProtobuf extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []

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
  }
}
</script>
