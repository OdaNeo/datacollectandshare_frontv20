<template>
  <v-row no-gutters>
    <!-- 系统名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>系统名称</label>
      <v-select
        v-model="formProvide.formObj['systemId']"
        outlined
        dense
        clearable
        :disabled="formProvide.formObj.canNotEdit"
        height="34"
        label="请选择系统名称"
        :rules="[...h_validator.noEmpty('系统名称')]"
        :items="systems"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
    <!-- 网络名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>网络名称</label>
      <v-select
        v-model="formProvide.formObj['networkId']"
        outlined
        dense
        clearable
        :disabled="formProvide.formObj.canNotEdit"
        height="34"
        label="请选择网络名称"
        :rules="[...h_validator.noEmpty('网络名称')]"
        :items="networks"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component
@http
@Validator(['noEmpty'])
export default class BindNetDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private networks!: any
  @Prop() private systems!: any

  // private formTypeObj: Array<InputType> = [
  //   {
  //     label: '系统名称',
  //     valueName: 'systemId',
  //     type: 'select',
  //     items: this.systems,
  //     require: true
  //   },
  //   {
  //     label: '网络名称',
  //     valueName: 'networkId',
  //     type: 'select',
  //     items: this.networks,
  //     require: true
  //   }
  // ]
}
</script>
