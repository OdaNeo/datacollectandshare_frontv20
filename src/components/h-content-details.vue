<template>
  <div id="ContentDetails">
    <div style="line-height: 24px" v-html="obj"></div>
    <v-card-actions class="pa-0">
      <v-spacer></v-spacer>
      <v-btn
        slot="button"
        color="primary"
        :disabled="!row"
        text
        v-clipboard:copy="rowJson"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >
        一键复制
      </v-btn>
    </v-card-actions>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import util from '@/decorator/utilsDecorator'

@util
@Component
export default class HContentDetails extends Vue {
  @Prop() private row!: object | string

  private get obj() {
    if (Object.prototype.toString.call(this.row) === '[object Object]') {
      return `{${this.h_utils['formatUtil'].objToHTML(this.row)}}`
    } else if (typeof this.row === 'string') {
      return this.row.replaceAll('\n', '<br />')
    } else {
      return this.row
    }
  }

  // 复制
  private get rowJson() {
    return JSON.stringify(this.row)
  }

  // 复制
  private onCopy() {
    this.h_utils.alertUtil.open('复制成功', true, 'success', 1000)
  }
  // 复制
  private onError() {
    this.h_utils.alertUtil.open('复制失败', true, 'error', 1000)
  }
}
</script>
