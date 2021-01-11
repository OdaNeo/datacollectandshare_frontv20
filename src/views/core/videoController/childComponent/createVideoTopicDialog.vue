<template>
  <v-row no-gutters>
    <!-- 弹框 展示数据结 -->
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.videoTopicName"
        :rules="[...h_validator.videoTopicNameValidate(), ...topicRepeat]"
        @input="inputEvent(formProvide.formObj.videoTopicName)"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>主题名称：</label>
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
        v-model="formProvide.formObj.dataSource"
        :rules="[...h_validator.videoDataSourceValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>数据源地址：</label>
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
        v-model="formProvide.formObj.cameraPosition"
        :rules="[...h_validator.videoCameraPositionValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>摄像头位置：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
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
    console.log(v)
    // if (v && v != '') {
    //   const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
    //     cmdName: v,
    //   })
    //   if (success) {
    //     this.topicRepeat = [(v: string) => '命令名称已被注册']
    //   } else {
    //     this.topicRepeat = []
    //   }
    // } else {
    //   this.topicRepeat = []
    // }
  }
}
</script>
