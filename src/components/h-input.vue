<template>
  <!-- 如果不指明 type 则不显示 -->
  <div id="HInput" v-if="formTypeItem.type" class="d-flex">
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
      class="ml-4"
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
      class="ml-4"
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
      class="ml-4 my-0"
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
      class="ml-4 my-0 pt-0 flex-grow-1"
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
      class="align-center ml-4 mb-4"
      :max="formTypeItem.items[1]"
      :min="formTypeItem.items[0]"
      hide-details
      :thumb-size="20"
      thumb-label="always"
    >
    </v-slider>

    <!-- doubleInput -->
    <div v-if="formTypeItem.type === 'doubleInput'" class="ml-4">
      <v-row
        class="d-flex justify-space-between"
        no-gutters
        v-for="(item, index) in formProvide.formObj[formTypeItem.valueName]"
        :key="item.id"
      >
        <v-col class="mr-2">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[0].value]"
            dense
            outlined
            clearable
            :disabled="formTypeItem.disabled && formTypeItem.disabled"
            :label="formTypeItem.itemLabels[0].text"
            :rules="
              formTypeItem.otherRules_0
                ? [...noEmptyRules(formTypeItem.itemLabels[0].text), ...formTypeItem.otherRules_0]
                : [...noEmptyRules(formTypeItem.itemLabels[0].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="item[formTypeItem.itemLabels[1].value]"
            dense
            outlined
            clearable
            :disabled="formTypeItem.disabled && formTypeItem.disabled"
            :label="formTypeItem.itemLabels[1].text"
            :rules="
              formTypeItem.otherRules_1
                ? [...noEmptyRules(formTypeItem.itemLabels[1].text), ...formTypeItem.otherRules_1]
                : [...noEmptyRules(formTypeItem.itemLabels[1].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <!-- 按钮 -->
        <v-col
          v-if="formTypeItem.addItem && !formTypeItem.disabled"
          class="d-flex justify-space-around label-end-polyfill flex-grow-0"
        >
          <v-btn
            v-if="formProvide.formObj[formTypeItem.valueName].length === index + 1"
            fab
            dark
            max-width="24"
            max-height="24"
            color="primary"
            style="margin-top: 5px"
            @click.stop="add2(formTypeItem.valueName)"
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
            @click.stop="minus(formTypeItem.valueName, index)"
          >
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
        </v-col>
        <v-col v-else class="label-end-polyfill flex-grow-0"></v-col>
      </v-row>
    </div>

    <!-- tripleInput -->
    <div v-if="formTypeItem.type === 'tripleInput'" class="ml-4">
      <v-row
        class="d-flex justify-space-between"
        no-gutters
        v-for="(item, index) in formProvide.formObj[formTypeItem.valueName]"
        :key="item.id"
      >
        <v-col class="mr-2">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[0].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[0].text"
            :rules="
              formTypeItem.otherRules_0
                ? [...noEmptyRules(formTypeItem.itemLabels[0].text), ...formTypeItem.otherRules_0]
                : [...noEmptyRules(formTypeItem.itemLabels[0].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col class="mr-2">
          <v-text-field
            v-model="item[formTypeItem.itemLabels[1].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[1].text"
            :rules="
              formTypeItem.otherRules_1
                ? [...noEmptyRules(formTypeItem.itemLabels[1].text), ...formTypeItem.otherRules_1]
                : [...noEmptyRules(formTypeItem.itemLabels[1].text)]
            "
            height="34"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            v-model="item[formTypeItem.itemLabels[2].value]"
            dense
            outlined
            :disabled="item.disabled"
            :label="formTypeItem.itemLabels[2].text"
            :rules="
              formTypeItem.otherRules_2
                ? [...noEmptyRules(formTypeItem.itemLabels[2].text), ...formTypeItem.otherRules_2]
                : [...noEmptyRules(formTypeItem.itemLabels[2].text)]
            "
            height="34"
            :items="formTypeItem.items"
          ></v-select>
        </v-col>
        <!-- 按钮 -->
        <v-col class="d-flex justify-space-around label-end-polyfill flex-grow-0">
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
            v-if="!item.disabled && formProvide.formObj[formTypeItem.valueName].length > 1"
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
    <!-- 保留显示尾部加减号的空间 -->
    <!-- 仅doubleInput  tripleInput显示 -->
    <div v-if="formTypeItem.type !== 'doubleInput' && formTypeItem.type !== 'tripleInput'" class="label-end-polyfill" />
  </div>
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
        [this.formTypeItem.itemLabels[2].value]: '',
        disabled: false
      })
  }
  // add2
  private add2(valueName: string) {
    this.formTypeItem.itemLabels &&
      this.formProvide.formObj[valueName].push({
        [this.formTypeItem.itemLabels[0].value]: '',
        [this.formTypeItem.itemLabels[1].value]: ''
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
}
</script>
<style scoped>
#HInput {
  width: 100%;
}
.label-end-polyfill {
  min-width: 60px;
}
</style>
