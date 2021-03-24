<template>
  <v-row id="HMultiCheckBoxes" no-gutters class="d-flex mb-0">
    <v-col v-for="(item, index) in items" :key="item.id" :cols="cols">
      <!-- 非 Prop 的 Attribute 透传 -->
      <v-checkbox
        v-bind="$attrs"
        v-model="ex4"
        :label="item.text"
        color="primary"
        :value="item.value"
        class="mt-0 mb-2"
        :hide-details="index === ((Math.ceil(items.length / 3) || 1) - 1) * 3 ? false : true"
        @change="$emit('input', ex4)"
      ></v-checkbox>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
//  <!-- 非 Prop 的 Attribute 透传 -->
@Component({
  inheritAttrs: false
})
export default class HMultiCheckBoxes extends Vue {
  @Prop({ default: 4 }) private cols!: number
  @Prop({ required: true }) private value!: Array<unknown> // v-model
  @Prop({ required: true }) private items!: Array<{ text: unknown; value: unknown }>

  private ex4: Array<unknown> = []

  @Watch('value', { immediate: true })
  private test(val: Array<unknown> | undefined) {
    this.ex4 = val ? [...val] : []
  }
}
</script>
