<template>
  <v-col id="HMultiCheckBoxes" cols="12" class="d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-row no-gutters class="d-flex mb-0 ml-4 mr-15">
      <v-col v-for="(item, index) in items" :key="item.id" :cols="cols">
        <!-- 非 Prop 的 Attribute 透传 -->
        <v-checkbox
          v-model="ex4"
          v-bind="$attrs"
          :label="item.text"
          color="primary"
          :value="item.value"
          class="mt-0 mb-2"
          @change="$emit('input', ex4)"
          :hide-details="index === ((Math.ceil(items.length / (12 / cols)) || 1) - 1) * (12 / cols) ? false : true"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
//  <!-- 非 Prop 的 Attribute 透传 -->
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-checkbox 组件（根组件不继承）
// 触发input， 父组件通过v-model接收
@Component({
  inheritAttrs: false
})
export default class HMultiCheckBoxes extends Vue {
  @Prop({ default: 4 }) private cols!: number
  @Prop() private value!: Array<unknown> // v-model
  @Prop({ required: true }) private items!: Array<{ text: unknown; value: unknown }>
  @Prop({ default: true }) private required!: boolean
  @Prop() private description!: string

  private ex4: Array<unknown> = []

  @Watch('value', { immediate: true })
  private changeValue(val: Array<unknown> | undefined) {
    this.ex4 = val ? [...val] : []
  }
}
</script>
