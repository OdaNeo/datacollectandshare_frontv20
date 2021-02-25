<template>
  <div id="ContentDetails">
    <v-container style="max-height: 400px; overflow: auto" v-html="obj"></v-container>
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
      return `<div style="font-size: 16px;line-height: 24px;">
                {${this.h_utils['formatUtil'].objToHTML(_obj)}}
              </div>`
    } else {
      return ``
    }
  }
}
</script>
