<template>
  <div id="ContentDetails">
    <div style="line-height: 24px" v-html="obj"></div>

    <v-card-actions class="pa-0">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        height="35px"
        :disabled="!rowJson"
        text
        v-clipboard:copy="rowJson"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        >一键复制</v-btn
      >
    </v-card-actions>
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

  private onCopy() {
    this.h_utils.alertUtil.open('复制成功', true, 'success', 1500)
  }
  private onError() {
    this.h_utils.alertUtil.open('复制失败', true, 'error', 1500)
  }
}
</script>
