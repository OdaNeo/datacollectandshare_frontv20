<template>
  <div id="ContentDetails">
    <div style="line-height: 24px" v-html="obj"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import util from '@/decorator/utilsDecorator'

@util
@Component({})
export default class ContentDetails extends Vue {
  @Prop() private rowJson!: string

  private get obj() {
    if (this.rowJson !== '') {
      const _obj = JSON.parse(this.rowJson)
      return `{${this.h_utils['formatUtil'].objToHTML(_obj)}}`
    } else {
      return ``
    }
  }
}
</script>
