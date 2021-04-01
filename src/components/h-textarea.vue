<template>
  <v-col cols="12" class="HTextArea d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-textarea
      v-bind="$attrs"
      outlined
      auto-grow
      rows="3"
      class="ml-4 mr-15"
      @input="$emit('input', $event)"
    ></v-textarea>
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
export default class HTextArea extends Vue {
  @Prop() private description!: string
  @Prop({ default: true }) private required!: boolean
}
</script>
