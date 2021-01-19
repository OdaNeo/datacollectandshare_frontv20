<template>
  <!-- 如果不指明 type 则不显示 -->
  <v-col v-if="formTypeItem.type" cols="12" class="d-flex justify-space-around">
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
      :rules="
        formTypeItem.rules
          ? [...noEmptyRules(formTypeItem.label), ...noRepeat, ...formTypeItem.rules]
          : [...noEmptyRules(formTypeItem.label), ...noRepeat]
      "
      class="mx-4 my-0"
      @input="inputEvent(formProvide.formObj[formTypeItem.valueName])"
    ></v-text-field>

    <!-- select emit select-change 事件 -->
    <v-select
      v-if="formTypeItem.type === 'select'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      clearable
      :multiple="!!formTypeItem.multiple"
      :label="formTypeItem.label ? `请选择${formTypeItem.label}` : '请选择'"
      :items="formTypeItem.items"
      :rules="
        formTypeItem.rules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.rules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      @change="$emit('select-change', formProvide.formObj)"
      class="mx-4 my-0"
    ></v-select>

    <!-- radio-group emit radio-group-change 事件-->
    <v-radio-group
      v-if="formTypeItem.type === 'radioGroup'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      row
      dense
      :rules="
        formTypeItem.rules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.rules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="mx-4 my-2 flex-grow-1"
      @change="$emit('radio-group-change', formProvide.formObj)"
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
        this.noRepeat = [(v: string) => !v || '主题名称已被注册']
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
        this.noRepeat = [(v: string) => !v || '命令名称已被注册']
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
      arr.push((v: string | Array<string>) => !!(v && v.toString()) || (str ? `${str}不能为空` : `此项不能为空`))
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
