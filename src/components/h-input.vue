<template>
  <!-- 如果不指明 type 则不显示 -->
  <v-col id="HInput" v-if="formTypeItem.type" cols="12" class="d-flex justify-space-around">
    <label class="label mr-2">
      <div v-if="formTypeItem.label">
        <span v-if="formTypeItem.require" class="require-span">*</span>{{ formTypeItem.label }}
      </div>
    </label>
    <!-- input类型 -->
    <v-text-field
      v-if="formTypeItem.type === 'input'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      clearable
      height="34"
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      :rules="
        formTypeItem.rules
          ? [...noEmptyRules(formTypeItem.label), ...noRepeat, ...formTypeItem.rules]
          : [...noEmptyRules(formTypeItem.label), ...noRepeat]
      "
      class="ml-4 mr-12"
      @input="inputEvent(formProvide.formObj[formTypeItem.valueName])"
    ></v-text-field>

    <!-- select-->
    <v-select
      v-if="formTypeItem.type === 'select'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      height="34"
      :multiple="!!formTypeItem.multiple"
      :label="formTypeItem.label ? `请选择${formTypeItem.label}` : '请选择'"
      :items="formTypeItem.items"
      :rules="
        formTypeItem.rules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.rules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="ml-4 mr-12 my-0"
    ></v-select>

    <!-- radio-group-->
    <v-radio-group
      v-if="formTypeItem.type === 'radioGroup'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      row
      dense
      height="34"
      :rules="
        formTypeItem.rules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.rules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="ml-4 mr-12 my-0 pt-0 flex-grow-1"
    >
      <v-radio
        v-for="n in formTypeItem.items"
        :key="n.value"
        :label="`${n.text}`"
        :value="n.value"
        :disabled="!!n.disabled"
      ></v-radio>
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

  private noRepeat: Function[] = []
  // rule: topicNameNoRepeat, cmdNameNoRepeat
  private async inputEvent(v: string) {
    if (this.formTypeItem.valueName === 'topicName' && v) {
      const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
        topicName: v
      })
      if (success) {
        this.noRepeat = [() => '主题名称已被注册']
      } else {
        this.noRepeat = []
      }
    } else if (
      this.formTypeItem.valueName === 'cmdName' &&
      this.formProvide.formObj.cmdName &&
      this.formProvide.formObj.producer
    ) {
      const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
        cmdName: this.formProvide.formObj.cmdName,
        producer: this.formProvide.formObj.producer
      })
      if (success) {
        this.noRepeat = [() => '命令名称已被注册']
      } else {
        this.noRepeat = []
      }
    } else {
      this.noRepeat = []
    }
  }
  // 非空校验
  private noEmptyRules(str?: string) {
    let arr: Array<any> = []
    // require
    if (this.formTypeItem.require) {
      arr.push(
        (v: string | number | Array<string>) => !!(v && v.toString()) || (str ? `${str}不能为空` : `此项不能为空`)
      )
    }
    return arr
  }
}
</script>
