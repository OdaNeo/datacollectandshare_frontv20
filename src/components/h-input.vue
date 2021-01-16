<template>
  <!-- input类型，默认类型 -->
  <v-col v-if="!formTypeItem.type || formTypeItem.type === 'input'" cols="12" class="d-flex justify-space-around">
    <label class="label"
      ><span v-if="formTypeItem.require" class="require-span">*</span>{{ formTypeItem.label }}：</label
    >
    <v-text-field
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      clearable
      :rules="[...getRules(formTypeItem.label), ...topicRepeat]"
      class="mx-4 my-0"
      @input="inputEvent(formProvide.formObj[formTypeItem.valueName])"
    ></v-text-field>
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

  private async inputEvent(v: string) {
    if (this.formTypeItem.rules.includes('topicNameNoRepeat') && v) {
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
  private getRules(str: string) {
    let arr: Array<any> = []
    // require 非空校验
    if (this.formTypeItem.require) {
      arr.push((v: string) => !!v || `${str}不能为空`)
    }
    // 其他规则
    for (let i = 0; i < this.formTypeItem.rules.length; i++) {
      arr = arr.concat(this.rulesType(this.formTypeItem.rules[i]))
    }
    return arr
  }
}
</script>
<style scoped>
.label {
  width: 125px;
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
