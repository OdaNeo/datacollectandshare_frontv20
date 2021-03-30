<template>
  <div id="SqlDetails">
    <div
      style="max-height: 400px; overflow: auto; margin-bottom: 15px; font-size: 16px; line-height: 24px"
      v-html="obj"
    ></div>

    <v-card-actions class="pa-0">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        height="35px"
        :disabled="!str"
        text
        v-clipboard:copy="str"
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
export default class SqlDetails extends Vue {
  @Prop() private str!: string

  private get obj() {
    if (this.str) {
      return this.str.replaceAll('/n', '<br />')
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
