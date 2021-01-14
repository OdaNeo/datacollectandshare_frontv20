<template>
  <v-row no-gutters>
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.topicName"
        :rules="[...h_validator.videoTopicNameValidate(), ...topicRepeat]"
        @input="inputEvent(formProvide.formObj.topicName)"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>主题名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <!-- <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.serverUrl"
        :rules="[...h_validator.videoDataSourceValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>rtmp地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col> -->
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.address"
        :rules="[...h_validator.videoCameraPositionValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>摄像头地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.sourceUrl"
        :rules="[...h_validator.videoCameraPositionValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>rtsp/rtmp地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <!-- <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.m3u8Url"
        :rules="[...h_validator.videoCameraPositionValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>视频流m3u8地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col> -->
    <!-- <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.bucketName"
        :rules="[...h_validator.videoCameraPositionValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>minio桶名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col> -->
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import validator from '@/decorator/validatorDecorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
@http
@validator(['videoTopicNameValidate', 'videoDataSourceValidate', 'videoCameraPositionValidate'])
export default class CreateVideoTopicDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private systemList: Array<{ name: string }> = []
  private topicRepeat: Function[] = []

  private async inputEvent(v: string) {
    if (v) {
      const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
        topicName: v
      })
      if (success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.topicRepeat = [(v: string) => '主题名称已被注册']
      } else {
        this.topicRepeat = []
      }
    } else {
      this.topicRepeat = []
    }
  }
}
</script>
