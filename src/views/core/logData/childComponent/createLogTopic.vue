<template>
  <v-row no-gutters>
    <!-- 创建主题：主题名称 服务器IP 用户名 密码（是否 ？******）-->
    <!-- 日志采集路径：可修改 -->
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
        :rules="[...h_validator.noEmpty('主题名称'), ...noRepeat]"
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 服务器IP -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>服务器IP</label>
      <v-text-field
        v-model="formProvide.formObj['logIp']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('服务器IP'), ...h_validator.realIP()]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 用户名 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>用户名</label>
      <v-text-field
        v-model="formProvide.formObj['logUserName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('用户名')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 密码 -->
    <v-col v-if="!formProvide.formObj.canNotEdit" cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>密码</label>
      <v-text-field
        v-model="formProvide.formObj['logPassWord']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        class="ml-4 mr-15"
        :rules="[...h_validator.noEmpty('密码')]"
      ></v-text-field>
      <!-- <div style="font-size: 12px; width: 110px; line-height: 18px">如不希望暴露密码，可输入 ******</div> -->
    </v-col>

    <!-- 日志采集路径 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>日志采集路径</label>
      <v-text-field
        v-model="formProvide.formObj['savePath']"
        outlined
        dense
        clearable
        height="34"
        class="ml-4 mr-15"
        :rules="[...h_validator.noEmpty('日志采集路径')]"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component
@http
@Validator(['noEmpty', 'realIP', 'topicNameFormatter'])
export default class CreateLogTopic extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private noRepeat: string[] = []
}
</script>
