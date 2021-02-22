<template>
  <v-row no-gutters @click="firstToTheEgg">
    <!-- 主题名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
        class="ml-4 mr-15"
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
      ></v-text-field>
    </v-col>
    <!-- rtsp/rtmp地址 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>rtsp/rtmp地址</label>
      <v-text-field
        v-model="formProvide.formObj['sourceUrl']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('rtsp/rtmp地址')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!-- 摄像头地址 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>摄像头地址</label>
      <v-text-field
        v-model="formProvide.formObj['address']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('摄像头地址')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'

import Validator from '@/decorator/validatorDecorator'
import http from '@/decorator/httpDecorator'

@Component
@http
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
