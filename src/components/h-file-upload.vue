<template>
  <v-col cols="12" class="d-flex">
    <label class="label mr-2"><span v-if="require" class="require-span">*</span>{{ description }}</label>
    <v-file-input
      v-bind="$attrs"
      dense
      height="35px"
      outlined
      show-size
      class="ml-4 mr-15 pt-0"
      @change="$emit('change', $event)"
    ></v-file-input>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  inheritAttrs: false
})
export default class HFileUpLoad extends Vue {
  @Prop({ default: true }) private require!: boolean
  @Prop() private description!: string
}
</script>
