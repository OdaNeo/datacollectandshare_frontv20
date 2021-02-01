<template>
  <!-- 如果不指明 type 则不显示 -->
  <v-col id="HInput" v-if="formTypeItem.type" cols="12" class="d-flex justify-space-around">
    <label class="label mr-2">
      <div v-if="formTypeItem.label">
        <span v-if="formTypeItem.require" class="require-span">*</span>{{ formTypeItem.label }}
      </div>
    </label>
    <!-- input类型-->
    <v-text-field
      v-if="formTypeItem.type === 'input'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      clearable
      height="34"
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      :rules="
        formTypeItem.otherRules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.otherRules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="ml-4 mr-11"
      style="max-width: 450px"
    ></v-text-field>

    <!-- textarea -->
    <v-textarea
      v-if="formTypeItem.type === 'textarea'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      :rules="
        formTypeItem.otherRules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.otherRules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="ml-4 mr-11"
      style="max-width: 450px"
    ></v-textarea>

    <!-- select下拉框 单选/多选-->
    <v-select
      v-if="formTypeItem.type === 'select'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      outlined
      dense
      height="34"
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      :multiple="!!formTypeItem.multiple"
      :label="formTypeItem.label ? `请选择${formTypeItem.label}` : '请选择'"
      :items="formTypeItem.items"
      :rules="
        formTypeItem.otherRules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.otherRules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="ml-4 mr-11 my-0"
      style="max-width: 450px"
    ></v-select>

    <!-- radio-group-->
    <v-radio-group
      v-if="formTypeItem.type === 'radioGroup'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      row
      dense
      height="34"
      :rules="
        formTypeItem.otherRules
          ? [...noEmptyRules(formTypeItem.label), ...formTypeItem.otherRules]
          : [...noEmptyRules(formTypeItem.label)]
      "
      class="ml-4 mr-11 my-0 pt-0 flex-grow-1"
      style="max-width: 450px"
    >
      <v-radio
        v-for="n in formTypeItem.items"
        :key="n.value"
        :label="`${n.text}`"
        :value="n.value"
        :disabled="!!n.disabled"
      ></v-radio>
    </v-radio-group>

    <!-- v-slider 存在默认值 -->
    <v-slider
      v-if="formTypeItem.type === 'slider'"
      v-model="formProvide.formObj[formTypeItem.valueName]"
      :disabled="formTypeItem.disabled && formTypeItem.disabled"
      class="align-center ml-4 mr-11 mb-4"
      style="max-width: 450px"
      :max="formTypeItem.items[1]"
      :min="formTypeItem.items[0]"
      hide-details
      :thumb-size="20"
      thumb-label="always"
    >
    </v-slider>

    <!-- doubleInput -->
    <div v-if="formTypeItem.type === 'doubleInput'" class="ml-2" style="min-width: 500px">
      <v-row
        class="d-flex justify-space-around"
        no-gutters
        v-for="(item, index) in formProvide.formObj[formTypeItem.valueName]"
        :key="item.id"
      >
        <v-col cols="5">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[0].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[0].text"
            :rules="
              formTypeItem.otherRules
                ? [...noEmptyRules(formTypeItem.itemLabels[0].text), ...formTypeItem.otherRules]
                : [...noEmptyRules(formTypeItem.itemLabels[0].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[1].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[1].text"
            :rules="
              formTypeItem.otherRules
                ? [...noEmptyRules(formTypeItem.itemLabels[1].text), ...formTypeItem.otherRules]
                : [...noEmptyRules(formTypeItem.itemLabels[1].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col v-if="formTypeItem.addItem" cols="1" class="d-flex justify-space-around">
          <v-btn
            v-if="formProvide.formObj[formTypeItem.valueName].length === index + 1"
            fab
            dark
            max-width="24"
            max-height="24"
            color="primary"
            style="margin-top: 5px"
            @click.stop="add(formTypeItem.valueName)"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="formProvide.formObj[formTypeItem.valueName].length > 1"
            fab
            dark
            max-width="24"
            max-height="24"
            color="primary"
            style="margin-top: 5px"
            @click.stop="minus(formTypeItem.valueName, index, item.disabled)"
          >
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
        </v-col>
        <v-col v-else cols="1" class="d-flex justify-space-around" />
      </v-row>
    </div>
    <!-- tripleInput -->
    <div v-if="formTypeItem.type === 'tripleInput'" class="ml-2" style="min-width: 450px">
      <v-row
        class="d-flex justify-space-around"
        no-gutters
        v-for="(item, index) in formProvide.formObj[formTypeItem.valueName]"
        :key="item.id"
      >
        <v-col cols="3">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[0].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[0].text"
            :rules="
              formTypeItem.otherRules
                ? [...noEmptyRules(formTypeItem.itemLabels[0].text), ...formTypeItem.otherRules]
                : [...noEmptyRules(formTypeItem.itemLabels[0].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[1].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[1].text"
            :rules="
              formTypeItem.otherRules
                ? [...noEmptyRules(formTypeItem.itemLabels[1].text), ...formTypeItem.otherRules]
                : [...noEmptyRules(formTypeItem.itemLabels[1].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="item[formTypeItem.itemLabels[2].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[2].text"
            :rules="
              formTypeItem.otherRules
                ? [...noEmptyRules(formTypeItem.itemLabels[2].text), ...formTypeItem.otherRules]
                : [...noEmptyRules(formTypeItem.itemLabels[2].text)]
            "
            height="34"
            :items="formTypeItem.items"
          ></v-select>
        </v-col>
        <v-col cols="1" class="d-flex justify-space-around">
          <v-btn
            v-if="formProvide.formObj[formTypeItem.valueName].length === index + 1"
            fab
            dark
            max-width="24"
            max-height="24"
            color="primary"
            style="margin-top: 5px"
            @click.stop="add(formTypeItem.valueName)"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="formProvide.formObj[formTypeItem.valueName].length > 1"
            fab
            dark
            max-width="24"
            max-height="24"
            color="primary"
            style="margin-top: 5px"
            @click.stop="minus(formTypeItem.valueName, index, item.disabled)"
          >
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
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

  @Prop() private formTypeItem!: InputType

  // add
  private add(valueName: string) {
    this.formTypeItem.itemLabels &&
      this.formProvide.formObj[valueName].push({
        [this.formTypeItem.itemLabels[0].value]: '',
        [this.formTypeItem.itemLabels[1].value]: '',
        [this.formTypeItem.itemLabels[2]?.value]: '',
        disabled: false
      })
  }
  // minus
  private minus(valueName: string, index: number, bo: boolean) {
    if (bo) {
      // disable 不能修改
      return
    } else {
      this.formProvide.formObj[valueName].splice(index, 1)
    }
  }

  // 统一非空校验
  private noEmptyRules(str?: string) {
    // require
    if (this.formTypeItem.require) {
      return [
        (v: string | number | Array<string>) => !!(v && v.toString()) || (str ? `${str}不能为空` : `此项不能为空`)
      ]
    } else {
      return []
    }
  }

  // private noRepeat: Function[] = []
  // rule: topicNameNoRepeat, cmdNameNoRepeat
  // private async inputEvent(v: string) {
  //   if (this.formTypeItem.valueName === 'topicName' && v) {
  //     const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
  //       topicName: v
  //     })
  //     if (success) {
  //       this.noRepeat = [() => '主题名称已被注册']
  //     } else {
  //       this.noRepeat = []
  //     }
  //   } else if (
  //     this.formTypeItem.valueName === 'cmdName' &&
  //     this.formProvide.formObj.cmdName &&
  //     this.formProvide.formObj.producer
  //   ) {
  //     const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
  //       cmdName: this.formProvide.formObj.cmdName,
  //       producer: this.formProvide.formObj.producer
  //     })
  //     if (success) {
  //       this.noRepeat = [() => '命令名称已被注册']
  //     } else {
  //       this.noRepeat = []
  //     }
  //   } else {
  //     this.noRepeat = []
  //   }
  // }
}
</script>
