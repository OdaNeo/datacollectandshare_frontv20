<template>
  <v-row no-gutters>
    <!-- 创建主题：主题名称 服务器IP 用户名 密码（是否 ？******） 采集地址（选择采集类型：文件->直接显示采集地址、文件夹-> 配置采集策略）， 
    校验：IP是否连通（按钮检测： ip&用户名&密码 是否连通） ，-->
    <!-- 主题名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
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
        v-model="formProvide.formObj['ip']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('服务器IP'), ...h_validator.realIP(), ...ipLink]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 用户名 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>用户名</label>
      <v-text-field
        v-model="formProvide.formObj['userName']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('用户名')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 密码 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>密码</label>
      <v-text-field
        v-model="formProvide.formObj['passWord']"
        outlined
        dense
        height="34"
        class="ml-4 mr-15"
        :rules="[...h_validator.noEmpty('密码')]"
      ></v-text-field>
    </v-col>

    <!-- IP是否连通 -->
    <v-col v-if="formProvide.formObj['passWord'] !== pWHolder" cols="12" class="d-flex mb-5">
      <label class="label mr-6">IP是否连通</label>
      <v-btn color="grey" height="34" outlined @click="validateIP">点击校验</v-btn>
      <!-- <span style="line-height: 34px; font-size: 12px" class="ml-4">不输入密码则无需校验</span> -->
    </v-col>

    <!-- 采集地址类型 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>采集地址类型</label>
      <v-radio-group
        v-model="formProvide.formObj['queneType']"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('采集地址类型')]"
        class="ml-4 my-0 pt-0 flex-grow-1"
      >
        <v-radio v-for="n in queneTypeItem" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>

    <!-- 采集地址 -->
    <v-col v-if="formProvide.formObj['queneType'] === 1" cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>采集地址</label>
      <v-text-field
        v-model="formProvide.formObj['采集地址']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('采集地址')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 配置采集策略 -->
    <v-col v-if="formProvide.formObj['queneType'] === 2" cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>配置采集策略</label>
      <v-text-field
        v-model="formProvide.formObj['配置采集策略']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('配置采集策略')]"
        class="ml-4 mr-15"
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
  private ipLink: string[] = []
  private pWHolder = ''

  private queneTypeItem = [
    { text: '文件', value: 1 },
    { text: '文件夹', value: 2 }
  ]

  private validateIP() {
    // const data = this.h_request['httpGET']('test', {
    //   ip: this.formProvide.formObj['ip'],
    //   userName: this.formProvide.formObj['userName'],
    //   passWord: this.formProvide.formObj['passWord']
    // })
    // console.log(data)
  }

  mounted(): void {
    this.pWHolder = this.formProvide.formObj['passWord']
  }
}
</script>
