<template>
  <v-col cols="12" class="HSlider d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-slider
      :value="slider"
      v-bind="$attrs"
      class="align-center ml-4 mb-4 mr-15"
      hide-details
      :thumb-size="20"
      thumb-label="always"
      @input="$emit('input', $event)"
    >
      <template v-slot:append>
        <v-text-field
          :value="slider"
          class="mt-0 pt-0"
          hide-details
          dense
          disabled
          single-line
          style="width: 20px"
        ></v-text-field>
      </template>
    </v-slider>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-file-input 组件（根组件不继承）
// 触发input事件传递，父组件可使用input 或者 v-model语法糖接收
@Component({
  inheritAttrs: false
})
export default class HSlider extends Vue {
  @Prop() private description!: string
  @Prop() private value!: number
  @Prop({ default: true }) private required!: boolean

  private slider = 1

  @Watch('value', { immediate: true })
  private changeValue(val: number) {
    this.slider = val
  }
}
</script>
