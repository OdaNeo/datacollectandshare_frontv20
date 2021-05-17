<template>
  <v-col :cols="cols" class="HSearch d-flex">
    <v-text-field
      v-bind="$attrs"
      outlined
      dense
      clearable
      height="35px"
      :append-icon="showAppEnd ? mdiMagnify : undefined"
      :clear-icon="mdiCloseCircleOutline"
      @click:prepend="$emit('prepend')"
      @click:append="$emit('append')"
      @keyup.enter="$emit('enter')"
      @click:clear="$emit('clear')"
      @input.native="handleInput"
    >
    </v-text-field>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiCloseCircleOutline, mdiMagnify } from '@mdi/js'
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-file-input 组件（根组件不继承）
// 触发input事件传递，父组件可使用input 或者 v-model语法糖接收
@Component({
  inheritAttrs: false
})
export default class HSearch extends Vue {
  @Prop({ default: 3 }) private cols!: number
  @Prop({ default: true }) private showAppEnd!: boolean

  private mdiCloseCircleOutline = mdiCloseCircleOutline
  private mdiMagnify = mdiMagnify

  private handleInput(e: Event) {
    // console.log(e)
    // console.log(e.target.value)

    const _target = e.target as HTMLInputElement
    this.$emit('input', _target.value)
  }
}
</script>
