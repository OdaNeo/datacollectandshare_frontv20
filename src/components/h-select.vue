<template>
  <v-col cols="12" class="HSelect d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-select
      v-bind="$attrs"
      outlined
      dense
      clearable
      :clear-icon="mdiCloseCircleOutline"
      height="35px"
      class="ml-4 mr-15"
      @change="$emit('input', $event)"
    ></v-select>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiCloseCircleOutline } from '@mdi/js'
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-file-input 组件（根组件不继承）
// 触发input事件传递，父组件可使用input 或者 v-model语法糖接收
@Component({
  inheritAttrs: false
})
export default class HSelect extends Vue {
  @Prop() private description!: string
  @Prop({ default: true }) private required!: boolean
  private mdiCloseCircleOutline = mdiCloseCircleOutline
}
</script>
