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
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!-- baseUrl  -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>baseUrl</label>
      <v-text-field
        v-model="formProvide.formObj['baseUrl']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('baseUrl')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!-- FTP地址 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>FTP地址</label>
      <div class="ml-4 flex-grow-1">
        <v-row
          v-for="item in formProvide.formObj.ftp"
          :key="item.id"
          class="d-flex justify-space-between mr-15"
          no-gutters
        >
          <v-col class="mr-2">
            <v-text-field
              v-model="item[ftpItem[0].value]"
              dense
              outlined
              :disabled="formProvide.formObj.canNotEdit"
              :label="ftpItem[0].text"
              height="34"
              :rules="[...h_validator.noEmpty('host')]"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item[ftpItem[1].value]"
              dense
              :disabled="formProvide.formObj.canNotEdit"
              outlined
              :label="ftpItem[1].text"
              :rules="[...h_validator.noEmpty('post'), ...h_validator.isNumber()]"
              height="34"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <!-- FTP账号  -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>FTP账号</label>
      <v-text-field
        v-model="formProvide.formObj['userName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('FTP账号')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!-- FTP密码  -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>FTP密码</label>
      <v-text-field
        v-model="formProvide.formObj['password']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('FTP密码')]"
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

@Component({})
@http
@Validator(['noEmpty', 'topicNameFormatter', 'isNumber'])
export default class PullFTP extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []
  private ftpItem = [
    { text: 'host', value: 'host' },
    { text: 'port', value: 'port' }
  ]
}
</script>
