<template>
  <v-col cols="12" class="HFileUpLoad d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-file-input
      v-bind="$attrs"
      dense
      height="35px"
      show-size
      clearable
      :clear-icon="mdiCloseCircleOutline"
      class="ml-2 mr-15 pt-0 mt-0"
      @change="$emit('change', $event)"
    ></v-file-input>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiCloseCircleOutline } from '@mdi/js'
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-file-input 组件（根组件不继承）
// 触发change事件传递 File，父组件可使用change 或者 v-model语法糖接收
@Component({
  inheritAttrs: false
})
export default class HFileUpLoad extends Vue {
  @Prop({ default: true }) private required!: boolean
  @Prop() private description!: string
  private mdiCloseCircleOutline = mdiCloseCircleOutline
}
</script>
