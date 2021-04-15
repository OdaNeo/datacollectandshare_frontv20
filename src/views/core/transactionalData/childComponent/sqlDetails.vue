<template>
  <div id="SqlDetails">
    <div style="line-height: 24px" v-html="obj"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class SqlDetails extends Vue {
  @Prop() private str!: string

  private get obj() {
    if (this.str) {
      return this.str.replaceAll('/n', '<br />')
    } else {
      return ``
    }
  }
}
</script>
