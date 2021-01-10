<template>
  <v-row no-gutters>
    <v-col cols="11" class="d-flex">
      <v-select
        single-line
        outlined
        dense
        solo
        label="请选择配置类型"
        :items="types"
        class="dialogInput"
        v-model="formProvide.formObj.type"
        :rules="typeRules"
        @change="typeChange"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>配置类型：</label>
          </div>
        </template>
      </v-select>
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput ml-10"
        v-if="formProvide.formObj.type === '其他'"
        v-model="formProvide.formObj.typeInput"
        :rules="typeInputRules"
        required
      >
      </v-text-field>
    </v-col>
    <v-col cols="11" class="d-flex">
      <v-select
        single-line
        outlined
        dense
        solo
        label="请选择配置名称"
        :items="names"
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.name"
        :rules="nameRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>配置名称：</label>
          </div>
        </template>
      </v-select>
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput ml-10"
        v-if="formProvide.formObj.name === '其他'"
        v-model="formProvide.formObj.nameInput"
        :rules="nameInputRules"
        required
      >
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
        v-model="formProvide.formObj.value"
        :rules="valueRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>配置属性：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class CreateConfigureDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private types = [
    { text: 'network', value: 'network', disabled: false },
    { text: 'system', value: 'system', disabled: false },
    { text: '其他', value: '其他', disabled: false }
  ]

  private names = [
    { text: 'kafka', value: 'kafka', disabled: false },
    { text: 'redis', value: 'redis', disabled: false },
    { text: '其他', value: '其他', disabled: false }
  ]

  private typeRules = [(v: string) => !!v || '请选择配置类型']

  private typeInputRules = [
    (v: string) => !!v || '请设置配置类型',
    (v: string) => (v && v.length <= 10) || '长度最大为10个字符',
    (v: string) => (v && v !== 'network') || '不能填写network',
    (v: string) => (v && v !== 'system') || '不能填写system'
  ]

  private nameRules = [(v: string) => !!v || '请选择配置名称']

  private nameInputRules = [
    (v: string) => !!v || '请设置配置名称',
    (v: string) => (v && v.length <= 10) || '长度最大为10个字符',
    (v: string) => (v && v !== 'kafka') || '不能填写kafka',
    (v: string) => (v && v !== 'redis') || '不能填写redis'
  ]

  private valueRules = [
    (v: string) => !!v || '请设置配置属性',
    (v: string) => (v && v.length <= 120) || '长度最大为120个字符'
  ]

  private typeChange(value: string) {
    if (value === '其他') {
      this.names[0].disabled = false
      this.names[1].disabled = false
      this.names[2].disabled = true
      this.formProvide.formObj.name = ''
    } else {
      this.names[0].disabled = true
      this.names[1].disabled = true
      this.names[2].disabled = false
      this.formProvide.formObj.name = '其他'
    }
  }

  private clearMethod() {
    this.names[0].disabled = false
    this.names[1].disabled = false
    this.names[2].disabled = false
  }
}
</script>
