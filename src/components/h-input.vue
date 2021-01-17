<template>
  <v-col cols="12" class="d-flex justify-space-around">
    <label class="label">
      <div v-if="formTypeItem.label">
        <span v-if="formTypeItem.require" class="require-span">*</span>{{ formTypeItem.label }}：
      </div>
    </label>
    <!-- input类型，input-change 事件 -->
    <v-text-field
      v-if="formTypeItem.type === 'input'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      clearable
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      :rules="[...getRules(formTypeItem.label), ...topicRepeat]"
      class="mx-4 my-0"
      @input="inputEvent(formProvide.formObj[formTypeItem.valueName])"
    ></v-text-field>

    <!-- select，emit select-change 事件 -->
    <v-select
      v-if="formTypeItem.type === 'select'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      clearable
      :label="formTypeItem.label ? `请选择${formTypeItem.label}` : '请选择'"
      :items="formTypeItem.items"
      :rules="[...getRules(formTypeItem.label)]"
      @change="$emit('select-change', formProvide.formObj)"
      class="mx-4 my-0"
    ></v-select>

    <!-- radio-group emit radio-group-change 事件-->
    <v-radio-group
      v-if="formTypeItem.type === 'radioGroup'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      row
      dense
      :rules="[...getRules(formTypeItem.label)]"
      class="mx-4 my-2 flex-grow-1"
      @change="$emit('radio-group-change', formProvide.formObj)"
    >
      <v-radio v-for="n in formTypeItem.items" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
    </v-radio-group>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { InputType } from '@/type/dialog-form.type'
import http from '@/decorator/httpDecorator'

@http
@Component
export default class HInput extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private index!: any
  @Prop() private formTypeItem!: InputType

  private menuStart = false
  private topicRepeat: Function[] = []

  // rule: topicNameNoRepeat
  private async inputEvent(v: string) {
    if (this.formTypeItem.rules && this.formTypeItem.rules.includes('topicNameNoRepeat') && v) {
      const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
        topicName: v
      })
      if (success) {
        this.topicRepeat = [(v: string) => !v || '主题名称已被注册']
      } else {
        this.topicRepeat = []
      }
    } else {
      this.topicRepeat = []
    }
  }

  private rulesType(str: string) {
    switch (str) {
      case 'topicNameFormatter':
        return [
          (v: string) => (v && v.length <= 40) || '主题名称最长可设置40个字符',
          (v: string) => /^[\w@.]*$/.test(v) || '内容只能为数字、字母、下划线、.、@的组合'
        ]
      default:
        return []
    }
  }

  // 校验
  private getRules(str?: string) {
    let arr: Array<any> = []
    // require 非空校验
    if (this.formTypeItem.require) {
      arr.push((v: string) => !!v || (str ? `${str}不能为空` : `不能为空`))
    }
    // 其他规则
    if (this.formTypeItem.rules) {
      for (let i = 0; i < this.formTypeItem.rules.length; i++) {
        arr = arr.concat(this.rulesType(this.formTypeItem.rules[i]))
      }
    }

    return arr
  }
}
</script>
<style scoped>
.label {
  min-width: 125px;
  display: flex;
  justify-content: flex-end;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 42px;
}
.label-end {
  width: 80px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 42px;
}
</style>
