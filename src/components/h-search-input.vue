<template>
  <v-col id="HSearchInput" :cols="cols" class="d-flex">
    <v-text-field
      v-bind="$attrs"
      outlined
      dense
      clearable
      :clear-icon="mdiCloseCircleOutline"
      height="35px"
      @input="$emit('input', $event)"
    ></v-text-field>
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
export default class HSearchInput extends Vue {
  @Prop({ default: 12 }) private cols!: number
  private mdiCloseCircleOutline = mdiCloseCircleOutline
}
</script>
