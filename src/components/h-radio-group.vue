<template>
  <v-col cols="12" class="HRadioGroup d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-radio-group
      v-bind="$attrs"
      row
      dense
      height="35px"
      class="ml-4 my-0 pt-0 flex-grow-1 mr-15"
      @change="$emit('input', $event)"
    >
      <v-radio
        v-for="n in items"
        :key="n.value"
        :label="`${n.text}`"
        :value="n.value"
        :disabled="n.disabled ? n.disabled : false"
      ></v-radio>
    </v-radio-group>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-file-input 组件（根组件不继承）
// 触发input事件传递，父组件可使用input 或者 v-model语法糖接收
@Component({
  inheritAttrs: false
})
export default class HRadioGroup extends Vue {
  @Prop() private description!: string
  @Prop({ default: true }) private required!: boolean
  @Prop({ required: true }) private items!: { text: string; value: unknown }[]
}
</script>
